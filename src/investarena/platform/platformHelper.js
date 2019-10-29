import _ from 'lodash';
import { numberFormat } from './numberFormat';
import { singleton } from './singletonPlatform';
import { getClientWObj } from '../../client/adapters';
import { CHART_ID } from '../constants/objectsInvestarena';

export class PlatformHelper {
  static getMargin(quote, quoteSettings, amount) {
    let margin = '---';
    if (typeof amount === 'string') {
      amount = +amount.replace(/,/g, '');
    }
    if (
      quote &&
      quote.askPrice &&
      +quote.askPrice > 0 &&
      quote.bidPrice &&
      +quote.bidPrice > 0 &&
      quoteSettings &&
      quoteSettings.baseCurrency &&
      quoteSettings.termCurrency &&
      quoteSettings.leverage &&
      +quoteSettings.leverage > 0 &&
      amount &&
      amount > 0
    ) {
      const instrCurrency =
        quoteSettings.baseCurrency !== 'XXX'
          ? quoteSettings.baseCurrency
          : quoteSettings.termCurrency;
      const accountCurrency = singleton.platform.accountCurrency;
      const values = (() => {
        const baseCurrency = quoteSettings.baseCurrency;
        const termCurrency = quoteSettings.termCurrency;
        const value = {};
        const arrRates = singleton.platform.quotes;
        let mid = null;
        let midPrice = null;
        let substrFirs = null;
        let substrSecond = null;
        let isSymbolTrue = false;
        let isCrossCurrTrue = false;
        if (termCurrency === accountCurrency || baseCurrency === accountCurrency) {
          _.forEach(arrRates, item => {
            if (quote['security'] === item.security) {
              value.askPrice = quote.askPrice;
              value.bidPrice = quote.bidPrice;
              return false;
            }
          });
        } else {
          _.forEach(arrRates, item => {
            if (quote['security'] === item.security) {
              value.askPrice = quote.askPrice;
              value.bidPrice = quote.bidPrice;
              midPrice = (parseFloat(value.askPrice) + parseFloat(value.bidPrice)) / 2;
              isSymbolTrue = true;
              _.forEach(arrRates, item => {
                substrFirs = item.security.substring(0, 3);
                substrSecond = item.security.substring(3, 6);
                if (substrFirs === baseCurrency && substrSecond === accountCurrency) {
                  value.midPrice = (parseFloat(item.askPrice) + parseFloat(item.bidPrice)) / 2;
                  value.isAccountCurrencyBasic = false;
                  isCrossCurrTrue = true;
                } else if (substrSecond === baseCurrency && substrFirs === accountCurrency) {
                  value.midPrice = (parseFloat(item.askPrice) + parseFloat(item.bidPrice)) / 2;
                  value.isAccountCurrencyBasic = true;
                  isCrossCurrTrue = true;
                } else if (substrFirs === termCurrency && substrSecond === accountCurrency) {
                  mid = (parseFloat(item.askPrice) + parseFloat(item.bidPrice)) / 2;
                  value.midPrice = midPrice * mid;
                  value.isAccountCurrencyBasic = false;
                  isCrossCurrTrue = true;
                } else if (substrSecond === termCurrency && substrFirs === accountCurrency) {
                  mid = (parseFloat(item.askPrice) + parseFloat(item.bidPrice)) / 2;
                  value.midPrice = midPrice / mid;
                  value.isAccountCurrencyBasic = false;
                  isCrossCurrTrue = true;
                }
                if (isSymbolTrue && isCrossCurrTrue) {
                  return false;
                }
              });
            }
          });
        }
        return value;
      })();
      const askPrice = parseFloat(values.askPrice);
      const bidPrice = parseFloat(values.bidPrice);
      margin = (() => {
        let margin = 0;
        const midPrice = (askPrice + bidPrice) / 2;
        if (quote['security'].substring(0, 3) === accountCurrency) {
          margin = amount / quoteSettings.leverage;
        } else if (
          quote['security'].substring(3, 6) === accountCurrency ||
          instrCurrency === accountCurrency
        ) {
          margin = (amount / quoteSettings.leverage) * midPrice;
        } else if (values.isAccountCurrencyBasic && values.midPrice) {
          margin = amount / quoteSettings.leverage / values.midPrice;
        } else if (!values.isAccountCurrencyBasic && values.midPrice) {
          margin = (amount / quoteSettings.leverage) * values.midPrice;
        }
        return margin;
      })().toFixed(2);
    }
    return margin > 0 ? margin : '---';
  }
  static getCrossUSD(quote, quoteSettings) {
    let crossUSD = 1;
    const curr1 =
      quoteSettings.baseCurrency === 'XXX'
        ? quoteSettings.baseCurrency
        : quoteSettings.termCurrency;
    const curr2 = quoteSettings.termCurrency;
    const arrRates = singleton.platform.quotes;
    const accountCurrency = singleton.platform.accountCurrency;
    if (curr2 && curr2 === accountCurrency) {
      crossUSD = 1;
    } else if (curr1 && curr1 === accountCurrency) {
      crossUSD = (parseFloat(quote.bidPrice) + parseFloat(quote.askPrice)) / 2;
    } else if (arrRates[accountCurrency + curr2]) {
      const tempQuote = arrRates[accountCurrency + curr2];
      crossUSD = (parseFloat(tempQuote.askPrice) + parseFloat(tempQuote.bidPrice)) / 2;
    } else if (arrRates[curr2 + accountCurrency]) {
      const tempQuote = arrRates[curr2 + accountCurrency];
      crossUSD = 1 / ((parseFloat(tempQuote.askPrice) + parseFloat(tempQuote.bidPrice)) / 2);
    }
    return crossUSD;
  }
  static getPostPnl(quote, postPl, recommend, quoteSettings) {
    let pnl = 0;
    if (quote && quote.bidPrice && quote.askPrice && quoteSettings && postPl && postPl.length > 0) {
      const crossUSD = this.getCrossUSD(quote, quoteSettings);
      for (let i = 0, len = postPl.length; i < len; i += 1) {
        if (postPl[i].action === recommend) {
          if (!postPl[i].action || !postPl[i].amount || postPl[i].amount <= 0) {
            pnl = '---';
            break;
          }
          if (postPl[i].action === 'Sell') {
            const currentPrice = parseFloat(quote.askPrice);
            pnl +=
              (-(currentPrice - postPl[i].bid_price) * postPl[i].amount) / parseFloat(crossUSD);
          } else {
            const currentPrice = parseFloat(quote.bidPrice);
            pnl += ((currentPrice - postPl[i].ask_price) * postPl[i].amount) / parseFloat(crossUSD);
          }
        }
      }
    } else {
      pnl = '---';
    }
    return pnl;
  }
  static getPnl(quote, deal, quoteSettings) {
    let pnl = 0;
    if (quote && quote.bidPrice && quote.askPrice) {
      const crossUSD = this.getCrossUSD(quote, quoteSettings);
      const currentPrice = parseFloat(deal['openPrice']);
      if (deal['side'] && (deal['side'] === 'LONG' || deal['side'] === 'BUY')) {
        pnl = (-(currentPrice - quote.bidPrice) * deal['amount']) / parseFloat(crossUSD);
      }
      if (deal['side'] && (deal['side'] === 'SHORT' || deal['side'] === 'SELL')) {
        pnl = ((currentPrice - quote.askPrice) * deal['amount']) / parseFloat(crossUSD);
      }
    }
    return pnl;
  }
  static getPnlRange(quote, deal, quoteSettings) {
    let pnl = 0;
    if (quote && quote.bidPrice && quote.askPrice) {
      const crossUSD = this.getCrossUSD(quote, quoteSettings);
      const amount = deal['amount'];
      const openPrice = parseFloat(deal['openPrice']);
      const currentPrice = parseFloat(deal['currentValue']);
      if (deal['side'] && (deal['side'] === 'SHORT' || deal['side'] === 'SELL')) {
        if (crossUSD > 0) {
          pnl = (-(currentPrice - openPrice) * amount) / parseFloat(crossUSD);
        } else {
          pnl = -(currentPrice - openPrice) * amount * parseFloat(-crossUSD);
        }
      }
      if (deal['side'] && (deal['side'] === 'LONG' || deal['side'] === 'BUY')) {
        if (crossUSD > 0) {
          pnl = ((currentPrice - openPrice) * amount) / parseFloat(crossUSD);
        } else {
          pnl = (currentPrice - openPrice) * amount * parseFloat(-crossUSD);
        }
      }
    }
    return pnl;
  }
  static getLongShort(postPl) {
    const max = 100;
    const min = 0;
    if (postPl && postPl.length !== 0) {
      let allBuy = 0;
      let allSell = 0;
      postPl.forEach(element => {
        if (element.action === 'Buy') {
          allBuy += element.ask_price * element.amount;
        } else if (element.action === 'Sell') {
          allSell += element.bid_price * element.amount;
        }
      });
      if (allSell === 0 && allBuy === 0) return '---';
      allSell = Math.round(Math.abs(allSell) * 100) / 100;
      allBuy = Math.round(Math.abs(allBuy) * 100) / 100;
      const long = Math.round((allBuy / (allBuy + allSell)) * 100);
      const short = Math.round((allSell / (allSell + allBuy)) * 100);
      const res = min + (max - min) / 2 + (((long - short) / 100) * (max - min)) / 2;
      return parseFloat(res).toFixed(0);
    }
    return '---';
  }
  static getDIndex(quote) {
    let dIndex = 1;
    if (
      singleton.platform.userSettings.securitySettings === undefined ||
      !singleton.platform.userSettings.securitySettings[quote['security']]
    ) {
      return dIndex;
    }
    const tick = singleton.platform.userSettings.securitySettings[quote['security']].tickSize;
    const rounding =
      singleton.platform.userSettings.securitySettings[quote['security']].priceRounding / 1000000;
    const market = singleton.platform.userSettings.securitySettings[quote['security']].market;
    if (market !== 'Index') {
      if (tick > 1000) {
        if (rounding === 1) {
          dIndex = 2;
        } else {
          dIndex = 3;
        }
      } else {
        dIndex = 5;
      }
    }
    return dIndex;
  }
  static getPriceDirection(quote, deal) {
    let dealParams = {};
    if (deal['side'] && (deal['side'] === 'SHORT' || deal['side'] === 'SELL')) {
      dealParams.direction = 'SHORT';
      dealParams.price = quote['askPrice'];
    } else {
      dealParams.direction = 'LONG';
      dealParams.price = quote['bidPrice'];
    }
    return dealParams;
  }
  static getFlFix(dIndex) {
    const factor = {
      '3': 0.001,
      '5': 0.00001,
    };
    return factor[dIndex] ? factor[dIndex] : 0;
  }
  static getPriceTakeProfitRange(quote, deal) {
    const maxPercent = singleton.platform.userSettings.takeProfitMaxPercent;
    const minPercent = singleton.platform.userSettings.takeProfitMinPercent;
    const dIndex = this.getDIndex(quote);
    const flFix = this.getFlFix(dIndex);
    const dealParams = this.getPriceDirection(quote, deal);
    let rangesPrice = {};
    let takeProfitMin = 0;
    let takeProfitMax = 0;
    switch (dealParams.direction) {
      case 'SHORT':
        takeProfitMin = (dealParams.price * (100 - maxPercent / 1000000)) / 100 + flFix;
        takeProfitMax = (dealParams.price * (100 - minPercent / 1000000)) / 100 - flFix;
        break;
      case 'LONG':
        takeProfitMin = (dealParams.price * (100 + minPercent / 1000000)) / 100 + flFix;
        takeProfitMax = (dealParams.price * (100 + maxPercent / 1000000)) / 100 - flFix;
        break;
    }
    rangesPrice['min'] = takeProfitMin.toFixed(dIndex);
    rangesPrice['max'] = takeProfitMax.toFixed(dIndex);
    return rangesPrice;
  }
  static getPriceStopLossRange(quote, deal) {
    const maxPercent = singleton.platform.userSettings.stopLossMaxPercent;
    const minPercent = singleton.platform.userSettings.stopLossMinPercent;
    const dIndex = this.getDIndex(quote);
    const flFix = this.getFlFix(dIndex);
    const dealParams = this.getPriceDirection(quote, deal);
    let rangesPrice = {};
    let stopLossMin = 0;
    let stopLossMax = 0;
    switch (dealParams.direction) {
      case 'SHORT':
        stopLossMin = (dealParams.price * (100 + minPercent / 1000000)) / 100 + flFix;
        stopLossMax = (dealParams.price * (100 + maxPercent / 1000000)) / 100 - flFix;
        break;
      case 'LONG':
        stopLossMin = (dealParams.price * (100 - maxPercent / 1000000)) / 100 + flFix;
        stopLossMax = (dealParams.price * (100 - minPercent / 1000000)) / 100 - flFix;
        break;
    }
    rangesPrice['min'] = stopLossMin.toFixed(dIndex);
    rangesPrice['max'] = stopLossMax.toFixed(dIndex);
    return rangesPrice;
  }
  static getAmountStopLossRange(quote, deal, quoteSettings) {
    const minPercent = singleton.platform.userSettings.stopLossMinPercent;
    const maxPercent = singleton.platform.userSettings.stopLossMaxPercent;
    const dealParams = this.getPriceDirection(quote, deal);
    const pnl = this.getPnl(quote, deal, quoteSettings);
    let stopLossMin = 0;
    let stopLossMax = 0;
    let rangesPrice = {};
    let tempDealForMin = {};
    let tempDealForMax = {};
    _.map(deal, (item, key) => {
      tempDealForMin[key] = deal[key];
      tempDealForMax[key] = deal[key];
    });
    switch (dealParams.direction) {
      case 'SHORT':
        stopLossMin = (dealParams.price * (100 + minPercent / 1000000)) / 100;
        stopLossMax = (dealParams.price * (100 + maxPercent / 1000000)) / 100;
        break;
      case 'LONG':
        stopLossMin = (dealParams.price * (100 - minPercent / 1000000)) / 100;
        stopLossMax = (dealParams.price * (100 - maxPercent / 1000000)) / 100;
        break;
    }
    tempDealForMin['currentValue'] = stopLossMin;
    tempDealForMax['currentValue'] = stopLossMax;
    let sMin = this.getPnlRange(quote, tempDealForMin, quoteSettings);
    let sMax = this.getPnlRange(quote, tempDealForMax, quoteSettings);
    if (pnl < 0) {
      sMin = Math.abs(sMin);
      sMax = Math.abs(sMax);
    } else {
      if (sMin > 0 && sMax > 0) {
        sMin = 0;
        sMax = 0;
      } else {
        sMin = Math.abs(sMin);
        sMax = Math.abs(sMax);
      }
    }
    rangesPrice['min'] = sMin.toFixed(2);
    rangesPrice['max'] = sMax.toFixed(2);
    return rangesPrice;
  }
  static getAmountTakeProfitRange(quote, deal, quoteSettings) {
    const minPercent = singleton.platform.userSettings.stopLossMinPercent;
    const maxPercent = singleton.platform.userSettings.stopLossMaxPercent;
    const dealParams = this.getPriceDirection(quote, deal);
    const pnl = this.getPnl(quote, deal, quoteSettings);
    let takeProfitMin = 0;
    let takeProfitMax = 0;
    let rangesPrice = {};
    let tempDealForMin = {};
    let tempDealForMax = {};
    _.map(deal, (item, key) => {
      tempDealForMin[key] = deal[key];
      tempDealForMax[key] = deal[key];
    });
    switch (dealParams.direction) {
      case 'SHORT':
        takeProfitMin = (dealParams.price * (100 - minPercent / 1000000)) / 100;
        takeProfitMax = (dealParams.price * (100 - maxPercent / 1000000)) / 100;
        break;
      case 'LONG':
        takeProfitMin = (dealParams.price * (100 + minPercent / 1000000)) / 100;
        takeProfitMax = (dealParams.price * (100 + maxPercent / 1000000)) / 100;
        break;
    }
    tempDealForMin['currentValue'] = takeProfitMin;
    tempDealForMax['currentValue'] = takeProfitMax;
    let sMin = this.getPnlRange(quote, tempDealForMin, quoteSettings);
    let sMax = this.getPnlRange(quote, tempDealForMax, quoteSettings);
    if (pnl < 0) {
      if (sMin < 0 && sMax < 0) {
        sMin = 0;
        sMax = 0;
      } else {
        sMin = sMin < 0 ? 0 : sMin;
        sMax = Math.abs(sMax);
      }
    } else {
      sMin = Math.abs(sMin);
      sMax = Math.abs(sMax);
    }
    rangesPrice['min'] = (sMin + 0.01).toFixed(2);
    rangesPrice['max'] = sMax.toFixed(2);
    return rangesPrice;
  }
  static getRanges(quote, deal, quoteSettings) {
    let ranges = {
      stopLoss: { amount: {}, rate: {} },
      takeProfit: { amount: {}, rate: {} },
    };
    ranges['stopLoss']['amount'] = this.getAmountStopLossRange(quote, deal, quoteSettings);
    ranges['stopLoss']['rate'] = this.getPriceStopLossRange(quote, deal);
    ranges['takeProfit']['amount'] = this.getAmountTakeProfitRange(quote, deal, quoteSettings);
    ranges['takeProfit']['rate'] = this.getPriceTakeProfitRange(quote, deal);
    return ranges;
  }
  static lessDeal(amount, quoteSettings) {
    const amountParseString = amount.replace(/,/g, '');
    const amountInt = +amountParseString;
    const step = quoteSettings.quantityIncrement / 1000000;
    const res = amountInt - step;
    const decimals = PlatformHelper.countDecimals(step);
    if (res > quoteSettings.minimumQuantity / 1000000) {
      return numberFormat(res, decimals);
    } else {
      return numberFormat(quoteSettings.minimumQuantity / 1000000, decimals);
    }
  }
  static moreDeal(amount, quoteSettings) {
    const amountParseString = amount.replace(/,/g, '');
    const amountInt = +amountParseString;
    const step = quoteSettings.quantityIncrement / 1000000;
    const res = amountInt + step;
    const decimals = PlatformHelper.countDecimals(step);
    if (res < quoteSettings.maximumQuantity / 1000000) {
      return numberFormat(res, decimals);
    } else {
      return numberFormat(quoteSettings.maximumQuantity / 1000000, decimals);
    }
  }
  static validateOnBlur(amount, quoteSettings) {
    const amountParseString = amount.replace(/,/g, '');
    const amountInt = +amountParseString;
    if (amountInt < quoteSettings.minimumQuantity / 1000000) {
      const decimals = PlatformHelper.countDecimals(quoteSettings.minimumQuantity);
      return numberFormat(quoteSettings.minimumQuantity / 1000000, decimals);
    } else if (amountInt > quoteSettings.maximumQuantity / 1000000) {
      const decimals = PlatformHelper.countDecimals(quoteSettings.maximumQuantity);
      return numberFormat(quoteSettings.maximumQuantity / 1000000, decimals);
    } else {
      const resultNumber =
        Math.round(amountInt / (quoteSettings.quantityIncrement / 1000000)) *
        (quoteSettings.quantityIncrement / 1000000);
      const decimals = PlatformHelper.countDecimals(resultNumber);
      return numberFormat(resultNumber, decimals);
    }
  }
  static validateOnChange(amount, quoteSettings) {
    const amountParseString = amount.replace(/,/g, '');
    const amountInt = +amountParseString;
    if (
      amountParseString.length > (quoteSettings.maximumQuantity / 1000000).toString().length ||
      amountInt > quoteSettings.maximumQuantity / 1000000
    ) {
      const decimals = PlatformHelper.countDecimals(quoteSettings.maximumQuantity);
      return numberFormat(quoteSettings.maximumQuantity / 1000000, decimals);
    } else if (amountParseString.length === 0) {
      const decimals = PlatformHelper.countDecimals(quoteSettings.minimumQuantity);
      return numberFormat(quoteSettings.minimumQuantity / 1000000, decimals);
    } else {
      if (amountParseString.match(/[1-9]+?/)) {
        const decimals = PlatformHelper.countDecimals(amountInt);
        return numberFormat(amountInt, decimals);
      } else {
        return amount.replace(/^,/, '');
      }
    }
  }
  static validateOnKeyPress(e) {
    if (e && e.key && !e.key.match(/[0-9]/) && e.key.length === 1) {
      e.preventDefault();
    }
  }
  static validateChangeProfitLossText(input, rangeMin, rangeMax) {
    const completeRegex = /^\d+\.\d+$|^\d+$/i;
    rangeMin = parseFloat(rangeMin);
    rangeMax = parseFloat(rangeMax);
    const digitRegex = /^\d+\.\d+$|^\d+$|^\d+\.$/i;
    const softDigitRegex = /\d+\.\d*|\d+\.|\d*/i;
    if (!digitRegex.test(input.value)) {
      input.value = softDigitRegex.exec(input.value);
    }
    if (input.value.length === 0) {
      return true;
    } else if (
      completeRegex.test(input.value) &&
      parseFloat(input.value) > rangeMin &&
      parseFloat(input.value) < rangeMax
    ) {
      return true;
    } else {
      return false;
    }
  }
  static countDecimals(value) {
    if (Math.floor(value) === value) return 0;
    return value.toString().split('.')[1].length || 0;
  }
}

export const mutateObject = wobjects =>
  wobjects
    .map(wobj => getClientWObj(wobj))
    .filter(wobj => Boolean(wobj[CHART_ID]))
    .map(wobj => ({
      avatarlink: wobj.avatar,
      chartId: wobj[CHART_ID],
      author_permlink: wobj.id,
    }));
