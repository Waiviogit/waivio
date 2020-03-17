export const prepareData = forecasts => {
  const forecastData = [['', '']];
  forecasts.forEach(forecast => {
    forecastData.push([forecast.name, forecast.count]);
  });
  return forecastData;
};

export const prepareInstrumentsData = (quotes, statData) =>
  statData.map(instrument => ({
    ...instrument,
    name: quotes[instrument.quote].name,
    wobjData: quotes[instrument.quote].wobjData,
    market: quotes[instrument.quote].market,
  }));

export const getCrossBalance = (accountId, crossStatistics, crossCurrency) => {
  const { balance } =
    (crossStatistics[accountId] &&
      crossStatistics[accountId].filter(item => item.asset === crossCurrency)[0]) ||
    {};
  return balance;
};

export const getHolding = (accountId, userStatistics, currencySetting, crossBalance) => {
  const { name, currency, precision, minimalWithdrawal } = currencySetting;
  const holding = {
    id: accountId,
    name,
    total: 0,
    value: crossBalance,
    inOrders: 0,
    currency,
    logoName: currency,
    available: 0,
    precision,
    minimalWithdrawal,
  };

  if (!userStatistics || !userStatistics[accountId]) {
    return holding;
  }

  const accountStatistics = userStatistics[accountId];
  const { balance: total, marginUsed: inOrders, freeBalance: available } = accountStatistics;

  return {
    ...holding,
    total,
    inOrders,
    available,
  };
};

export const getHoldingByAccount = (
  account,
  userStatistics,
  currencySettings,
  crossStatistics = {},
  crossCurrency,
) => {
  const { id: accountId, currency } = account;
  const crossBalance = getCrossBalance(accountId, crossStatistics, crossCurrency);

  return getHolding(accountId, userStatistics, currencySettings[currency], crossBalance);
};

export const getHoldingsByAccounts = (
  accountsMap,
  userStatistics,
  currencySettings,
  crossStatistics,
  crossCurrency,
) => {
  return Object.keys(accountsMap).map(accountId => {
    return getHoldingByAccount(
      accountsMap[accountId],
      userStatistics,
      currencySettings,
      crossStatistics,
      crossCurrency,
    );
  });
};
