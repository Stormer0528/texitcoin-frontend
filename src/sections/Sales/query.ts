import { gql } from 'src/__generated__/gql';

export const FETCH_SALES_QUERY = gql(/* GraphQL */ `
  query FetchSales($sort: String, $page: String, $filter: JSONObject) {
    sales(sort: $sort, page: $page, filter: $filter) {
      sales {
        id
        ID
        status
        memberId
        orderedAt
        packageId
        paymentMethod
        sponsorCnt
        member {
          id
          email
          point
          mobile
          status
          ID
          assetId
          commission {
            begL
            begR
            newL
            newR
          }
          username
          fullName
          emailVerified
          syncWithSendy
          primaryAddress
          totalIntroducers
          secondaryAddress
          preferredContact
          preferredContactDetail
          cmnCalculatedWeeks
          memberWallets {
            createdAt
            updatedAt
            deletedAt
            id
            memberId
            payoutId
            address
            percent
            payout {
              id
              method
              status
              name
              display
              createdAt
              updatedAt
              deletedAt
            }
          }
        }
        package {
          id
          date
          token
          point
          amount
          status
          createdAt
          updatedAt
          deletedAt
          productName
          enrollVisibility
        }
      }
      total
    }
  }
`);

export const FETCH_SALES_STATS_QUERY = gql(/* GraphQL */ `
  query FetchSaleStats($allFilter: JSONObject, $inactiveFilter: JSONObject) {
    all: sales(filter: $allFilter) {
      total
    }
    inactive: sales(filter: $inactiveFilter) {
      total
    }
  }
`);

export const FETCH_PACKAGES_QUERY = gql(/* GraphQL */ `
  query Packages($sort: String, $page: String, $filter: JSONObject) {
    packages(sort: $sort, page: $page, filter: $filter) {
      packages {
        id
        date
        token
        point
        amount
        status
        createdAt
        updatedAt
        deletedAt
        productName
        enrollVisibility
      }
      total
    }
  }
`);
