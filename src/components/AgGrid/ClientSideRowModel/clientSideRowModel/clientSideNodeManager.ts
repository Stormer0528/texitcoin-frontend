import type {
  EventService,
  BeanCollection,
  FuncColsService,
  ISelectionService,
  GridOptionsService,
  RowDataTransaction,
  RowNodeTransaction,
  SelectionEventSourceType,
} from '@ag-grid-community/core';

import {
  RowNode,
  _warnOnce,
  _errorOnce,
  _cloneObject,
  _missingOrEmpty,
  _getRowIdCallback,
} from '@ag-grid-community/core';

const ROOT_NODE_ID = 'ROOT_NODE_ID';
const TOP_LEVEL = 0;

/**
 * This is the type of any row in allLeafChildren and childrenAfterGroup of the ClientSideNodeManager rootNode.
 * ClientSideNodeManager is allowed to update the sourceRowIndex property of the nodes.
 */
interface ClientSideNodeManagerRowNode extends RowNode {
  sourceRowIndex: number;
}

/**
 * This is the type of the root RowNode of the ClientSideNodeManager
 * ClientSideNodeManager is allowed to update the allLeafChildren and childrenAfterGroup properties of the root node.
 */
interface ClientSideNodeManagerRootNode extends RowNode {
  allLeafChildren: ClientSideNodeManagerRowNode[] | null;
  childrenAfterGroup: ClientSideNodeManagerRowNode[] | null;
}

/** Result of ClientSideNodeManager.updateRowData method */
export interface ClientSideNodeManagerUpdateRowDataResult {
  /** The RowNodeTransaction containing all the removals, updates and additions */
  rowNodeTransaction: RowNodeTransaction;

  /** True if at least one row was inserted (and not just appended) */
  rowsInserted: boolean;
}

export class ClientSideNodeManager {
  private readonly rootNode: ClientSideNodeManagerRootNode;

  private gos: GridOptionsService;

  private eventService: EventService;

  private funcColsService: FuncColsService;

  private selectionService: ISelectionService;

  private beans: BeanCollection;

  private nextId = 0;

  // has row data actually been set
  private rowCountReady = false;

  // when user is provide the id's, we also keep a map of ids to row nodes for convenience
  private allNodesMap: { [id: string]: RowNode } = {};

  constructor(
    rootNode: RowNode,
    gos: GridOptionsService,
    eventService: EventService,
    funcColsService: FuncColsService,
    selectionService: ISelectionService,
    beans: BeanCollection
  ) {
    this.rootNode = rootNode;
    this.gos = gos;
    this.eventService = eventService;
    this.funcColsService = funcColsService;
    this.beans = beans;
    this.selectionService = selectionService;

    this.rootNode.group = true;
    this.rootNode.level = -1;
    this.rootNode.id = ROOT_NODE_ID;
    this.rootNode.allLeafChildren = [];
    this.rootNode.childrenAfterGroup = [];
    this.rootNode.childrenAfterSort = [];
    this.rootNode.childrenAfterAggFilter = [];
    this.rootNode.childrenAfterFilter = [];
  }

  public getCopyOfNodesMap(): { [id: string]: RowNode } {
    return _cloneObject(this.allNodesMap);
  }

  public getRowNode(id: string): RowNode | undefined {
    return this.allNodesMap[id];
  }

  public setRowData(rowData: any[]): RowNode[] | undefined {
    if (typeof rowData === 'string') {
      _warnOnce('rowData must be an array.');
      return;
    }
    this.rowCountReady = true;

    this.dispatchRowDataUpdateStartedEvent(rowData);

    const { rootNode } = this;
    const { sibling } = this.rootNode;

    rootNode.childrenAfterFilter = null;
    rootNode.childrenAfterGroup = null;
    rootNode.childrenAfterAggFilter = null;
    rootNode.childrenAfterSort = null;
    rootNode.childrenMapped = null;
    rootNode.updateHasChildren();

    this.nextId = 0;
    this.allNodesMap = {};

    if (rowData) {
      // we use rootNode as the parent, however if using ag-grid-enterprise, the grouping stage
      // sets the parent node on each row (even if we are not grouping). so setting parent node
      // here is for benefit of ag-grid-community users
      rootNode.allLeafChildren = rowData.map((dataItem, index) =>
        this.createNode(dataItem, this.rootNode, TOP_LEVEL, index)
      );
    } else {
      rootNode.allLeafChildren = [];
      rootNode.childrenAfterGroup = [];
    }

    if (sibling) {
      sibling.childrenAfterFilter = rootNode.childrenAfterFilter;
      // @ts-ignore
      sibling.childrenAfterGroup = rootNode.childrenAfterGroup;
      sibling.childrenAfterAggFilter = rootNode.childrenAfterAggFilter;
      sibling.childrenAfterSort = rootNode.childrenAfterSort;
      sibling.childrenMapped = rootNode.childrenMapped;
      // @ts-ignore
      sibling.allLeafChildren = rootNode.allLeafChildren;
    }
  }

  public updateRowData(rowDataTran: RowDataTransaction): ClientSideNodeManagerUpdateRowDataResult {
    this.rowCountReady = true;
    this.dispatchRowDataUpdateStartedEvent(rowDataTran.add);

    const updateRowDataResult: ClientSideNodeManagerUpdateRowDataResult = {
      rowNodeTransaction: { remove: [], update: [], add: [] },
      rowsInserted: false,
    };

    const nodesToUnselect: RowNode[] = [];

    this.executeRemove(rowDataTran, updateRowDataResult, nodesToUnselect);
    this.executeUpdate(rowDataTran, updateRowDataResult, nodesToUnselect);
    this.executeAdd(rowDataTran, updateRowDataResult);

    this.updateSelection(nodesToUnselect, 'rowDataChanged');

    return updateRowDataResult;
  }

  /**
   * Used by the immutable service, after updateRowData, after updating with a generated transaction to
   * apply the order as specified by the the new data. We use sourceRowIndex to determine the order of the rows.
   * Time complexity is O(n) where n is the number of rows/rowData
   * @returns true if the order changed, otherwise false
   */
  public updateRowOrderFromRowData<TData>(rowData: TData[]): boolean {
    const rows = this.rootNode.allLeafChildren;
    const rowsLength = rows?.length ?? 0;
    const rowsOutOfOrder = new Map<TData, ClientSideNodeManagerRowNode>();
    let firstIndexOutOfOrder = -1;
    let lastIndexOutOfOrder = -1;

    // Step 1: Build the rowsOutOfOrder mapping data => row for the rows out of order, in O(n)
    for (let i = 0; i < rowsLength; ++i) {
      const row = rows![i];
      const { data } = row;
      if (data !== rowData[i]) {
        // The row is not in the correct position
        if (lastIndexOutOfOrder < 0) {
          firstIndexOutOfOrder = i; // First row out of order was found
        }
        lastIndexOutOfOrder = i; // Last row out of order
        rowsOutOfOrder.set(data, row); // A new row out of order was found, add it to the map
      }
    }
    if (firstIndexOutOfOrder < 0) {
      return false; // No rows out of order
    }

    // Step 2: Overwrite the rows out of order we find in the map, in O(n)
    for (let i = firstIndexOutOfOrder; i <= lastIndexOutOfOrder; ++i) {
      const row = rowsOutOfOrder.get(rowData[i]);
      if (row !== undefined) {
        rows![i] = row; // Out of order row found, overwrite it
        row.sourceRowIndex = i; // Update its position
      }
    }
    return true; // The order changed
  }

  public isRowCountReady(): boolean {
    return this.rowCountReady;
  }

  private dispatchRowDataUpdateStartedEvent(rowData?: any[] | null): void {
    this.eventService.dispatchEvent({
      type: 'rowDataUpdateStarted',
      firstRowData: rowData?.length ? rowData[0] : null,
    });
  }

  private updateSelection(nodesToUnselect: RowNode[], source: SelectionEventSourceType): void {
    const selectionChanged = nodesToUnselect.length > 0;
    if (selectionChanged) {
      this.selectionService.setNodesSelected({
        newValue: false,
        nodes: nodesToUnselect,
        suppressFinishActions: true,
        source,
      });
    }

    // we do this regardless of nodes to unselect or not, as it's possible
    // a new node was inserted, so a parent that was previously selected (as all
    // children were selected) should not be tri-state (as new one unselected against
    // all other selected children).
    this.selectionService.updateGroupsFromChildrenSelections(source);

    if (selectionChanged) {
      this.eventService.dispatchEvent({
        type: 'selectionChanged',
        source,
      });
    }
  }

  private executeAdd(
    rowDataTran: RowDataTransaction,
    result: ClientSideNodeManagerUpdateRowDataResult
  ): void {
    const { add } = rowDataTran;
    if (_missingOrEmpty(add)) {
      return;
    }

    const allLeafChildren = this.rootNode.allLeafChildren!;
    let addIndex = allLeafChildren.length;

    if (typeof rowDataTran.addIndex === 'number') {
      addIndex = this.sanitizeAddIndex(rowDataTran.addIndex);

      if (addIndex > 0) {
        // TODO: this code should not be here, see AG-12602
        // This was a fix for AG-6231, but is not the correct fix
        const isTreeData = this.gos.get('treeData');
        if (isTreeData) {
          for (let i = 0; i < allLeafChildren.length; i++) {
            const node = allLeafChildren[i];
            if (node?.rowIndex == addIndex - 1) {
              addIndex = i + 1;
              break;
            }
          }
        }
      }
    }

    // create new row nodes for each data item
    const newNodes: RowNode[] = add!.map((item, index) =>
      this.createNode(item, this.rootNode, TOP_LEVEL, addIndex + index)
    );

    if (addIndex < allLeafChildren.length) {
      // Insert at the specified index

      const nodesBeforeIndex = allLeafChildren.slice(0, addIndex);
      const nodesAfterIndex = allLeafChildren.slice(addIndex, allLeafChildren.length);

      // update latter row indexes
      const nodesAfterIndexFirstIndex = nodesBeforeIndex.length + newNodes.length;
      for (let index = 0, { length } = nodesAfterIndex; index < length; ++index) {
        nodesAfterIndex[index].sourceRowIndex = nodesAfterIndexFirstIndex + index;
      }

      this.rootNode.allLeafChildren = [...nodesBeforeIndex, ...newNodes, ...nodesAfterIndex];

      // Mark the result as rows inserted
      result.rowsInserted = true;
    } else {
      // Just append at the end
      this.rootNode.allLeafChildren = allLeafChildren.concat(newNodes);
    }

    const { sibling } = this.rootNode;
    if (sibling) {
      // @ts-ignore
      sibling.allLeafChildren = allLeafChildren;
    }

    // add new row nodes to the transaction add items
    result.rowNodeTransaction.add = newNodes;
  }

  private sanitizeAddIndex(addIndex: number): number {
    const allChildrenCount = this.rootNode.allLeafChildren?.length ?? 0;
    if (addIndex < 0 || addIndex >= allChildrenCount || Number.isNaN(addIndex)) {
      return allChildrenCount; // Append. Also for negative values, as it was historically the behavior.
    }

    // Ensure index is a whole number and not a floating point.
    // Use case: the user want to add a row in the middle, doing addIndex = array.length / 2.
    // If the array has an odd number of elements, the addIndex need to be rounded up.
    // Consider that array.slice does round up internally, but we are setting this value to node.sourceRowIndex.
    return Math.ceil(addIndex);
  }

  private executeRemove(
    rowDataTran: RowDataTransaction,
    { rowNodeTransaction }: ClientSideNodeManagerUpdateRowDataResult,
    nodesToUnselect: RowNode[]
  ): void {
    const { remove } = rowDataTran;

    if (_missingOrEmpty(remove)) {
      return;
    }

    const rowIdsRemoved: { [key: string]: boolean } = {};

    remove!.forEach((item) => {
      const rowNode = this.lookupRowNode(item);

      if (!rowNode) {
        return;
      }

      // do delete - setting 'suppressFinishActions = true' to ensure EVENT_SELECTION_CHANGED is not raised for
      // each row node updated, instead it is raised once by the calling code if any selected nodes exist.
      if (rowNode.isSelected()) {
        nodesToUnselect.push(rowNode);
      }

      // so row renderer knows to fade row out (and not reposition it)
      rowNode.clearRowTopAndRowIndex();

      // NOTE: were we could remove from allLeaveChildren, however removeFromArray() is expensive, especially
      // if called multiple times (eg deleting lots of rows) and if allLeafChildren is a large list
      rowIdsRemoved[rowNode.id!] = true;
      // removeFromArray(this.rootNode.allLeafChildren, rowNode);
      delete this.allNodesMap[rowNode.id!];

      rowNodeTransaction.remove.push(rowNode);
    });

    this.rootNode.allLeafChildren =
      this.rootNode.allLeafChildren?.filter((rowNode) => !rowIdsRemoved[rowNode.id!]) ?? null;

    // after rows have been removed, all following rows need the position index updated
    this.rootNode.allLeafChildren?.forEach((node, idx) => {
      node.sourceRowIndex = idx;
    });

    const { sibling } = this.rootNode;
    if (sibling) {
      // @ts-ignore
      sibling.allLeafChildren = this.rootNode.allLeafChildren;
    }
  }

  private executeUpdate(
    rowDataTran: RowDataTransaction,
    { rowNodeTransaction }: ClientSideNodeManagerUpdateRowDataResult,
    nodesToUnselect: RowNode[]
  ): void {
    const { update } = rowDataTran;
    if (_missingOrEmpty(update)) {
      return;
    }

    update!.forEach((item) => {
      const rowNode = this.lookupRowNode(item);

      if (!rowNode) {
        return;
      }

      rowNode.updateData(item);
      if (!rowNode.selectable && rowNode.isSelected()) {
        nodesToUnselect.push(rowNode);
      }

      this.setMasterForRow(rowNode, item, TOP_LEVEL, false);

      rowNodeTransaction.update.push(rowNode);
    });
  }

  private lookupRowNode(data: any): RowNode | null {
    const getRowIdFunc = _getRowIdCallback(this.gos);

    let rowNode: RowNode | undefined;
    if (getRowIdFunc) {
      // find rowNode using id
      const id = getRowIdFunc({ data, level: 0 });
      rowNode = this.allNodesMap[id];
      if (!rowNode) {
        _errorOnce(`could not find row id=${id}, data item was not found for this id`);
        return null;
      }
    } else {
      // find rowNode using object references
      rowNode = this.rootNode.allLeafChildren?.find((node) => node.data === data);
      if (!rowNode) {
        _errorOnce(`could not find data item as object was not found`, data);
        _errorOnce(`Consider using getRowId to help the Grid find matching row data`);
        return null;
      }
    }

    return rowNode || null;
  }

  private createNode(
    dataItem: any,
    parent: RowNode,
    level: number,
    sourceRowIndex: number
  ): RowNode {
    const node: ClientSideNodeManagerRowNode = new RowNode(this.beans);
    node.sourceRowIndex = sourceRowIndex;

    node.group = false;
    this.setMasterForRow(node, dataItem, level, true);

    if (parent) {
      node.parent = parent;
    }
    node.level = level;
    node.setDataAndId(dataItem, this.nextId.toString());

    if (this.allNodesMap[node.id!]) {
      _warnOnce(
        `duplicate node id '${node.id}' detected from getRowId callback, this could cause issues in your grid.`
      );
    }
    this.allNodesMap[node.id!] = node;

    this.nextId++;

    return node;
  }

  private setMasterForRow(rowNode: RowNode, data: any, level: number, setExpanded: boolean): void {
    const isTreeData = this.gos.get('treeData');
    if (isTreeData) {
      rowNode.setMaster(false);
      if (setExpanded) {
        rowNode.expanded = false;
      }
    } else {
      const masterDetail = this.gos.get('masterDetail');
      // this is the default, for when doing grid data
      if (masterDetail) {
        // if we are doing master detail, then the
        // default is that everything can be a Master Row.
        const isRowMasterFunc = this.gos.get('isRowMaster');
        if (isRowMasterFunc) {
          rowNode.setMaster(isRowMasterFunc(data));
        } else {
          rowNode.setMaster(true);
        }
      } else {
        rowNode.setMaster(false);
      }

      if (setExpanded) {
        const rowGroupColumns = this.funcColsService.getRowGroupColumns();
        const numRowGroupColumns = rowGroupColumns ? rowGroupColumns.length : 0;

        // need to take row group into account when determining level
        const masterRowLevel = level + numRowGroupColumns;

        rowNode.expanded = rowNode.master ? this.isExpanded(masterRowLevel) : false;
      }
    }
  }

  private isExpanded(level: any) {
    const expandByDefault = this.gos.get('groupDefaultExpanded');
    if (expandByDefault === -1) {
      return true;
    }
    return level < expandByDefault;
  }
}
