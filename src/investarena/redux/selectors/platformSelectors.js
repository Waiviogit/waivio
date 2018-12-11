import { createSelector } from 'reselect';
// selector
const getPlatformState = (state) => state.platform ;
// reselect function
export const getIsConnectPlatformState = createSelector(
    [ getPlatformState ],
    (platform) => platform.connect
);
export const getIsLoadingPlatformState = createSelector(
    [ getPlatformState ],
    (platform) => platform.isLoading
);
export const getPlatformNameState = createSelector(
    [ getPlatformState ],
    (platform) => platform.platformName
);
export const makePlatformUserStatisticsState = () => createSelector(
    getPlatformState,
    (state, props) => props.balanceType,
    (platform, balanceType) => platform.userStatistics[balanceType]
);
export const getPlatformCurrentAccountState = createSelector(
    [ getPlatformState ],
    (platform) => platform.currentAccountName
);
export const getPlatformUserAccountsState = createSelector(
    [ getPlatformState ],
    (platform) => platform.accounts
);
export const getPlatformAccountCurrencyState = createSelector(
    [ getPlatformState ],
    (platform) => platform.accountCurrency
);
