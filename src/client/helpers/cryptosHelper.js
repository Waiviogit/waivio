import _ from 'lodash';
import { CRYPTO_MAP } from '../../common/constants/cryptos';

export function getCryptoDetails(cryptoQuery) {
  const getCryptoBySymbol = _.get(CRYPTO_MAP, _.toUpper(cryptoQuery), {});

  if (!_.isEmpty(getCryptoBySymbol)) {
    return getCryptoBySymbol;
  }

  const cryptoDetails = _.find(CRYPTO_MAP, crypto => {
    const formattedCryptoName = _.toLower(crypto.name).replace(/\s/g, ''); // lowercase & remove spaces
    const formattedCryptoSymbol = _.toLower(crypto.symbol);
    const matchesCryptoId = crypto.id === cryptoQuery;
    const matchesCryptoName = formattedCryptoName === cryptoQuery;
    const matchesCryptoSymbol = formattedCryptoSymbol === cryptoQuery;
    return matchesCryptoId || matchesCryptoName || matchesCryptoSymbol;
  });

  return cryptoDetails || {};
}

export const getCryptoChartDataMapper = currentLocale => ({ createdAt, usd: price }) => {
  const locale = currentLocale === 'auto' ? window.navigator.language : currentLocale;
  const date = new Date(createdAt);
  const day = date.toLocaleString(locale, { weekday: 'short' });
  const tooltipMsg = `${day}: $${price.toFixed(3)}`;
  return [day, price, tooltipMsg];
};

export const getChartOptions = (chartData, isNightMode) => ({
  backgroundColor: 'transparent',
  colors: ['#3a79ee'],
  chartArea: { left: 0, top: 0, width: '100%', height: '70%' },
  enableInteractivity: true,
  lineWidth: 2,
  legend: 'none',
  hAxis: {
    baselineColor: 'transparent',
    gridlines: {
      color: 'transparent',
      count: 4,
      minSpacing: 50,
    },
    textStyle: {
      color: isNightMode ? '#99aab5' : 'black',
    },
  },
  vAxis: {
    baselineColor: 'transparent',
    gridlines: {
      color: 'transparent',
    },
    viewWindow: {
      max: _.ceil(_.maxBy(chartData, data => data.usd).usd, 3),
      min: _.floor(_.minBy(chartData, data => data.usd).usd, 3),
    },
  },
});

function getPriceDifferencePercentage(currentCryptoPrice, previousCryptoPrice) {
  const priceDifference = currentCryptoPrice - previousCryptoPrice;
  const priceIncrease = priceDifference / currentCryptoPrice;
  return Math.abs(priceIncrease);
}

export function getCryptoPriceIncreaseDetails(usdCryptoPriceHistory, btcCryptoPriceHistory) {
  const currentUSDPrice = _.last(usdCryptoPriceHistory);
  const previousUSDPrice = _.nth(usdCryptoPriceHistory, -2);
  const cryptoUSDIncrease = currentUSDPrice > previousUSDPrice;
  const usdPriceDifferencePercent = getPriceDifferencePercentage(currentUSDPrice, previousUSDPrice);

  const currentBTCPrice = _.last(btcCryptoPriceHistory);
  const previousBTCPrice = _.nth(btcCryptoPriceHistory, -2);
  const cryptoBTCIncrease = currentBTCPrice > previousBTCPrice;
  const btcPriceDifferencePercent = getPriceDifferencePercentage(currentBTCPrice, previousBTCPrice);

  return {
    currentUSDPrice,
    currentBTCPrice,
    cryptoUSDIncrease,
    cryptoBTCIncrease,
    usdPriceDifferencePercent,
    btcPriceDifferencePercent,
  };
}
