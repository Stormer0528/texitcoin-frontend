/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  query GenerateReferenceLink {\n    generateReferenceLink {\n      link\n    }\n  }\n':
    types.GenerateReferenceLinkDocument,
  '\n  mutation ResetTokenVerify($data: TokenInput!) {\n    resetTokenVerify(data: $data) {\n      email\n      token\n    }\n  }\n':
    types.ResetTokenVerifyDocument,
  '\n  query WeeklyCommissions($page: String, $sort: String, $filter: JSONObject) {\n    weeklyCommissions(page: $page, sort: $sort, filter: $filter) {\n      weeklyCommissions {\n        id\n        memberId\n        weekStartDate\n        beforeLeftPoint\n        beforeRightPoint\n        afterLeftPoint\n        afterRightPoint\n        calculatedLeftPoint\n        calculatedRightPoint\n        commission\n        status\n        member {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          username\n          fullName\n          sponsorId\n          email\n          mobile\n          assetId\n          primaryAddress\n          secondaryAddress\n          city\n          state\n          zipCode\n          placementParentId\n          placementPosition\n          point\n          emailVerified\n          status\n          totalIntroducers\n        }\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n':
    types.WeeklyCommissionsDocument,
  '\n  query FetchCommissionStats(\n    $allFilter: JSONObject\n    $pendingFilter: JSONObject\n    $declineFilter: JSONObject\n    $sentFilter: JSONObject\n  ) {\n    all: weeklyCommissions(filter: $allFilter) {\n      total\n    }\n    pending: weeklyCommissions(filter: $pendingFilter) {\n      total\n    }\n    decline: weeklyCommissions(filter: $declineFilter) {\n      total\n    }\n    sent: weeklyCommissions(filter: $sentFilter) {\n      total\n    }\n  }\n':
    types.FetchCommissionStatsDocument,
  '\n  query fetchMe {\n    memberMe {\n      id\n      username\n      fullName\n      email\n      point\n      primaryAddress\n      secondaryAddress\n      assetId\n      mobile\n      city\n      emailVerified\n      totalIntroducers\n      status\n      state\n      zipCode\n      sponsorId\n      sponsor {\n        id\n        username\n        fullName\n        email\n        point\n        primaryAddress\n        secondaryAddress\n        mobile\n        assetId\n        emailVerified\n        totalIntroducers\n        status\n        state\n      }\n      placementParentId\n      placementPosition\n      placementParent {\n        id\n        username\n        fullName\n        email\n        point\n        primaryAddress\n        secondaryAddress\n        mobile\n        assetId\n        emailVerified\n        totalIntroducers\n        status\n        state\n      }\n      sales {\n        id\n        invoiceNo\n        memberId\n        packageId\n        paymentMethod\n        status\n        orderedAt\n      }\n      memberWallets {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        memberId\n        payoutId\n        address\n        percent\n        payout {\n          id\n          method\n          status\n          name\n          display\n          createdAt\n          updatedAt\n          deletedAt\n        }\n      }\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n':
    types.FetchMeDocument,
  '\n  query FetchMemberStats($inactiveFilter: JSONObject) {\n    all: members {\n      total\n    }\n    inactive: members(filter: $inactiveFilter) {\n      total\n    }\n  }\n':
    types.FetchMemberStatsDocument,
  '\n  query FetchMembers($page: String, $filter: JSONObject, $sort: String) {\n    members(page: $page, filter: $filter, sort: $sort) {\n      members {\n        id\n        username\n        fullName\n        email\n        point\n        primaryAddress\n        secondaryAddress\n        assetId\n        mobile\n        city\n        emailVerified\n        totalIntroducers\n        status\n        state\n        zipCode\n        sponsorId\n        placementParentId\n        sponsor {\n          id\n          username\n          fullName\n          email\n          emailVerified\n          totalIntroducers\n          status\n          point\n          primaryAddress\n          secondaryAddress\n          mobile\n          assetId\n        }\n        placementParentId\n        placementPosition\n        placementParent {\n          id\n          username\n          fullName\n          email\n          emailVerified\n          totalIntroducers\n          status\n          point\n          primaryAddress\n          secondaryAddress\n          mobile\n          assetId\n        }\n        sales {\n          id\n          invoiceNo\n          memberId\n          packageId\n          paymentMethod\n          status\n          orderedAt\n        }\n        memberWallets {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          memberId\n          payoutId\n          address\n          percent\n          payout {\n            id\n            method\n            status\n            name\n            display\n            createdAt\n            updatedAt\n            deletedAt\n          }\n        }\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n':
    types.FetchMembersDocument,
  '\n  mutation CreateMember($data: CreateMemberInput!) {\n    createMember(data: $data) {\n      username\n      fullName\n      email\n      mobile\n      primaryAddress\n      secondaryAddress\n      assetId\n    }\n  }\n':
    types.CreateMemberDocument,
  '\n  query FetchMember($filter: JSONObject) {\n    members(filter: $filter) {\n      members {\n        id\n        username\n        fullName\n        email\n        point\n        emailVerified\n        totalIntroducers\n        status\n        mobile\n        primaryAddress\n        secondaryAddress\n        assetId\n        memberWallets {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          memberId\n          payoutId\n          address\n          percent\n          payout {\n            id\n            method\n            status\n            name\n            display\n            createdAt\n            updatedAt\n            deletedAt\n          }\n        }\n        deletedAt\n      }\n    }\n  }\n':
    types.FetchMemberDocument,
  '\n  mutation UpdateMember($data: UpdateMemberInput!) {\n    updateMember(data: $data) {\n      id\n      mobile\n      primaryAddress\n      secondaryAddress\n      memberWallets {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        memberId\n        payoutId\n        address\n        percent\n        payout {\n          method\n          display\n        }\n      }\n      assetId\n    }\n  }\n':
    types.UpdateMemberDocument,
  '\n  query MemberOverview($data: MemberOverviewInput!) {\n    memberOverview(data: $data) {\n      currentHashPower\n      totalTXCShared\n      joinDate\n    }\n  }\n':
    types.MemberOverviewDocument,
  '\n  query MemberStatistics($sort: String, $page: String, $filter: JSONObject) {\n    memberStatistics(sort: $sort, page: $page, filter: $filter) {\n      memberStatistics {\n        issuedAt\n        hashPower\n        txcShared\n      }\n      total\n    }\n  }\n':
    types.MemberStatisticsDocument,
  '\n  query Payouts($filter: JSONObject, $page: String, $sort: String) {\n    payouts(filter: $filter, page: $page, sort: $sort) {\n      payouts {\n        id\n        method\n        display\n        name\n        status\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n':
    types.PayoutsDocument,
  '\n  mutation ResetPasswordRequest($data: EmailInput!) {\n    resetPasswordRequest(data: $data) {\n      message\n      result\n    }\n  }\n':
    types.ResetPasswordRequestDocument,
  '\n  mutation ResetPasswordByToken($data: ResetPasswordTokenInput!) {\n    resetPasswordByToken(data: $data) {\n      message\n      result\n    }\n  }\n':
    types.ResetPasswordByTokenDocument,
  '\n  query Reward($sort: String, $page: String, $filter: JSONObject) {\n    statistics(sort: $sort, page: $page, filter: $filter) {\n      statistics {\n        id\n        issuedAt\n        newBlocks\n        totalBlocks\n        totalHashPower\n        totalMembers\n        txcShared\n        from\n        to\n        status\n        statisticsSales {\n          id\n          saleId\n          issuedAt\n        }\n        memberStatistics {\n          txcShared\n          memberStatisticsWallets {\n            id\n          }\n        }\n      }\n      total\n    }\n  }\n':
    types.RewardDocument,
  '\n  query FetchMemberStatistics($sort: String, $page: String, $filter: JSONObject) {\n    memberStatistics(sort: $sort, page: $page, filter: $filter) {\n      memberStatistics {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        memberId\n        statisticsId\n        txcShared\n        hashPower\n        percent\n        issuedAt\n        member {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          username\n          fullName\n          email\n          point\n          mobile\n          assetId\n          emailVerified\n          totalIntroducers\n          status\n          state\n          memberWallets {\n            createdAt\n            updatedAt\n            deletedAt\n            id\n            memberId\n            payoutId\n            address\n            percent\n            payout {\n              id\n              method\n              status\n              name\n              display\n              createdAt\n              updatedAt\n              deletedAt\n            }\n          }\n          primaryAddress\n          secondaryAddress\n        }\n        statistics {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          newBlocks\n          totalBlocks\n          totalHashPower\n          totalMembers\n          status\n          txcShared\n          issuedAt\n          from\n          to\n        }\n      }\n      total\n    }\n  }\n':
    types.FetchMemberStatisticsDocument,
  '\n  mutation CreateStatistics($data: CreateStatisticsInput!) {\n    createStatistics(data: $data) {\n      id\n      newBlocks\n    }\n  }\n':
    types.CreateStatisticsDocument,
  '\n  mutation CreateManyMemberStatistics($data: CreateManyMemberStatisticsInput!) {\n    createManyMemberStatistics(data: $data) {\n      count\n    }\n  }\n':
    types.CreateManyMemberStatisticsDocument,
  '\n  mutation UpdateStatistics($data: UpdateStatisticsInput!) {\n    updateStatistics(data: $data) {\n      status\n      txcShared\n    }\n  }\n':
    types.UpdateStatisticsDocument,
  '\n  mutation RemoveMemberStatisticsByStaitisId($data: IDInput!) {\n    removeMemberStatisticsByStaitisId(data: $data) {\n      count\n    }\n  }\n':
    types.RemoveMemberStatisticsByStaitisIdDocument,
  '\n  mutation RemoveManyStatistics($data: IDsInput!) {\n    removeManyStatistics(data: $data) {\n      count\n    }\n  }\n':
    types.RemoveManyStatisticsDocument,
  '\n  query Rewards($from: DateTimeISO!, $to: DateTimeISO!) {\n    rewardsByWallets(from: $from, to: $to) {\n      rewards {\n        txc\n        wallet {\n          id\n          address\n          percent\n          payout {\n            name\n            method\n          }\n        }\n      }\n    }\n  }\n':
    types.RewardsDocument,
  '\n  query DailyRewards($from: DateTimeISO!, $to: DateTimeISO!) {\n    dailyRewards(from: $from, to: $to) {\n      rewards {\n        day\n        rewardsByWallet {\n          txc\n          wallet {\n            address\n            payout {\n              method\n            }\n          }\n        }\n        totalTxc\n      }\n    }\n  }\n':
    types.DailyRewardsDocument,
  '\n  query MemberStatisticsWallets($sort: String, $page: String, $filter: JSONObject) {\n    memberStatisticsWallets(sort: $sort, page: $page, filter: $filter) {\n      memberStatisticsWallets {\n        id\n        txc\n        issuedAt\n        memberWallet {\n          address\n        }\n        memberStatistic {\n          hashPower\n          percent\n          txcShared\n        }\n      }\n    }\n  }\n':
    types.MemberStatisticsWalletsDocument,
  '\n  query FetchSales($sort: String, $page: String, $filter: JSONObject) {\n    sales(sort: $sort, page: $page, filter: $filter) {\n      sales {\n        id\n        invoiceNo\n        memberId\n        packageId\n        orderedAt\n        status\n        member {\n          id\n          username\n          fullName\n          email\n          point\n          mobile\n          assetId\n          primaryAddress\n          secondaryAddress\n          emailVerified\n          totalIntroducers\n          status\n          memberWallets {\n            createdAt\n            updatedAt\n            deletedAt\n            id\n            memberId\n            payoutId\n            address\n            percent\n            payout {\n              id\n              method\n              status\n              name\n              display\n              createdAt\n              updatedAt\n              deletedAt\n            }\n          }\n        }\n        package {\n          id\n          productName\n          amount\n          date\n          token\n          point\n          status\n        }\n        paymentMethod\n      }\n      total\n    }\n  }\n':
    types.FetchSalesDocument,
  '\n  query FetchSaleStats($allFilter: JSONObject, $inactiveFilter: JSONObject) {\n    all: sales(filter: $allFilter) {\n      total\n    }\n    inactive: sales(filter: $inactiveFilter) {\n      total\n    }\n  }\n':
    types.FetchSaleStatsDocument,
  '\n  query Packages($sort: String, $page: String, $filter: JSONObject) {\n    packages(sort: $sort, page: $page, filter: $filter) {\n      packages {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        productName\n        amount\n        status\n        point\n        date\n        token\n      }\n      total\n    }\n  }\n':
    types.PackagesDocument,
  '\n  mutation Login($data: MemberLoginInput!) {\n    memberLogin(data: $data) {\n      accessToken\n    }\n  }\n':
    types.LoginDocument,
  '\n  mutation SignUpMember($data: SignupFormInput!) {\n    signUpMember(data: $data) {\n      email\n      username\n      id\n    }\n  }\n':
    types.SignUpMemberDocument,
  '\n  mutation SendEmailVerification($data: EmailInput!) {\n    sendEmailVerification(data: $data) {\n      token\n    }\n  }\n':
    types.SendEmailVerificationDocument,
  '\n  mutation EmailVerify($data: EmailVerificationInput!) {\n    emailVerify(data: $data) {\n      message\n      result\n    }\n  }\n':
    types.EmailVerifyDocument,
  '\n  query Query($data: LiveStatsArgs!) {\n    liveBlockStats(data: $data) {\n      dailyData {\n        count\n        field\n      }\n      meta\n      total\n    }\n    liveMiningStats {\n      dailyData {\n        count\n        field\n      }\n      meta\n      total\n    }\n    liveUserStats(data: $data) {\n      dailyData {\n        count\n        field\n      }\n      meta\n      total\n    }\n  }\n':
    types.QueryDocument,
  '\n  query Blocks($page: String, $filter: JSONObject, $sort: String) {\n    blocks(page: $page, filter: $filter, sort: $sort) {\n      blocks {\n        id\n        blockNo\n        hashRate\n        difficulty\n        issuedAt\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n':
    types.BlocksDocument,
  '\n  query Statistics($page: String, $filter: JSONObject, $sort: String) {\n    statistics(page: $page, filter: $filter, sort: $sort) {\n      statistics {\n        id\n        totalHashPower\n        newBlocks\n        totalBlocks\n        totalMembers\n        txcShared\n        issuedAt\n        from\n        to\n        status\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n':
    types.StatisticsDocument,
  '\n  query TXCMemberStatistics($page: String, $filter: JSONObject, $sort: String) {\n    memberStatistics(page: $page, filter: $filter, sort: $sort) {\n      memberStatistics {\n        id\n        hashPower\n        txcShared\n        issuedAt\n        percent\n        createdAt\n        updatedAt\n        deletedAt\n        member {\n          username\n          email\n          assetId\n        }\n        statistics {\n          newBlocks\n          status\n        }\n      }\n      total\n    }\n  }\n':
    types.TxcMemberStatisticsDocument,
  '\n  query HistoryStatistics($page: String, $filter: JSONObject, $sort: String) {\n    statistics(page: $page, filter: $filter, sort: $sort) {\n      statistics {\n        id\n        totalHashPower\n        newBlocks\n        totalBlocks\n        totalMembers\n        txcShared\n        issuedAt\n        from\n        to\n        status\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n':
    types.HistoryStatisticsDocument,
  '\n  query Blocksdata($data: BlockStatsArgs!) {\n    blocksData(data: $data) {\n      base\n      difficulty\n      hashRate\n    }\n  }\n':
    types.BlocksdataDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GenerateReferenceLink {\n    generateReferenceLink {\n      link\n    }\n  }\n'
): (typeof documents)['\n  query GenerateReferenceLink {\n    generateReferenceLink {\n      link\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation ResetTokenVerify($data: TokenInput!) {\n    resetTokenVerify(data: $data) {\n      email\n      token\n    }\n  }\n'
): (typeof documents)['\n  mutation ResetTokenVerify($data: TokenInput!) {\n    resetTokenVerify(data: $data) {\n      email\n      token\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query WeeklyCommissions($page: String, $sort: String, $filter: JSONObject) {\n    weeklyCommissions(page: $page, sort: $sort, filter: $filter) {\n      weeklyCommissions {\n        id\n        memberId\n        weekStartDate\n        beforeLeftPoint\n        beforeRightPoint\n        afterLeftPoint\n        afterRightPoint\n        calculatedLeftPoint\n        calculatedRightPoint\n        commission\n        status\n        member {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          username\n          fullName\n          sponsorId\n          email\n          mobile\n          assetId\n          primaryAddress\n          secondaryAddress\n          city\n          state\n          zipCode\n          placementParentId\n          placementPosition\n          point\n          emailVerified\n          status\n          totalIntroducers\n        }\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query WeeklyCommissions($page: String, $sort: String, $filter: JSONObject) {\n    weeklyCommissions(page: $page, sort: $sort, filter: $filter) {\n      weeklyCommissions {\n        id\n        memberId\n        weekStartDate\n        beforeLeftPoint\n        beforeRightPoint\n        afterLeftPoint\n        afterRightPoint\n        calculatedLeftPoint\n        calculatedRightPoint\n        commission\n        status\n        member {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          username\n          fullName\n          sponsorId\n          email\n          mobile\n          assetId\n          primaryAddress\n          secondaryAddress\n          city\n          state\n          zipCode\n          placementParentId\n          placementPosition\n          point\n          emailVerified\n          status\n          totalIntroducers\n        }\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query FetchCommissionStats(\n    $allFilter: JSONObject\n    $pendingFilter: JSONObject\n    $declineFilter: JSONObject\n    $sentFilter: JSONObject\n  ) {\n    all: weeklyCommissions(filter: $allFilter) {\n      total\n    }\n    pending: weeklyCommissions(filter: $pendingFilter) {\n      total\n    }\n    decline: weeklyCommissions(filter: $declineFilter) {\n      total\n    }\n    sent: weeklyCommissions(filter: $sentFilter) {\n      total\n    }\n  }\n'
): (typeof documents)['\n  query FetchCommissionStats(\n    $allFilter: JSONObject\n    $pendingFilter: JSONObject\n    $declineFilter: JSONObject\n    $sentFilter: JSONObject\n  ) {\n    all: weeklyCommissions(filter: $allFilter) {\n      total\n    }\n    pending: weeklyCommissions(filter: $pendingFilter) {\n      total\n    }\n    decline: weeklyCommissions(filter: $declineFilter) {\n      total\n    }\n    sent: weeklyCommissions(filter: $sentFilter) {\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query fetchMe {\n    memberMe {\n      id\n      username\n      fullName\n      email\n      point\n      primaryAddress\n      secondaryAddress\n      assetId\n      mobile\n      city\n      emailVerified\n      totalIntroducers\n      status\n      state\n      zipCode\n      sponsorId\n      sponsor {\n        id\n        username\n        fullName\n        email\n        point\n        primaryAddress\n        secondaryAddress\n        mobile\n        assetId\n        emailVerified\n        totalIntroducers\n        status\n        state\n      }\n      placementParentId\n      placementPosition\n      placementParent {\n        id\n        username\n        fullName\n        email\n        point\n        primaryAddress\n        secondaryAddress\n        mobile\n        assetId\n        emailVerified\n        totalIntroducers\n        status\n        state\n      }\n      sales {\n        id\n        invoiceNo\n        memberId\n        packageId\n        paymentMethod\n        status\n        orderedAt\n      }\n      memberWallets {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        memberId\n        payoutId\n        address\n        percent\n        payout {\n          id\n          method\n          status\n          name\n          display\n          createdAt\n          updatedAt\n          deletedAt\n        }\n      }\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n'
): (typeof documents)['\n  query fetchMe {\n    memberMe {\n      id\n      username\n      fullName\n      email\n      point\n      primaryAddress\n      secondaryAddress\n      assetId\n      mobile\n      city\n      emailVerified\n      totalIntroducers\n      status\n      state\n      zipCode\n      sponsorId\n      sponsor {\n        id\n        username\n        fullName\n        email\n        point\n        primaryAddress\n        secondaryAddress\n        mobile\n        assetId\n        emailVerified\n        totalIntroducers\n        status\n        state\n      }\n      placementParentId\n      placementPosition\n      placementParent {\n        id\n        username\n        fullName\n        email\n        point\n        primaryAddress\n        secondaryAddress\n        mobile\n        assetId\n        emailVerified\n        totalIntroducers\n        status\n        state\n      }\n      sales {\n        id\n        invoiceNo\n        memberId\n        packageId\n        paymentMethod\n        status\n        orderedAt\n      }\n      memberWallets {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        memberId\n        payoutId\n        address\n        percent\n        payout {\n          id\n          method\n          status\n          name\n          display\n          createdAt\n          updatedAt\n          deletedAt\n        }\n      }\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query FetchMemberStats($inactiveFilter: JSONObject) {\n    all: members {\n      total\n    }\n    inactive: members(filter: $inactiveFilter) {\n      total\n    }\n  }\n'
): (typeof documents)['\n  query FetchMemberStats($inactiveFilter: JSONObject) {\n    all: members {\n      total\n    }\n    inactive: members(filter: $inactiveFilter) {\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query FetchMembers($page: String, $filter: JSONObject, $sort: String) {\n    members(page: $page, filter: $filter, sort: $sort) {\n      members {\n        id\n        username\n        fullName\n        email\n        point\n        primaryAddress\n        secondaryAddress\n        assetId\n        mobile\n        city\n        emailVerified\n        totalIntroducers\n        status\n        state\n        zipCode\n        sponsorId\n        placementParentId\n        sponsor {\n          id\n          username\n          fullName\n          email\n          emailVerified\n          totalIntroducers\n          status\n          point\n          primaryAddress\n          secondaryAddress\n          mobile\n          assetId\n        }\n        placementParentId\n        placementPosition\n        placementParent {\n          id\n          username\n          fullName\n          email\n          emailVerified\n          totalIntroducers\n          status\n          point\n          primaryAddress\n          secondaryAddress\n          mobile\n          assetId\n        }\n        sales {\n          id\n          invoiceNo\n          memberId\n          packageId\n          paymentMethod\n          status\n          orderedAt\n        }\n        memberWallets {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          memberId\n          payoutId\n          address\n          percent\n          payout {\n            id\n            method\n            status\n            name\n            display\n            createdAt\n            updatedAt\n            deletedAt\n          }\n        }\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query FetchMembers($page: String, $filter: JSONObject, $sort: String) {\n    members(page: $page, filter: $filter, sort: $sort) {\n      members {\n        id\n        username\n        fullName\n        email\n        point\n        primaryAddress\n        secondaryAddress\n        assetId\n        mobile\n        city\n        emailVerified\n        totalIntroducers\n        status\n        state\n        zipCode\n        sponsorId\n        placementParentId\n        sponsor {\n          id\n          username\n          fullName\n          email\n          emailVerified\n          totalIntroducers\n          status\n          point\n          primaryAddress\n          secondaryAddress\n          mobile\n          assetId\n        }\n        placementParentId\n        placementPosition\n        placementParent {\n          id\n          username\n          fullName\n          email\n          emailVerified\n          totalIntroducers\n          status\n          point\n          primaryAddress\n          secondaryAddress\n          mobile\n          assetId\n        }\n        sales {\n          id\n          invoiceNo\n          memberId\n          packageId\n          paymentMethod\n          status\n          orderedAt\n        }\n        memberWallets {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          memberId\n          payoutId\n          address\n          percent\n          payout {\n            id\n            method\n            status\n            name\n            display\n            createdAt\n            updatedAt\n            deletedAt\n          }\n        }\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation CreateMember($data: CreateMemberInput!) {\n    createMember(data: $data) {\n      username\n      fullName\n      email\n      mobile\n      primaryAddress\n      secondaryAddress\n      assetId\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateMember($data: CreateMemberInput!) {\n    createMember(data: $data) {\n      username\n      fullName\n      email\n      mobile\n      primaryAddress\n      secondaryAddress\n      assetId\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query FetchMember($filter: JSONObject) {\n    members(filter: $filter) {\n      members {\n        id\n        username\n        fullName\n        email\n        point\n        emailVerified\n        totalIntroducers\n        status\n        mobile\n        primaryAddress\n        secondaryAddress\n        assetId\n        memberWallets {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          memberId\n          payoutId\n          address\n          percent\n          payout {\n            id\n            method\n            status\n            name\n            display\n            createdAt\n            updatedAt\n            deletedAt\n          }\n        }\n        deletedAt\n      }\n    }\n  }\n'
): (typeof documents)['\n  query FetchMember($filter: JSONObject) {\n    members(filter: $filter) {\n      members {\n        id\n        username\n        fullName\n        email\n        point\n        emailVerified\n        totalIntroducers\n        status\n        mobile\n        primaryAddress\n        secondaryAddress\n        assetId\n        memberWallets {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          memberId\n          payoutId\n          address\n          percent\n          payout {\n            id\n            method\n            status\n            name\n            display\n            createdAt\n            updatedAt\n            deletedAt\n          }\n        }\n        deletedAt\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation UpdateMember($data: UpdateMemberInput!) {\n    updateMember(data: $data) {\n      id\n      mobile\n      primaryAddress\n      secondaryAddress\n      memberWallets {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        memberId\n        payoutId\n        address\n        percent\n        payout {\n          method\n          display\n        }\n      }\n      assetId\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateMember($data: UpdateMemberInput!) {\n    updateMember(data: $data) {\n      id\n      mobile\n      primaryAddress\n      secondaryAddress\n      memberWallets {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        memberId\n        payoutId\n        address\n        percent\n        payout {\n          method\n          display\n        }\n      }\n      assetId\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query MemberOverview($data: MemberOverviewInput!) {\n    memberOverview(data: $data) {\n      currentHashPower\n      totalTXCShared\n      joinDate\n    }\n  }\n'
): (typeof documents)['\n  query MemberOverview($data: MemberOverviewInput!) {\n    memberOverview(data: $data) {\n      currentHashPower\n      totalTXCShared\n      joinDate\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query MemberStatistics($sort: String, $page: String, $filter: JSONObject) {\n    memberStatistics(sort: $sort, page: $page, filter: $filter) {\n      memberStatistics {\n        issuedAt\n        hashPower\n        txcShared\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query MemberStatistics($sort: String, $page: String, $filter: JSONObject) {\n    memberStatistics(sort: $sort, page: $page, filter: $filter) {\n      memberStatistics {\n        issuedAt\n        hashPower\n        txcShared\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query Payouts($filter: JSONObject, $page: String, $sort: String) {\n    payouts(filter: $filter, page: $page, sort: $sort) {\n      payouts {\n        id\n        method\n        display\n        name\n        status\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query Payouts($filter: JSONObject, $page: String, $sort: String) {\n    payouts(filter: $filter, page: $page, sort: $sort) {\n      payouts {\n        id\n        method\n        display\n        name\n        status\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation ResetPasswordRequest($data: EmailInput!) {\n    resetPasswordRequest(data: $data) {\n      message\n      result\n    }\n  }\n'
): (typeof documents)['\n  mutation ResetPasswordRequest($data: EmailInput!) {\n    resetPasswordRequest(data: $data) {\n      message\n      result\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation ResetPasswordByToken($data: ResetPasswordTokenInput!) {\n    resetPasswordByToken(data: $data) {\n      message\n      result\n    }\n  }\n'
): (typeof documents)['\n  mutation ResetPasswordByToken($data: ResetPasswordTokenInput!) {\n    resetPasswordByToken(data: $data) {\n      message\n      result\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query Reward($sort: String, $page: String, $filter: JSONObject) {\n    statistics(sort: $sort, page: $page, filter: $filter) {\n      statistics {\n        id\n        issuedAt\n        newBlocks\n        totalBlocks\n        totalHashPower\n        totalMembers\n        txcShared\n        from\n        to\n        status\n        statisticsSales {\n          id\n          saleId\n          issuedAt\n        }\n        memberStatistics {\n          txcShared\n          memberStatisticsWallets {\n            id\n          }\n        }\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query Reward($sort: String, $page: String, $filter: JSONObject) {\n    statistics(sort: $sort, page: $page, filter: $filter) {\n      statistics {\n        id\n        issuedAt\n        newBlocks\n        totalBlocks\n        totalHashPower\n        totalMembers\n        txcShared\n        from\n        to\n        status\n        statisticsSales {\n          id\n          saleId\n          issuedAt\n        }\n        memberStatistics {\n          txcShared\n          memberStatisticsWallets {\n            id\n          }\n        }\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query FetchMemberStatistics($sort: String, $page: String, $filter: JSONObject) {\n    memberStatistics(sort: $sort, page: $page, filter: $filter) {\n      memberStatistics {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        memberId\n        statisticsId\n        txcShared\n        hashPower\n        percent\n        issuedAt\n        member {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          username\n          fullName\n          email\n          point\n          mobile\n          assetId\n          emailVerified\n          totalIntroducers\n          status\n          state\n          memberWallets {\n            createdAt\n            updatedAt\n            deletedAt\n            id\n            memberId\n            payoutId\n            address\n            percent\n            payout {\n              id\n              method\n              status\n              name\n              display\n              createdAt\n              updatedAt\n              deletedAt\n            }\n          }\n          primaryAddress\n          secondaryAddress\n        }\n        statistics {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          newBlocks\n          totalBlocks\n          totalHashPower\n          totalMembers\n          status\n          txcShared\n          issuedAt\n          from\n          to\n        }\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query FetchMemberStatistics($sort: String, $page: String, $filter: JSONObject) {\n    memberStatistics(sort: $sort, page: $page, filter: $filter) {\n      memberStatistics {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        memberId\n        statisticsId\n        txcShared\n        hashPower\n        percent\n        issuedAt\n        member {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          username\n          fullName\n          email\n          point\n          mobile\n          assetId\n          emailVerified\n          totalIntroducers\n          status\n          state\n          memberWallets {\n            createdAt\n            updatedAt\n            deletedAt\n            id\n            memberId\n            payoutId\n            address\n            percent\n            payout {\n              id\n              method\n              status\n              name\n              display\n              createdAt\n              updatedAt\n              deletedAt\n            }\n          }\n          primaryAddress\n          secondaryAddress\n        }\n        statistics {\n          createdAt\n          updatedAt\n          deletedAt\n          id\n          newBlocks\n          totalBlocks\n          totalHashPower\n          totalMembers\n          status\n          txcShared\n          issuedAt\n          from\n          to\n        }\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation CreateStatistics($data: CreateStatisticsInput!) {\n    createStatistics(data: $data) {\n      id\n      newBlocks\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateStatistics($data: CreateStatisticsInput!) {\n    createStatistics(data: $data) {\n      id\n      newBlocks\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation CreateManyMemberStatistics($data: CreateManyMemberStatisticsInput!) {\n    createManyMemberStatistics(data: $data) {\n      count\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateManyMemberStatistics($data: CreateManyMemberStatisticsInput!) {\n    createManyMemberStatistics(data: $data) {\n      count\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation UpdateStatistics($data: UpdateStatisticsInput!) {\n    updateStatistics(data: $data) {\n      status\n      txcShared\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateStatistics($data: UpdateStatisticsInput!) {\n    updateStatistics(data: $data) {\n      status\n      txcShared\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation RemoveMemberStatisticsByStaitisId($data: IDInput!) {\n    removeMemberStatisticsByStaitisId(data: $data) {\n      count\n    }\n  }\n'
): (typeof documents)['\n  mutation RemoveMemberStatisticsByStaitisId($data: IDInput!) {\n    removeMemberStatisticsByStaitisId(data: $data) {\n      count\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation RemoveManyStatistics($data: IDsInput!) {\n    removeManyStatistics(data: $data) {\n      count\n    }\n  }\n'
): (typeof documents)['\n  mutation RemoveManyStatistics($data: IDsInput!) {\n    removeManyStatistics(data: $data) {\n      count\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query Rewards($from: DateTimeISO!, $to: DateTimeISO!) {\n    rewardsByWallets(from: $from, to: $to) {\n      rewards {\n        txc\n        wallet {\n          id\n          address\n          percent\n          payout {\n            name\n            method\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query Rewards($from: DateTimeISO!, $to: DateTimeISO!) {\n    rewardsByWallets(from: $from, to: $to) {\n      rewards {\n        txc\n        wallet {\n          id\n          address\n          percent\n          payout {\n            name\n            method\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query DailyRewards($from: DateTimeISO!, $to: DateTimeISO!) {\n    dailyRewards(from: $from, to: $to) {\n      rewards {\n        day\n        rewardsByWallet {\n          txc\n          wallet {\n            address\n            payout {\n              method\n            }\n          }\n        }\n        totalTxc\n      }\n    }\n  }\n'
): (typeof documents)['\n  query DailyRewards($from: DateTimeISO!, $to: DateTimeISO!) {\n    dailyRewards(from: $from, to: $to) {\n      rewards {\n        day\n        rewardsByWallet {\n          txc\n          wallet {\n            address\n            payout {\n              method\n            }\n          }\n        }\n        totalTxc\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query MemberStatisticsWallets($sort: String, $page: String, $filter: JSONObject) {\n    memberStatisticsWallets(sort: $sort, page: $page, filter: $filter) {\n      memberStatisticsWallets {\n        id\n        txc\n        issuedAt\n        memberWallet {\n          address\n        }\n        memberStatistic {\n          hashPower\n          percent\n          txcShared\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query MemberStatisticsWallets($sort: String, $page: String, $filter: JSONObject) {\n    memberStatisticsWallets(sort: $sort, page: $page, filter: $filter) {\n      memberStatisticsWallets {\n        id\n        txc\n        issuedAt\n        memberWallet {\n          address\n        }\n        memberStatistic {\n          hashPower\n          percent\n          txcShared\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query FetchSales($sort: String, $page: String, $filter: JSONObject) {\n    sales(sort: $sort, page: $page, filter: $filter) {\n      sales {\n        id\n        invoiceNo\n        memberId\n        packageId\n        orderedAt\n        status\n        member {\n          id\n          username\n          fullName\n          email\n          point\n          mobile\n          assetId\n          primaryAddress\n          secondaryAddress\n          emailVerified\n          totalIntroducers\n          status\n          memberWallets {\n            createdAt\n            updatedAt\n            deletedAt\n            id\n            memberId\n            payoutId\n            address\n            percent\n            payout {\n              id\n              method\n              status\n              name\n              display\n              createdAt\n              updatedAt\n              deletedAt\n            }\n          }\n        }\n        package {\n          id\n          productName\n          amount\n          date\n          token\n          point\n          status\n        }\n        paymentMethod\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query FetchSales($sort: String, $page: String, $filter: JSONObject) {\n    sales(sort: $sort, page: $page, filter: $filter) {\n      sales {\n        id\n        invoiceNo\n        memberId\n        packageId\n        orderedAt\n        status\n        member {\n          id\n          username\n          fullName\n          email\n          point\n          mobile\n          assetId\n          primaryAddress\n          secondaryAddress\n          emailVerified\n          totalIntroducers\n          status\n          memberWallets {\n            createdAt\n            updatedAt\n            deletedAt\n            id\n            memberId\n            payoutId\n            address\n            percent\n            payout {\n              id\n              method\n              status\n              name\n              display\n              createdAt\n              updatedAt\n              deletedAt\n            }\n          }\n        }\n        package {\n          id\n          productName\n          amount\n          date\n          token\n          point\n          status\n        }\n        paymentMethod\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query FetchSaleStats($allFilter: JSONObject, $inactiveFilter: JSONObject) {\n    all: sales(filter: $allFilter) {\n      total\n    }\n    inactive: sales(filter: $inactiveFilter) {\n      total\n    }\n  }\n'
): (typeof documents)['\n  query FetchSaleStats($allFilter: JSONObject, $inactiveFilter: JSONObject) {\n    all: sales(filter: $allFilter) {\n      total\n    }\n    inactive: sales(filter: $inactiveFilter) {\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query Packages($sort: String, $page: String, $filter: JSONObject) {\n    packages(sort: $sort, page: $page, filter: $filter) {\n      packages {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        productName\n        amount\n        status\n        point\n        date\n        token\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query Packages($sort: String, $page: String, $filter: JSONObject) {\n    packages(sort: $sort, page: $page, filter: $filter) {\n      packages {\n        createdAt\n        updatedAt\n        deletedAt\n        id\n        productName\n        amount\n        status\n        point\n        date\n        token\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation Login($data: MemberLoginInput!) {\n    memberLogin(data: $data) {\n      accessToken\n    }\n  }\n'
): (typeof documents)['\n  mutation Login($data: MemberLoginInput!) {\n    memberLogin(data: $data) {\n      accessToken\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation SignUpMember($data: SignupFormInput!) {\n    signUpMember(data: $data) {\n      email\n      username\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation SignUpMember($data: SignupFormInput!) {\n    signUpMember(data: $data) {\n      email\n      username\n      id\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation SendEmailVerification($data: EmailInput!) {\n    sendEmailVerification(data: $data) {\n      token\n    }\n  }\n'
): (typeof documents)['\n  mutation SendEmailVerification($data: EmailInput!) {\n    sendEmailVerification(data: $data) {\n      token\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation EmailVerify($data: EmailVerificationInput!) {\n    emailVerify(data: $data) {\n      message\n      result\n    }\n  }\n'
): (typeof documents)['\n  mutation EmailVerify($data: EmailVerificationInput!) {\n    emailVerify(data: $data) {\n      message\n      result\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query Query($data: LiveStatsArgs!) {\n    liveBlockStats(data: $data) {\n      dailyData {\n        count\n        field\n      }\n      meta\n      total\n    }\n    liveMiningStats {\n      dailyData {\n        count\n        field\n      }\n      meta\n      total\n    }\n    liveUserStats(data: $data) {\n      dailyData {\n        count\n        field\n      }\n      meta\n      total\n    }\n  }\n'
): (typeof documents)['\n  query Query($data: LiveStatsArgs!) {\n    liveBlockStats(data: $data) {\n      dailyData {\n        count\n        field\n      }\n      meta\n      total\n    }\n    liveMiningStats {\n      dailyData {\n        count\n        field\n      }\n      meta\n      total\n    }\n    liveUserStats(data: $data) {\n      dailyData {\n        count\n        field\n      }\n      meta\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query Blocks($page: String, $filter: JSONObject, $sort: String) {\n    blocks(page: $page, filter: $filter, sort: $sort) {\n      blocks {\n        id\n        blockNo\n        hashRate\n        difficulty\n        issuedAt\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query Blocks($page: String, $filter: JSONObject, $sort: String) {\n    blocks(page: $page, filter: $filter, sort: $sort) {\n      blocks {\n        id\n        blockNo\n        hashRate\n        difficulty\n        issuedAt\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query Statistics($page: String, $filter: JSONObject, $sort: String) {\n    statistics(page: $page, filter: $filter, sort: $sort) {\n      statistics {\n        id\n        totalHashPower\n        newBlocks\n        totalBlocks\n        totalMembers\n        txcShared\n        issuedAt\n        from\n        to\n        status\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query Statistics($page: String, $filter: JSONObject, $sort: String) {\n    statistics(page: $page, filter: $filter, sort: $sort) {\n      statistics {\n        id\n        totalHashPower\n        newBlocks\n        totalBlocks\n        totalMembers\n        txcShared\n        issuedAt\n        from\n        to\n        status\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query TXCMemberStatistics($page: String, $filter: JSONObject, $sort: String) {\n    memberStatistics(page: $page, filter: $filter, sort: $sort) {\n      memberStatistics {\n        id\n        hashPower\n        txcShared\n        issuedAt\n        percent\n        createdAt\n        updatedAt\n        deletedAt\n        member {\n          username\n          email\n          assetId\n        }\n        statistics {\n          newBlocks\n          status\n        }\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query TXCMemberStatistics($page: String, $filter: JSONObject, $sort: String) {\n    memberStatistics(page: $page, filter: $filter, sort: $sort) {\n      memberStatistics {\n        id\n        hashPower\n        txcShared\n        issuedAt\n        percent\n        createdAt\n        updatedAt\n        deletedAt\n        member {\n          username\n          email\n          assetId\n        }\n        statistics {\n          newBlocks\n          status\n        }\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query HistoryStatistics($page: String, $filter: JSONObject, $sort: String) {\n    statistics(page: $page, filter: $filter, sort: $sort) {\n      statistics {\n        id\n        totalHashPower\n        newBlocks\n        totalBlocks\n        totalMembers\n        txcShared\n        issuedAt\n        from\n        to\n        status\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'
): (typeof documents)['\n  query HistoryStatistics($page: String, $filter: JSONObject, $sort: String) {\n    statistics(page: $page, filter: $filter, sort: $sort) {\n      statistics {\n        id\n        totalHashPower\n        newBlocks\n        totalBlocks\n        totalMembers\n        txcShared\n        issuedAt\n        from\n        to\n        status\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query Blocksdata($data: BlockStatsArgs!) {\n    blocksData(data: $data) {\n      base\n      difficulty\n      hashRate\n    }\n  }\n'
): (typeof documents)['\n  query Blocksdata($data: BlockStatsArgs!) {\n    blocksData(data: $data) {\n      base\n      difficulty\n      hashRate\n    }\n  }\n'];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
