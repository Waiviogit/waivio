import { get, toUpper, toLower, find, isEmpty, last, nth } from 'lodash';
import { CRYPTO_MAP } from '../../common/constants/cryptos';

export function getCryptoDetails(cryptoQuery) {
  const getCryptoBySymbol = get(CRYPTO_MAP, toUpper(cryptoQuery), {});

  if (!isEmpty(getCryptoBySymbol)) {
    return getCryptoBySymbol;
  }

  const cryptoDetails = find(CRYPTO_MAP, crypto => {
    const formattedCryptoName = toLower(crypto.name).replace(/\s/g, ''); // lowercase & remove spaces
    const formattedCryptoSymbol = toLower(crypto.symbol);
    const matchesCryptoId = crypto.id === cryptoQuery;
    const matchesCryptoName = formattedCryptoName === cryptoQuery;
    const matchesCryptoSymbol = formattedCryptoSymbol === cryptoQuery;
    return matchesCryptoId || matchesCryptoName || matchesCryptoSymbol;
  });

  return cryptoDetails || {};
}

export const getCurrentDaysOfTheWeek = currentLocale => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const daysOfTheWeek = [];
  const locale = currentLocale === 'auto' ? window.navigator.language : currentLocale;

  for (let i = 0; i < 7; i += 1) {
    date.setDate(date.getDate() + 1);
    const dateLocale = date.toLocaleString(locale, { weekday: 'short' });
    daysOfTheWeek.push(dateLocale);
  }

  return daysOfTheWeek;
};

function getPriceDifferencePercentage(currentCryptoPrice, previousCryptoPrice) {
  const priceDifference = currentCryptoPrice - previousCryptoPrice;
  const priceIncrease = priceDifference / currentCryptoPrice;
  return Math.abs(priceIncrease);
}

export function getCryptoPriceIncreaseDetails(usdCryptoPriceHistory, btcCryptoPriceHistory) {
  const currentUSDPrice = last(usdCryptoPriceHistory);
  const previousUSDPrice = nth(usdCryptoPriceHistory, -2);
  const cryptoUSDIncrease = currentUSDPrice > previousUSDPrice;
  const usdPriceDifferencePercent = getPriceDifferencePercentage(currentUSDPrice, previousUSDPrice);

  const currentBTCPrice = last(btcCryptoPriceHistory);
  const previousBTCPrice = nth(btcCryptoPriceHistory, -2);
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
