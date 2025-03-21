import type {
  NamedBean,
  RowBounds,
  ValueCache,
  ColumnModel,
  Environment,
  GridOptions,
  RowModelType,
  IRowNodeStage,
  BeanCollection,
  FuncColsService,
  ISelectionService,
  FilterChangedEvent,
  RefreshModelParams,
  RowDataTransaction,
  RowNodeTransaction,
  CssVariablesChanged,
  IClientSideRowModel,
  ClientSideRowModelStep,
} from '@ag-grid-community/core';

import {
  _last,
  RowNode,
  _exists,
  BeanStub,
  _missing,
  _debounce,
  _errorOnce,
  ChangedPath,
  _isDomLayout,
  _isAnimateRows,
  _missingOrEmpty,
  _insertIntoArray,
  _removeFromArray,
  _getGrandTotalRow,
  RowHighlightPosition,
  _getRowHeightForNode,
  ClientSideRowModelSteps,
  _getGroupTotalRowCallback,
  _getGroupSelectsDescendants,
} from '@ag-grid-community/core';

import { ClientSideNodeManager } from './clientSideNodeManager';

enum RecursionType {
  Normal,
  AfterFilter,
  AfterFilterAndSort,
  PivotNodes,
}

interface ClientSideRowModelRowNode extends RowNode {
  sourceRowIndex: number;
}

export interface BatchTransactionItem<TData = any> {
  rowDataTransaction: RowDataTransaction<TData>;
  callback: ((res: RowNodeTransaction<TData>) => void) | undefined;
}

export interface RowNodeMap {
  [id: string]: RowNode;
}

export class ClientSideRowModel extends BeanStub implements IClientSideRowModel, NamedBean {
  beanName = 'rowModel' as const;

  private beans: BeanCollection;

  private columnModel: ColumnModel;

  private funcColsService: FuncColsService;

  private selectionService: ISelectionService;

  private valueCache: ValueCache;

  private environment: Environment;

  // standard stages
  private filterStage: IRowNodeStage;

  private sortStage: IRowNodeStage;

  private flattenStage: IRowNodeStage;

  // enterprise stages
  private groupStage?: IRowNodeStage;

  private aggregationStage?: IRowNodeStage;

  private pivotStage?: IRowNodeStage;

  private filterAggregatesStage?: IRowNodeStage;

  public wireBeans(beans: BeanCollection): void {
    this.beans = beans;

    this.columnModel = beans.columnModel;
    this.funcColsService = beans.funcColsService;
    this.selectionService = beans.selectionService;
    this.valueCache = beans.valueCache;
    this.environment = beans.environment;

    this.filterStage = beans.filterStage!;
    this.sortStage = beans.sortStage!;
    this.flattenStage = beans.flattenStage!;

    this.groupStage = beans.groupStage;
    this.aggregationStage = beans.aggregationStage;
    this.pivotStage = beans.pivotStage;
    this.filterAggregatesStage = beans.filterAggregatesStage;
  }

  private onRowHeightChanged_debounced = _debounce(this.onRowHeightChanged.bind(this), 100);

  // top most node of the tree. the children are the user provided data.
  private rootNode: RowNode;

  private rowsToDisplay: RowNode[] = []; // the rows mapped to rows to display

  private nodeManager: ClientSideNodeManager;

  private rowDataTransactionBatch: BatchTransactionItem[] | null;

  private lastHighlightedRow: RowNode | null;

  private applyAsyncTransactionsTimeout: number | undefined;

  /** Has the start method been called */
  private hasStarted: boolean = false;

  /** E.g. data has been set into the node manager already */
  private shouldSkipSettingDataOnStart: boolean = false;

  /**
   * This is to prevent refresh model being called when it's already being called.
   * E.g. the group stage can trigger initial state filter model to be applied. This fires onFilterChanged,
   * which then triggers the listener here that calls refresh model again but at the filter stage
   * (which is about to be run by the original call).
   */
  private isRefreshingModel: boolean = false;

  private rowCountReady: boolean = false;

  public postConstruct(): void {
    const refreshEverythingFunc = this.refreshModel.bind(this, {
      step: ClientSideRowModelSteps.EVERYTHING,
    });
    const animate = !this.gos.get('suppressAnimationFrame');
    const refreshEverythingAfterColsChangedFunc = this.refreshModel.bind(this, {
      step: ClientSideRowModelSteps.EVERYTHING, // after cols change, row grouping (the first stage) could of changed
      afterColumnsChanged: true,
      keepRenderedRows: true, // we want animations cos sorting or filtering could be applied
      animate,
    });

    this.addManagedEventListeners({
      newColumnsLoaded: refreshEverythingAfterColsChangedFunc,
      columnRowGroupChanged: refreshEverythingFunc,
      columnValueChanged: this.onValueChanged.bind(this),
      columnPivotChanged: this.refreshModel.bind(this, { step: ClientSideRowModelSteps.PIVOT }),
      filterChanged: this.onFilterChanged.bind(this),
      sortChanged: this.onSortChanged.bind(this),
      columnPivotModeChanged: refreshEverythingFunc,
      gridStylesChanged: this.onGridStylesChanges.bind(this),
      gridReady: this.onGridReady.bind(this),
    });

    // doesn't need done if doing full reset
    // Property listeners which call `refreshModel` at different stages
    this.addPropertyListeners();

    this.rootNode = new RowNode(this.beans);
    this.nodeManager = new ClientSideNodeManager(
      this.rootNode,
      this.gos,
      this.eventService,
      this.funcColsService,
      this.selectionService,
      this.beans
    );
  }

  private addPropertyListeners() {
    // Omitted Properties
    //
    // We do not act reactively on all functional properties, as it's possible the application is React and
    // has not memoised the property and it's getting set every render.
    //
    // ** LIST OF NON REACTIVE, NO ARGUMENT
    //
    // getDataPath, getRowId, isRowMaster -- these are called once for each Node when the Node is created.
    //                                    -- these are immutable Node properties (ie a Node ID cannot be changed)
    //
    // getRowHeight - this is called once when Node is created, if a new getRowHeight function is provided,
    //              - we do not revisit the heights of each node.
    //
    // pivotDefaultExpanded - relevant for initial pivot column creation, no impact on existing pivot columns.
    //
    // deltaSort - this changes the type of algorithm used only, it doesn't change the sort order. so no point
    //           - in doing the sort again as the same result will be got. the new Prop will be used next time we sort.
    //
    // ** LIST OF NON REACTIVE, SOME ARGUMENT
    // ** For these, they could be reactive, but not convinced the business argument is strong enough,
    // ** so leaving as non-reactive for now, and see if anyone complains.
    //
    // processPivotResultColDef, processPivotResultColGroupDef
    //                       - there is an argument for having these reactive, that if the application changes
    //                       - these props, we should re-create the Pivot Columns, however it's highly unlikely
    //                       - the application would change these functions, far more likely the functions were
    //                       - non memoised correctly.

    const resetProps: Set<keyof GridOptions> = new Set(['treeData', 'masterDetail']);
    const groupStageRefreshProps: Set<keyof GridOptions> = new Set([
      'groupDefaultExpanded',
      'groupAllowUnbalanced',
      'initialGroupOrderComparator',
      'groupHideOpenParents',
      'groupDisplayType',
    ]);
    const filterStageRefreshProps: Set<keyof GridOptions> = new Set([
      'excludeChildrenWhenTreeDataFiltering',
    ]);
    const pivotStageRefreshProps: Set<keyof GridOptions> = new Set([
      'removePivotHeaderRowWhenSingleValueColumn',
      'pivotRowTotals',
      'pivotColumnGroupTotals',
      'suppressExpandablePivotGroups',
    ]);
    const aggregateStageRefreshProps: Set<keyof GridOptions> = new Set([
      'getGroupRowAgg',
      'alwaysAggregateAtRootLevel',
      'groupIncludeTotalFooter',
      'suppressAggFilteredOnly',
      'grandTotalRow',
    ]);
    const sortStageRefreshProps: Set<keyof GridOptions> = new Set([
      'postSortRows',
      'groupDisplayType',
      'accentedSort',
    ]);
    const filterAggStageRefreshProps: Set<keyof GridOptions> = new Set([]);
    const flattenStageRefreshProps: Set<keyof GridOptions> = new Set([
      'groupRemoveSingleChildren',
      'groupRemoveLowestSingleChildren',
      'groupIncludeFooter',
      'groupTotalRow',
    ]);

    const allProps = [
      ...resetProps,
      ...groupStageRefreshProps,
      ...filterStageRefreshProps,
      ...pivotStageRefreshProps,
      ...pivotStageRefreshProps,
      ...aggregateStageRefreshProps,
      ...sortStageRefreshProps,
      ...filterAggStageRefreshProps,
      ...flattenStageRefreshProps,
    ];
    this.addManagedPropertyListeners(allProps, (params) => {
      const properties = params.changeSet?.properties;
      if (!properties) {
        return;
      }

      const arePropertiesImpacted = (propSet: Set<keyof GridOptions>) =>
        properties.some((prop) => propSet.has(prop));

      if (arePropertiesImpacted(resetProps)) {
        this.setRowData(this.rootNode.allLeafChildren!.map((child) => child.data));
        return;
      }

      if (arePropertiesImpacted(groupStageRefreshProps)) {
        this.refreshModel({ step: ClientSideRowModelSteps.EVERYTHING });
        return;
      }

      if (arePropertiesImpacted(filterStageRefreshProps)) {
        this.refreshModel({ step: ClientSideRowModelSteps.FILTER });
        return;
      }

      if (arePropertiesImpacted(pivotStageRefreshProps)) {
        this.refreshModel({ step: ClientSideRowModelSteps.PIVOT });
        return;
      }
      if (arePropertiesImpacted(aggregateStageRefreshProps)) {
        this.refreshModel({ step: ClientSideRowModelSteps.AGGREGATE });
        return;
      }

      if (arePropertiesImpacted(sortStageRefreshProps)) {
        this.refreshModel({ step: ClientSideRowModelSteps.SORT });
        return;
      }

      if (arePropertiesImpacted(filterAggStageRefreshProps)) {
        this.refreshModel({ step: ClientSideRowModelSteps.FILTER_AGGREGATES });
        return;
      }

      if (arePropertiesImpacted(flattenStageRefreshProps)) {
        this.refreshModel({ step: ClientSideRowModelSteps.MAP });
      }
    });

    this.addManagedPropertyListener('rowHeight', () => this.resetRowHeights());
  }

  public start(): void {
    this.hasStarted = true;
    if (this.shouldSkipSettingDataOnStart) {
      this.dispatchUpdateEventsAndRefresh();
    } else {
      this.setInitialData();
    }
  }

  private setInitialData(): void {
    const rowData = this.gos.get('rowData');
    if (rowData) {
      this.shouldSkipSettingDataOnStart = true;
      this.setRowData(rowData);
    }
  }

  public ensureRowHeightsValid(
    startPixel: number,
    endPixel: number,
    startLimitIndex: number,
    endLimitIndex: number
  ): boolean {
    let atLeastOneChange: boolean;
    let res = false;

    // we do this multiple times as changing the row heights can also change the first and last rows,
    // so the first pass can make lots of rows smaller, which means the second pass we end up changing
    // more rows.
    do {
      atLeastOneChange = false;

      const rowAtStartPixel = this.getRowIndexAtPixel(startPixel);
      const rowAtEndPixel = this.getRowIndexAtPixel(endPixel);

      // keep check to current page if doing pagination
      const firstRow = Math.max(rowAtStartPixel, startLimitIndex);
      const lastRow = Math.min(rowAtEndPixel, endLimitIndex);

      for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
        const rowNode = this.getRow(rowIndex);
        if (rowNode.rowHeightEstimated) {
          const rowHeight = _getRowHeightForNode(this.gos, rowNode);
          rowNode.setRowHeight(rowHeight.height);
          atLeastOneChange = true;
          res = true;
        }
      }

      if (atLeastOneChange) {
        this.setRowTopAndRowIndex();
      }
    } while (atLeastOneChange);

    return res;
  }

  private setRowTopAndRowIndex(): Set<string> {
    const defaultRowHeight = this.environment.getDefaultRowHeight();
    let nextRowTop = 0;

    // mapping displayed rows is not needed for this method, however it's used in
    // clearRowTopAndRowIndex(), and given we are looping through this.rowsToDisplay here,
    // we create the map here for performance reasons, so we don't loop a second time
    // in clearRowTopAndRowIndex()
    const displayedRowsMapped = new Set<string>();

    // we don't estimate if doing fullHeight or autoHeight, as all rows get rendered all the time
    // with these two layouts.
    const allowEstimate = _isDomLayout(this.gos, 'normal');

    for (let i = 0; i < this.rowsToDisplay.length; i++) {
      const rowNode = this.rowsToDisplay[i];

      if (rowNode.id != null) {
        displayedRowsMapped.add(rowNode.id);
      }

      if (rowNode.rowHeight == null) {
        const rowHeight = _getRowHeightForNode(this.gos, rowNode, allowEstimate, defaultRowHeight);
        rowNode.setRowHeight(rowHeight.height, rowHeight.estimated);
      }

      rowNode.setRowTop(nextRowTop);
      rowNode.setRowIndex(i);
      nextRowTop += rowNode.rowHeight!;
    }

    return displayedRowsMapped;
  }

  private clearRowTopAndRowIndex(changedPath: ChangedPath, displayedRowsMapped: Set<string>): void {
    const changedPathActive = changedPath.isActive();

    const clearIfNotDisplayed = (rowNode: RowNode) => {
      if (rowNode && rowNode.id != null && !displayedRowsMapped.has(rowNode.id)) {
        rowNode.clearRowTopAndRowIndex();
      }
    };

    const recurse = (rowNode: RowNode) => {
      clearIfNotDisplayed(rowNode);
      clearIfNotDisplayed(rowNode.detailNode);
      clearIfNotDisplayed(rowNode.sibling);

      if (rowNode.hasChildren()) {
        if (rowNode.childrenAfterGroup) {
          // if a changedPath is active, it means we are here because of a transaction update or
          // a change detection. neither of these impacts the open/closed state of groups. so if
          // a group is not open this time, it was not open last time. so we know all closed groups
          // already have their top positions cleared. so there is no need to traverse all the way
          // when changedPath is active and the rowNode is not expanded.
          const isRootNode = rowNode.level == -1; // we need to give special consideration for root node,
          // as expanded=undefined for root node
          const skipChildren = changedPathActive && !isRootNode && !rowNode.expanded;
          if (!skipChildren) {
            rowNode.childrenAfterGroup.forEach(recurse);
          }
        }
      }
    };

    recurse(this.rootNode);
  }

  // returns false if row was moved, otherwise true
  public ensureRowsAtPixel(rowNodes: RowNode[], pixel: number, increment: number = 0): boolean {
    const indexAtPixelNow = this.getRowIndexAtPixel(pixel);
    const rowNodeAtPixelNow = this.getRow(indexAtPixelNow);
    const animate = !this.gos.get('suppressAnimationFrame');

    if (rowNodeAtPixelNow === rowNodes[0]) {
      return false;
    }

    const allLeafChildren = this.rootNode.allLeafChildren!;

    // TODO: this implementation is currently quite inefficient and it could be optimized to run in O(n) in a single pass

    rowNodes.forEach((rowNode) => {
      _removeFromArray(allLeafChildren, rowNode);
    });

    rowNodes.forEach((rowNode, idx) => {
      _insertIntoArray(allLeafChildren, rowNode, Math.max(indexAtPixelNow + increment, 0) + idx);
    });

    rowNodes.forEach((rowNode: ClientSideRowModelRowNode, index) => {
      rowNode.sourceRowIndex = index; // Update all the sourceRowIndex to reflect the new positions
    });

    this.refreshModel({
      step: ClientSideRowModelSteps.EVERYTHING,
      keepRenderedRows: true,
      keepEditingRows: true,
      animate,
      rowNodesOrderChanged: true, // We assume the order changed and we don't need to check if it really did
    });

    return true;
  }

  public highlightRowAtPixel(rowNode: RowNode | null, pixel?: number): void {
    const indexAtPixelNow = pixel != null ? this.getRowIndexAtPixel(pixel) : null;
    const rowNodeAtPixelNow = indexAtPixelNow != null ? this.getRow(indexAtPixelNow) : null;

    if (!rowNodeAtPixelNow || !rowNode || rowNodeAtPixelNow === rowNode || pixel == null) {
      if (this.lastHighlightedRow) {
        this.lastHighlightedRow.setHighlighted(null);
        this.lastHighlightedRow = null;
      }
      return;
    }

    const highlight = this.getHighlightPosition(pixel, rowNodeAtPixelNow);

    if (this.lastHighlightedRow && this.lastHighlightedRow !== rowNodeAtPixelNow) {
      this.lastHighlightedRow.setHighlighted(null);
      this.lastHighlightedRow = null;
    }

    rowNodeAtPixelNow.setHighlighted(highlight);
    this.lastHighlightedRow = rowNodeAtPixelNow;
  }

  public getHighlightPosition(pixel: number, rowNode?: RowNode): RowHighlightPosition {
    if (!rowNode) {
      const index = this.getRowIndexAtPixel(pixel);
      rowNode = this.getRow(index || 0);

      if (!rowNode) {
        return RowHighlightPosition.Below;
      }
    }

    const { rowTop, rowHeight } = rowNode;

    return pixel - rowTop! < rowHeight! / 2
      ? RowHighlightPosition.Above
      : RowHighlightPosition.Below;
  }

  public getLastHighlightedRowNode(): RowNode | null {
    return this.lastHighlightedRow;
  }

  public isLastRowIndexKnown(): boolean {
    return true;
  }

  public getRowCount(): number {
    if (this.rowsToDisplay) {
      return this.rowsToDisplay.length;
    }

    return 0;
  }

  /**
   * Returns the number of rows with level === 1
   */
  public getTopLevelRowCount(): number {
    if (this.rowsToDisplay.length === 0) {
      return 0;
    }

    // exception to func comment, if showing root node, then we return that
    const showingRootNode = this.rowsToDisplay && this.rowsToDisplay[0] === this.rootNode;
    if (showingRootNode) {
      return 1;
    }

    const filteredChildren = this.rootNode.childrenAfterAggFilter;
    const totalFooterInc = this.rootNode.sibling ? 1 : 0;
    return (filteredChildren ? filteredChildren.length : 0) + totalFooterInc;
  }

  /**
   * Get the row display index by the top level index
   * top level index is the index of rows with level === 1
   */
  public getTopLevelRowDisplayedIndex(topLevelIndex: number): number {
    const showingRootNode = this.rowsToDisplay && this.rowsToDisplay[0] === this.rootNode;

    // exception to function comment, if showing footer node (level === -1) return 0.
    if (showingRootNode) {
      return topLevelIndex;
    }

    let adjustedIndex = topLevelIndex;
    if (this.rowsToDisplay[0].footer) {
      // if footer is first displayed row and looking for first row, return footer
      if (topLevelIndex === 0) {
        return 0;
      }

      // if first row is footer, offset index to check sorted rows by 1
      adjustedIndex -= 1;
    }

    const lastRow = this.rowsToDisplay[this.rowsToDisplay.length - 1];
    const indexOutsideGroupBounds = adjustedIndex >= this.rootNode.childrenAfterSort!.length;
    // if last row is footer, and attempting to retrieve row of too high index, return footer row index
    if (lastRow.footer && indexOutsideGroupBounds) {
      return lastRow.rowIndex!;
    }

    let rowNode = this.rootNode.childrenAfterSort![adjustedIndex];

    if (this.gos.get('groupHideOpenParents')) {
      // if hideOpenParents, then get lowest displayed descendent
      while (
        rowNode.expanded &&
        rowNode.childrenAfterSort &&
        rowNode.childrenAfterSort.length > 0
      ) {
        rowNode = rowNode.childrenAfterSort[0];
      }
    }

    return rowNode.rowIndex!;
  }

  public getRowBounds(index: number): RowBounds | null {
    if (_missing(this.rowsToDisplay)) {
      return null;
    }

    const rowNode = this.rowsToDisplay[index];

    if (rowNode) {
      return {
        rowTop: rowNode.rowTop!,
        rowHeight: rowNode.rowHeight!,
      };
    }

    return null;
  }

  public onRowGroupOpened(): void {
    const animate = _isAnimateRows(this.gos);
    this.refreshModel({
      step: ClientSideRowModelSteps.MAP,
      keepRenderedRows: true,
      animate,
    });
  }

  private onFilterChanged(event: FilterChangedEvent): void {
    if (event.afterDataChange) {
      return;
    }
    const animate = _isAnimateRows(this.gos);

    const primaryOrQuickFilterChanged =
      event.columns.length === 0 || event.columns.some((col) => col.isPrimary());
    const step: ClientSideRowModelSteps = primaryOrQuickFilterChanged
      ? ClientSideRowModelSteps.FILTER
      : ClientSideRowModelSteps.FILTER_AGGREGATES;
    this.refreshModel({ step, keepRenderedRows: true, animate });
  }

  private onSortChanged(): void {
    const animate = _isAnimateRows(this.gos);
    this.refreshModel({
      step: ClientSideRowModelSteps.SORT,
      keepRenderedRows: true,
      animate,
      keepEditingRows: true,
    });
  }

  public getType(): RowModelType {
    return 'clientSide';
  }

  private onValueChanged(): void {
    if (this.columnModel.isPivotActive()) {
      this.refreshModel({ step: ClientSideRowModelSteps.PIVOT });
    } else {
      this.refreshModel({ step: ClientSideRowModelSteps.AGGREGATE });
    }
  }

  private createChangePath(
    rowNodeTransactions: (RowNodeTransaction | null)[] | undefined
  ): ChangedPath {
    // for updates, if the row is updated at all, then we re-calc all the values
    // in that row. we could compare each value to each old value, however if we
    // did this, we would be calling the valueService twice, once on the old value
    // and once on the new value. so it's less valueGetter calls if we just assume
    // each column is different. that way the changedPath is used so that only
    // the impacted parent rows are recalculated, parents who's children have
    // not changed are not impacted.

    const noTransactions = _missingOrEmpty(rowNodeTransactions);

    const changedPath = new ChangedPath(false, this.rootNode);

    if (noTransactions) {
      changedPath.setInactive();
    }

    return changedPath;
  }

  private isSuppressModelUpdateAfterUpdateTransaction(params: RefreshModelParams): boolean {
    if (!this.gos.get('suppressModelUpdateAfterUpdateTransaction')) {
      return false;
    }

    // return true if we are only doing update transactions
    if (params.rowNodeTransactions == null) {
      return false;
    }

    const transWithAddsOrDeletes = params.rowNodeTransactions.filter(
      (tx) => (tx.add != null && tx.add.length > 0) || (tx.remove != null && tx.remove.length > 0)
    );

    const transactionsContainUpdatesOnly =
      transWithAddsOrDeletes == null || transWithAddsOrDeletes.length == 0;

    return transactionsContainUpdatesOnly;
  }

  private buildRefreshModelParams(
    step: ClientSideRowModelStep | undefined
  ): RefreshModelParams | undefined {
    let paramsStep = ClientSideRowModelSteps.EVERYTHING;
    const stepsMapped: any = {
      everything: ClientSideRowModelSteps.EVERYTHING,
      group: ClientSideRowModelSteps.EVERYTHING,
      filter: ClientSideRowModelSteps.FILTER,
      map: ClientSideRowModelSteps.MAP,
      aggregate: ClientSideRowModelSteps.AGGREGATE,
      sort: ClientSideRowModelSteps.SORT,
      pivot: ClientSideRowModelSteps.PIVOT,
    };
    if (_exists(step)) {
      paramsStep = stepsMapped[step];
    }

    if (_missing(paramsStep)) {
      _errorOnce(
        `invalid step ${step}, available steps are ${Object.keys(stepsMapped).join(', ')}`
      );
      return undefined;
    }
    const animate = !this.gos.get('suppressAnimationFrame');
    const modelParams: RefreshModelParams = {
      step: paramsStep,
      keepRenderedRows: true,
      keepEditingRows: true,
      animate,
    };
    return modelParams;
  }

  refreshModel(paramsOrStep: RefreshModelParams | ClientSideRowModelStep | undefined): void {
    if (
      !this.hasStarted ||
      this.isRefreshingModel ||
      this.columnModel.isChangeEventsDispatching()
    ) {
      return;
    }

    const params =
      typeof paramsOrStep === 'object' && 'step' in paramsOrStep
        ? paramsOrStep
        : this.buildRefreshModelParams(paramsOrStep);

    if (!params) {
      return;
    }

    if (this.isSuppressModelUpdateAfterUpdateTransaction(params)) {
      return;
    }

    // this goes through the pipeline of stages. what's in my head is similar
    // to the diagram on this page:
    // http://commons.apache.org/sandbox/commons-pipeline/pipeline_basics.html
    // however we want to keep the results of each stage, hence we manually call
    // each step rather than have them chain each other.

    // fallthrough in below switch is on purpose,
    // eg if STEP_FILTER, then all steps below this
    // step get done
    // let start: number;
    // console.log('======= start =======');

    const changedPath: ChangedPath = this.createChangePath(params.rowNodeTransactions);

    this.isRefreshingModel = true;

    switch (params.step) {
      case ClientSideRowModelSteps.EVERYTHING:
        this.doRowGrouping(
          params.rowNodeTransactions,
          changedPath,
          !!params.rowNodesOrderChanged,
          !!params.afterColumnsChanged
        );
      /* eslint-disable no-fallthrough */
      case ClientSideRowModelSteps.FILTER:
        this.doFilter(changedPath);
      case ClientSideRowModelSteps.PIVOT:
        this.doPivot(changedPath);
      case ClientSideRowModelSteps.AGGREGATE: // depends on agg fields
        this.doAggregate(changedPath);
      case ClientSideRowModelSteps.FILTER_AGGREGATES:
        this.doFilterAggregates(changedPath);
      case ClientSideRowModelSteps.SORT:
        this.doSort(params.rowNodeTransactions, changedPath);
      case ClientSideRowModelSteps.MAP:
        this.doRowsToDisplay();
      /* eslint-enable no-fallthrough */
    }

    // set all row tops to null, then set row tops on all visible rows. if we don't
    // do this, then the algorithm below only sets row tops, old row tops from old rows
    // will still lie around
    const displayedNodesMapped = this.setRowTopAndRowIndex();
    this.clearRowTopAndRowIndex(changedPath, displayedNodesMapped);

    this.isRefreshingModel = false;

    this.eventService.dispatchEvent({
      type: 'modelUpdated',
      animate: params.animate,
      keepRenderedRows: params.keepRenderedRows,
      newData: params.newData,
      newPage: false,
      keepUndoRedoStack: params.keepUndoRedoStack,
    });
  }

  public isEmpty(): boolean {
    const rowsMissing =
      _missing(this.rootNode.allLeafChildren) || this.rootNode.allLeafChildren.length === 0;
    return _missing(this.rootNode) || rowsMissing || !this.columnModel.isReady();
  }

  public isRowsToRender(): boolean {
    return _exists(this.rowsToDisplay) && this.rowsToDisplay.length > 0;
  }

  public getNodesInRangeForSelection(firstInRange: RowNode, lastInRange: RowNode): RowNode[] {
    let started = false;
    let finished = false;

    const result: RowNode[] = [];

    const groupsSelectChildren = _getGroupSelectsDescendants(this.gos);

    this.forEachNodeAfterFilterAndSort((rowNode) => {
      // range has been closed, skip till end
      if (finished) {
        return;
      }

      if (started) {
        if (rowNode === lastInRange || rowNode === firstInRange) {
          // check if this is the last node we're going to be adding
          finished = true;

          // if the final node was a group node, and we're doing groupSelectsChildren
          // make the exception to select all of it's descendants too
          if (rowNode.group && groupsSelectChildren) {
            result.push(...rowNode.allLeafChildren!);
            return;
          }
        }
      }

      if (!started) {
        if (rowNode !== lastInRange && rowNode !== firstInRange) {
          // still haven't hit a boundary node, keep searching
          return;
        }
        started = true;
      }

      // only select leaf nodes if groupsSelectChildren
      const includeThisNode = !rowNode.group || !groupsSelectChildren;
      if (includeThisNode) {
        result.push(rowNode);
      }
    });

    return result;
  }

  // eslint-disable-next-line
  public setDatasource(datasource: any): void {
    _errorOnce('should never call setDatasource on clientSideRowController');
  }

  public getTopLevelNodes(): RowNode[] | null {
    return this.rootNode ? this.rootNode.childrenAfterGroup : null;
  }

  public getRootNode(): RowNode {
    return this.rootNode;
  }

  public getRow(index: number): RowNode {
    return this.rowsToDisplay[index];
  }

  public isRowPresent(rowNode: RowNode): boolean {
    return this.rowsToDisplay.indexOf(rowNode) >= 0;
  }

  public getRowIndexAtPixel(pixelToMatch: number): number {
    if (this.isEmpty() || this.rowsToDisplay.length === 0) {
      return -1;
    }

    // do binary search of tree
    // http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/
    let bottomPointer = 0;
    let topPointer = this.rowsToDisplay.length - 1;

    // quick check, if the pixel is out of bounds, then return last row
    if (pixelToMatch <= 0) {
      // if pixel is less than or equal zero, it's always the first row
      return 0;
    }
    const lastNode = _last(this.rowsToDisplay);
    if (lastNode.rowTop! <= pixelToMatch) {
      return this.rowsToDisplay.length - 1;
    }

    let oldBottomPointer = -1;
    let oldTopPointer = -1;

    while (true) {
      const midPointer = Math.floor((bottomPointer + topPointer) / 2);
      const currentRowNode = this.rowsToDisplay[midPointer];

      if (this.isRowInPixel(currentRowNode, pixelToMatch)) {
        return midPointer;
      }

      if (currentRowNode.rowTop! < pixelToMatch) {
        bottomPointer = midPointer + 1;
      } else if (currentRowNode.rowTop! > pixelToMatch) {
        topPointer = midPointer - 1;
      }

      // infinite loops happen when there is space between rows. this can happen
      // when Auto Height is active, cos we re-calculate row tops asynchronously
      // when row heights change, which can temporarily result in gaps between rows.
      const caughtInInfiniteLoop =
        oldBottomPointer === bottomPointer && oldTopPointer === topPointer;
      if (caughtInInfiniteLoop) {
        return midPointer;
      }

      oldBottomPointer = bottomPointer;
      oldTopPointer = topPointer;
    }
  }

  private isRowInPixel(rowNode: RowNode, pixelToMatch: number): boolean {
    const topPixel = rowNode.rowTop;
    const bottomPixel = rowNode.rowTop! + rowNode.rowHeight!;
    const pixelInRow = topPixel! <= pixelToMatch && bottomPixel > pixelToMatch;
    return pixelInRow;
  }

  public forEachLeafNode(callback: (node: RowNode, index: number) => void): void {
    if (this.rootNode.allLeafChildren) {
      this.rootNode.allLeafChildren.forEach((rowNode, index) => callback(rowNode, index));
    }
  }

  public forEachNode(
    callback: (node: RowNode, index: number) => void,
    includeFooterNodes: boolean = false
  ): void {
    this.recursivelyWalkNodesAndCallback({
      nodes: [...(this.rootNode.childrenAfterGroup || [])],
      callback,
      recursionType: RecursionType.Normal,
      index: 0,
      includeFooterNodes,
    });
  }

  public forEachNodeAfterFilter(
    callback: (node: RowNode, index: number) => void,
    includeFooterNodes: boolean = false
  ): void {
    this.recursivelyWalkNodesAndCallback({
      nodes: [...(this.rootNode.childrenAfterAggFilter || [])],
      callback,
      recursionType: RecursionType.AfterFilter,
      index: 0,
      includeFooterNodes,
    });
  }

  public forEachNodeAfterFilterAndSort(
    callback: (node: RowNode, index: number) => void,
    includeFooterNodes: boolean = false
  ): void {
    this.recursivelyWalkNodesAndCallback({
      nodes: [...(this.rootNode.childrenAfterSort || [])],
      callback,
      recursionType: RecursionType.AfterFilterAndSort,
      index: 0,
      includeFooterNodes,
    });
  }

  public forEachPivotNode(
    callback: (node: RowNode, index: number) => void,
    includeFooterNodes: boolean = false
  ): void {
    this.recursivelyWalkNodesAndCallback({
      nodes: [this.rootNode],
      callback,
      recursionType: RecursionType.PivotNodes,
      index: 0,
      includeFooterNodes,
    });
  }

  // iterates through each item in memory, and calls the callback function
  // nodes - the rowNodes to traverse
  // callback - the user provided callback
  // recursion type - need this to know what child nodes to recurse, eg if looking at all nodes, or filtered notes etc
  // index - works similar to the index in forEach in javascript's array function
  private recursivelyWalkNodesAndCallback(params: {
    nodes: RowNode[];
    callback: (node: RowNode, index: number) => void;
    recursionType: RecursionType;
    index: number;
    includeFooterNodes: boolean;
  }): number {
    const { nodes, callback, recursionType, includeFooterNodes } = params;
    let { index } = params;

    const addFooters = (position: 'top' | 'bottom') => {
      const parentNode = nodes[0]?.parent;

      if (!parentNode) return;

      const grandTotal = includeFooterNodes && _getGrandTotalRow(this.gos);
      const isGroupIncludeFooter = _getGroupTotalRowCallback(this.gos);
      const groupTotal = includeFooterNodes && isGroupIncludeFooter({ node: parentNode });

      const isRootNode = parentNode === this.rootNode;
      if (isRootNode) {
        if (grandTotal === position) {
          parentNode.createFooter();
          callback(parentNode.sibling, index++);
        }
        return;
      }

      if (groupTotal === position) {
        parentNode.createFooter();
        callback(parentNode.sibling, index++);
      }
    };

    addFooters('top');

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      callback(node, index++);
      // go to the next level if it is a group
      if (node.hasChildren() && !node.footer) {
        // depending on the recursion type, we pick a difference set of children
        let nodeChildren: RowNode[] | null = null;
        switch (recursionType) {
          case RecursionType.Normal:
            nodeChildren = node.childrenAfterGroup;
            break;
          case RecursionType.AfterFilter:
            nodeChildren = node.childrenAfterAggFilter;
            break;
          case RecursionType.AfterFilterAndSort:
            nodeChildren = node.childrenAfterSort;
            break;
          case RecursionType.PivotNodes:
            // for pivot, we don't go below leafGroup levels
            nodeChildren = !node.leafGroup ? node.childrenAfterSort : null;
            break;
        }
        if (nodeChildren) {
          index = this.recursivelyWalkNodesAndCallback({
            nodes: [...nodeChildren],
            callback,
            recursionType,
            index,
            includeFooterNodes,
          });
        }
      }
    }
    addFooters('bottom');
    return index;
  }

  // it's possible to recompute the aggregate without doing the other parts
  // + api.refreshClientSideRowModel('aggregate')
  public doAggregate(changedPath?: ChangedPath): void {
    this.aggregationStage?.execute({ rowNode: this.rootNode, changedPath });
  }

  private doFilterAggregates(changedPath: ChangedPath): void {
    if (this.filterAggregatesStage) {
      this.filterAggregatesStage.execute({ rowNode: this.rootNode, changedPath });
    } else {
      // If filterAggregatesStage is undefined, then so is the grouping stage, so all children should be on the rootNode.
      this.rootNode.childrenAfterAggFilter = this.rootNode.childrenAfterFilter;
    }
  }

  // + gridApi.expandAll()
  // + gridApi.collapseAll()
  public expandOrCollapseAll(expand: boolean): void {
    const usingTreeData = this.gos.get('treeData');
    const usingPivotMode = this.columnModel.isPivotActive();

    const recursiveExpandOrCollapse = (rowNodes: RowNode[] | null): void => {
      if (!rowNodes) {
        return;
      }
      rowNodes.forEach((rowNode) => {
        const actionRow = () => {
          rowNode.expanded = expand;
          recursiveExpandOrCollapse(rowNode.childrenAfterGroup);
        };

        if (usingTreeData) {
          const hasChildren = _exists(rowNode.childrenAfterGroup);
          if (hasChildren) {
            actionRow();
          }
          return;
        }

        if (usingPivotMode) {
          const notLeafGroup = !rowNode.leafGroup;
          if (notLeafGroup) {
            actionRow();
          }
          return;
        }

        const isRowGroup = rowNode.group;
        if (isRowGroup) {
          actionRow();
        }
      });
    };

    if (this.rootNode) {
      recursiveExpandOrCollapse(this.rootNode.childrenAfterGroup);
    }

    this.refreshModel({ step: ClientSideRowModelSteps.MAP });

    this.eventService.dispatchEvent({
      type: 'expandOrCollapseAll',
      source: expand ? 'expandAll' : 'collapseAll',
    });
  }

  private doSort(rowNodeTransactions: RowNodeTransaction[] | undefined, changedPath: ChangedPath) {
    this.sortStage.execute({
      rowNode: this.rootNode,
      rowNodeTransactions,
      changedPath,
    });
  }

  private doRowGrouping(
    rowNodeTransactions: RowNodeTransaction[] | undefined,
    changedPath: ChangedPath,
    rowNodesOrderChanged: boolean,
    afterColumnsChanged: boolean
  ) {
    if (this.groupStage) {
      if (rowNodeTransactions) {
        this.groupStage.execute({
          rowNode: this.rootNode,
          rowNodeTransactions,
          rowNodesOrderChanged,
          changedPath,
        });
      } else {
        this.groupStage.execute({
          rowNode: this.rootNode,
          changedPath,
          afterColumnsChanged,
        });
      }

      if (_getGroupSelectsDescendants(this.gos)) {
        const selectionChanged = this.selectionService.updateGroupsFromChildrenSelections(
          'rowGroupChanged',
          changedPath
        );

        if (selectionChanged) {
          this.eventService.dispatchEvent({
            type: 'selectionChanged',
            source: 'rowGroupChanged',
          });
        }
      }
    } else {
      const { rootNode } = this;
      const { sibling } = rootNode;
      // @ts-ignore
      rootNode.childrenAfterGroup = rootNode.allLeafChildren;
      if (sibling) {
        // @ts-ignore
        sibling.childrenAfterGroup = rootNode.childrenAfterGroup;
      }
      this.rootNode.updateHasChildren();
    }

    if (this.nodeManager.isRowCountReady()) {
      // only if row data has been set
      this.rowCountReady = true;
      this.eventService.dispatchEventOnce({
        type: 'rowCountReady',
      });
    }
  }

  private doFilter(changedPath: ChangedPath) {
    this.filterStage.execute({ rowNode: this.rootNode, changedPath });
  }

  private doPivot(changedPath: ChangedPath) {
    this.pivotStage?.execute({ rowNode: this.rootNode, changedPath });
  }

  public getNodeManager(): ClientSideNodeManager {
    return this.nodeManager;
  }

  public getRowNode(id: string): RowNode | undefined {
    // although id is typed a string, this could be called by the user, and they could have passed a number
    const idIsGroup = typeof id === 'string' && id.indexOf(RowNode.ID_PREFIX_ROW_GROUP) == 0;

    if (idIsGroup) {
      // only one users complained about getRowNode not working for groups, after years of
      // this working for normal rows. so have done quick implementation. if users complain
      // about performance, then GroupStage should store / manage created groups in a map,
      // which is a chunk of work.
      let res: RowNode | undefined;
      this.forEachNode((node) => {
        if (node.id === id) {
          res = node;
        }
      });
      return res;
    }

    return this.nodeManager.getRowNode(id);
  }

  // rows: the rows to put into the model
  public setRowData(rowData: any[]): void {
    // no need to invalidate cache, as the cache is stored on the rowNode,
    // so new rowNodes means the cache is wiped anyway.

    // - clears selection, done before we set row data to ensure it isn't readded via `selectionService.syncInOldRowNode`
    this.selectionService.reset('rowDataChanged');

    this.nodeManager.setRowData(rowData);

    if (this.hasStarted) {
      this.dispatchUpdateEventsAndRefresh();
    }
  }

  private dispatchUpdateEventsAndRefresh(): void {
    // this event kicks off:
    // - shows 'no rows' overlay if needed
    this.eventService.dispatchEvent({
      type: 'rowDataUpdated',
    });

    this.refreshModel({
      step: ClientSideRowModelSteps.EVERYTHING,
      newData: true,
    });
  }

  public batchUpdateRowData(
    rowDataTransaction: RowDataTransaction,
    callback?: (res: RowNodeTransaction) => void
  ): void {
    if (this.applyAsyncTransactionsTimeout == null) {
      this.rowDataTransactionBatch = [];
      const waitMillis = this.gos.get('asyncTransactionWaitMillis');
      this.applyAsyncTransactionsTimeout = window.setTimeout(() => {
        if (this.isAlive()) {
          // Handle case where grid is destroyed before timeout is triggered
          this.executeBatchUpdateRowData();
        }
      }, waitMillis);
    }
    this.rowDataTransactionBatch!.push({
      rowDataTransaction,
      callback,
    });
  }

  public flushAsyncTransactions(): void {
    if (this.applyAsyncTransactionsTimeout != null) {
      clearTimeout(this.applyAsyncTransactionsTimeout);
      this.executeBatchUpdateRowData();
    }
  }

  private executeBatchUpdateRowData(): void {
    this.valueCache.onDataChanged();

    const callbackFuncsBound: ((...args: any[]) => any)[] = [];
    const rowNodeTrans: RowNodeTransaction[] = [];

    let orderChanged = false;
    this.rowDataTransactionBatch?.forEach((tranItem) => {
      const { rowNodeTransaction, rowsInserted } = this.nodeManager.updateRowData(
        tranItem.rowDataTransaction
      );
      if (rowsInserted) {
        orderChanged = true;
      }
      rowNodeTrans.push(rowNodeTransaction);
      if (tranItem.callback) {
        callbackFuncsBound.push(tranItem.callback.bind(null, rowNodeTransaction));
      }
    });

    this.commonUpdateRowData(rowNodeTrans, orderChanged);

    // do callbacks in next VM turn so it's async
    if (callbackFuncsBound.length > 0) {
      window.setTimeout(() => {
        callbackFuncsBound.forEach((func) => func());
      }, 0);
    }

    if (rowNodeTrans.length > 0) {
      this.eventService.dispatchEvent({
        type: 'asyncTransactionsFlushed',
        results: rowNodeTrans,
      });
    }

    this.rowDataTransactionBatch = null;
    this.applyAsyncTransactionsTimeout = undefined;
  }

  /**
   * Used to apply transaction changes.
   * Called by gridApi & rowDragFeature
   */
  public updateRowData(rowDataTran: RowDataTransaction): RowNodeTransaction | null {
    this.valueCache.onDataChanged();

    const { rowNodeTransaction, rowsInserted } = this.nodeManager.updateRowData(rowDataTran);

    this.commonUpdateRowData([rowNodeTransaction], rowsInserted);

    return rowNodeTransaction;
  }

  /**
   * Used to apply generated transaction
   */
  public afterImmutableDataChange(
    rowNodeTransaction: RowNodeTransaction,
    rowNodesOrderChanged: boolean
  ): void {
    this.commonUpdateRowData([rowNodeTransaction], rowNodesOrderChanged);
  }

  /**
   * Common to:
   * - executeBatchUpdateRowData (batch transactions)
   * - updateRowData (single transaction)
   * - afterImmutableDataChange (generated transaction)
   *
   * @param rowNodeTrans - the transactions to apply
   * @param orderChanged - whether the order of the rows has changed, either via generated transaction or user provided addIndex
   */
  private commonUpdateRowData(
    rowNodeTransactions: RowNodeTransaction[],
    rowNodesOrderChanged: boolean
  ): void {
    if (!this.hasStarted) {
      return;
    }

    const animate = !this.gos.get('suppressAnimationFrame');

    this.eventService.dispatchEvent({
      type: 'rowDataUpdated',
    });

    this.refreshModel({
      step: ClientSideRowModelSteps.EVERYTHING,
      rowNodeTransactions,
      rowNodesOrderChanged,
      keepRenderedRows: true,
      keepEditingRows: true,
      animate,
    });
  }

  private doRowsToDisplay() {
    this.rowsToDisplay = this.flattenStage.execute({ rowNode: this.rootNode }) as RowNode[];
  }

  public onRowHeightChanged(): void {
    this.refreshModel({
      step: ClientSideRowModelSteps.MAP,
      keepRenderedRows: true,
      keepEditingRows: true,
      keepUndoRedoStack: true,
    });
  }

  /** This method is debounced. It is used for row auto-height. If we don't debounce,
   * then the Row Models will end up recalculating each row position
   * for each row height change and result in the Row Renderer laying out rows.
   * This is particularly bad if using print layout, and showing eg 1,000 rows,
   * each row will change it's height, causing Row Model to update 1,000 times.
   */
  public onRowHeightChangedDebounced(): void {
    this.onRowHeightChanged_debounced();
  }

  public resetRowHeights(): void {
    const atLeastOne = this.resetRowHeightsForAllRowNodes();

    this.rootNode.setRowHeight(this.rootNode.rowHeight, true);
    if (this.rootNode.sibling) {
      this.rootNode.sibling.setRowHeight(this.rootNode.sibling.rowHeight, true);
    }

    // when pivotMode but pivot not active, root node is displayed on its own
    // because it's only ever displayed alone, refreshing the model (onRowHeightChanged) is not required
    if (atLeastOne) {
      this.onRowHeightChanged();
    }
  }

  private resetRowHeightsForAllRowNodes(): boolean {
    let atLeastOne = false;
    this.forEachNode((rowNode) => {
      rowNode.setRowHeight(rowNode.rowHeight, true);
      // we keep the height each row is at, however we set estimated=true rather than clear the height.
      // this means the grid will not reset the row heights back to defaults, rather it will re-calc
      // the height for each row as the row is displayed. otherwise the scroll will jump when heights are reset.
      const { detailNode } = rowNode;
      if (detailNode) {
        detailNode.setRowHeight(detailNode.rowHeight, true);
      }

      if (rowNode.sibling) {
        rowNode.sibling.setRowHeight(rowNode.sibling.rowHeight, true);
      }
      atLeastOne = true;
    });

    return atLeastOne;
  }

  private onGridStylesChanges(e: CssVariablesChanged) {
    if (e.rowHeightChanged) {
      if (this.columnModel.isAutoRowHeightActive()) {
        return;
      }

      this.resetRowHeights();
    }
  }

  private onGridReady(): void {
    if (this.hasStarted) {
      return;
    }
    // App can start using API to add transactions, so need to add data into the node manager if not started
    this.setInitialData();
  }

  public isRowDataLoaded(): boolean {
    return this.rowCountReady;
  }
}
