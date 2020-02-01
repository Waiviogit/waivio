import _ from 'lodash';
import { CanvasHelper } from '../../../helpers/canvasHelper';
import { currentTime } from '../../../helpers/currentTime';

class ChartData {
  constructor({ createdAt, forecast, quoteSecurity, locale, tpPrice, slPrice, canvas, recommend }) {
    this.canvasWork = {
      height: canvas.height - 80,
      width: canvas.width - 65,
    };
    this.times = {
      created: new Date(createdAt).getTime(),
      forecast: new Date(forecast).getTime(),
    };
    this.notEnoughData = false;
    this.stopPrices = {
      upperLine: recommend === 'Buy' ? +tpPrice * 1000000 : +slPrice * 1000000,
      lowerLine: recommend === 'Sell' ? +tpPrice * 1000000 : +slPrice * 1000000,
    };
    this.locale = locale;
    this.quoteSecurity = quoteSecurity;
  }
  updateData({
    platform,
    data,
    quote,
    quoteSettings,
    chartType,
    priceType,
    isExpired,
    expiredByTime,
    timeScale,
    expiredAt,
    isScaleChanged,
    isNightMode,
  }) {
    this.timeScale = timeScale;
    const barsData = (data && data[this.timeScale]) || data;
    if (barsData && barsData.length > 1) {
      this.isExpired = isExpired;
      this.expiredByTime = expiredByTime !== false;
      if (!this.expiredByTime && expiredAt && isScaleChanged) {
        this.times.forecast = new Date(expiredAt).getTime();
      }
      this.brokenStopPrices = isExpired && !this.expiredByTime;
      this.chartType = chartType;
      this.quoteSettings = quoteSettings;
      this.platform = platform;
      this.recommend = priceType;
      this.updatedAt = isExpired ? this.times.forecast : currentTime.getTime();
      this.chartInfo = CanvasHelper.getChartInfo(
        this.times.created,
        this.times.forecast,
        this.updatedAt,
        this.canvasWork.width,
        isExpired,
        this.timeScale,
      );
      this.shortBars = this.getShortBars(quote, barsData);
      this.quote = this.getQuoteOptions(quote, priceType);
      this.scaleY = this.getScaleY();
      this.notEnoughData = false;
      this.isNightMode = isNightMode;
    } else {
      this.notEnoughData = true;
    }
    if (this.update) {
      this.update(this);
    }
    return this.notEnoughData;
  }
  getQuoteOptions(quote, priceType) {
    let price = 0;
    let state = 'not-update';
    let askBid = '';
    let beforeStart = null;
    if (quote) {
      if (priceType === 'Buy') {
        askBid = 'closeAsk';
        price = Math.round(quote.askPrice * 1000000);
      } else if (priceType === 'Sell') {
        askBid = 'closeBid';
        price = Math.round(quote.bidPrice * 1000000);
      }
      if (this.isExpired) {
        price = _.last(this.shortBars)[askBid];
      }
      state = quote.state;
      let beforeStartIndex = this.shortBars.length - this.chartInfo.barsAfterStart - 1;
      if (beforeStartIndex < 0) {
        beforeStartIndex = 0;
      }
      beforeStart = this.shortBars[beforeStartIndex][askBid];
    }
    return {
      price,
      state,
      askBid,
      beforeStart,
    };
  }
  getShortBars(quote, data) {
    let barsData = [...data];
    if (!this.isExpired) {
      const barFromQuote = {
        closeAsk: Math.round(quote.askPrice * 1000000),
        closeBid: Math.round(quote.bidPrice * 1000000),
        highAsk: Math.round(quote.askPrice * 1000000),
        highBid: Math.round(quote.bidPrice * 1000000),
        lowAsk: Math.round(quote.askPrice * 1000000),
        lowBid: Math.round(quote.bidPrice * 1000000),
        openAsk: barsData[barsData.length - 2] && barsData[barsData.length - 2].closeAsk,
        openBid: barsData[barsData.length - 2] && barsData[barsData.length - 2].closeBid,
        quote: true,
        time: this.updatedAt,
      };
      const lastBarTime = _.last(barsData).time;
      if (this.updatedAt > lastBarTime) {
        barsData.push(barFromQuote);
      } else {
        barsData[barsData.length - 1] = barFromQuote;
      }
    }
    barsData = barsData.slice(barsData.length - this.chartInfo.barsAll);
    return this.correctBars(barsData);
  }
  getScaleY() {
    const { shortBars, quote } = this;
    const maxY = Math.abs(this.getMax(shortBars, quote.askBid) - quote.beforeStart);
    const minY = Math.abs(this.getMin(shortBars, quote.askBid) - quote.beforeStart);
    const maxYDeviation = Math.max(maxY, minY);
    return this.canvasWork.height / (maxYDeviation || 1000) / 2;
  }
  getMax(bars, askBid) {
    const upperLine = this.stopPrices.upperLine;
    let max = null;
    if (bars) {
      if (askBid === 'closeAsk') {
        max = upperLine
          ? Math.max(_.get(_.maxBy(bars, 'highAsk'), 'highAsk', 0), upperLine)
          : _.get(_.maxBy(bars, 'highAsk'), 'highAsk', 0);
      } else if (askBid === 'closeBid') {
        max = upperLine
          ? Math.max(_.get(_.maxBy(bars, 'highBid'), 'highBid', 0), upperLine)
          : _.get(_.maxBy(bars, 'highBid'), 'highBid', 0);
      }
      return max;
    }
  }
  getMin(bars, askBid) {
    const lowerLine = this.stopPrices.lowerLine;
    let min = null;
    if (bars) {
      if (askBid === 'closeAsk') {
        min = lowerLine
          ? Math.min(_.get(_.minBy(bars, 'lowAsk'), 'lowAsk', 0), lowerLine)
          : _.get(_.minBy(bars, 'lowAsk'), 'lowAsk', 0);
      } else if (askBid === 'closeBid') {
        min = lowerLine
          ? Math.min(_.get(_.minBy(bars, 'lowBid'), 'lowBid', 0), lowerLine)
          : _.get(_.minBy(bars, 'lowBid'), 'lowBid', 0);
      }
      return min;
    }
  }
  onUpdate(catchUpdate) {
    this.update = catchUpdate;
  }
  correctBars = bars => {
    const correctedShortBars = [];
    for (let i = bars.length - 1; i > 0; i -= 1) {
      const bar = bars[i];
      correctedShortBars.push(bars[i]);
      const gaps = Math.ceil((bar.time - bars[i - 1].time) / this.chartInfo.msecondsPerBar);
      for (let k = 1; k < gaps; k += 1) {
        correctedShortBars.push(
          !bar.quote
            ? { ...bar, time: bar.time - k * this.chartInfo.msecondsPerBar }
            : { ...bar, time: bars[i - 1].time + k * this.chartInfo.msecondsPerBar },
        );
      }
      if (correctedShortBars.length > bars.length) {
        break;
      }
    }
    correctedShortBars.push(bars[0]);
    return _.orderBy(correctedShortBars, ['time'], ['asc']).slice(-1 * bars.length);
  };
}

export default ChartData;
