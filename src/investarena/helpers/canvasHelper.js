import moment from 'moment';
import { optionsTimeScale } from '../constants/selectData';

const MSEC_PER_MIN = 60000;
const MAX_WIDTH_PERCENT = 0.9;
const MIN_PER_WEEK = 10080;
const MIN_PER_DAY = 1440;

export class CanvasHelper {
  static hours = {
    Minute: 1,
    Minute5: 5,
    Minute15: 15,
    Minute30: 30,
    Hour: 60,
    Hour4: 60 * 4,
    Hour8: 60 * 8,
    Day: 60 * 24,
    Week: 60 * 24 * 7,
    Month: 60 * 24 * 31,
    MINUTE: 1,
    MINUTE5: 5,
    MINUTE15: 15,
    MINUTE30: 30,
    HOUR: 60,
    HOUR4: 60 * 4,
    HOUR8: 60 * 8,
    DAY: 60 * 24,
    WEEK: 60 * 24 * 7,
    MONTH: 60 * 24 * 31,
  };
  static getTimeScale(createdAt, forecast) {
    const timeScale = moment.utc(moment(forecast).diff(moment(createdAt))) / MSEC_PER_MIN;
    const minBars = 20; // default 240
    if (timeScale < 0) return undefined;
    else if (timeScale < minBars) return 'MINUTE';
    else if (timeScale < minBars * 5) return 'MINUTE5';
    else if (timeScale < minBars * 15) return 'MINUTE15';
    else if (timeScale < minBars * 30) return 'MINUTE30';
    else if (timeScale < minBars * 60) return 'HOUR';
    else if (timeScale < minBars * 60 * 4) return 'HOUR4';
    else if (timeScale < minBars * 60 * 8) return 'HOUR8';
    else if (timeScale < minBars * 60 * 24) return 'DAY';
    else if (timeScale < minBars * 60 * 24 * 7) return 'WEEK';
    else if (timeScale < minBars * 60 * 24 * 31) return 'MONTH';
  }
  static getTimeScaleOptions(createdAt, forecast) {
    const timeScale = moment.utc(moment(forecast).diff(moment(createdAt))) / MSEC_PER_MIN;
    const minBars = 20;
    if (timeScale < 0) return undefined;
    else if (timeScale < minBars) return optionsTimeScale.slice(0, 3);
    else if (timeScale < minBars * 5) return optionsTimeScale.slice(0, 4);
    else if (timeScale < minBars * 15) return optionsTimeScale.slice(0, 5);
    else if (timeScale < minBars * 30) return optionsTimeScale.slice(0, 6);
    else if (timeScale < minBars * 60) return optionsTimeScale.slice(0, 7);
    else if (timeScale < minBars * 60 * 4) return optionsTimeScale.slice(0, 8);
    else if (timeScale < minBars * 60 * 8) return optionsTimeScale.slice(0, 9);
    else if (timeScale < minBars * 60 * 24) return optionsTimeScale.slice(0, 10);
    else if (timeScale < minBars * 60 * 24 * 7) return optionsTimeScale.slice(0, 11);
    else if (timeScale < minBars * 60 * 24 * 31) return optionsTimeScale.slice(0, 12);
  }
  static getTimeScaleModalPost(createdAt, forecast) {
    const timeScale = moment.utc(moment(forecast).diff(moment(createdAt))) / MSEC_PER_MIN;
    const minBars = 20; // default 240
    if (timeScale < 0) return undefined;
    else if (timeScale < minBars) return '1';
    else if (timeScale < minBars * 5) return '5';
    else if (timeScale < minBars * 15) return '15';
    else if (timeScale < minBars * 30) return '30';
    else if (timeScale < minBars * 60) return '60';
    else if (timeScale < minBars * 60 * 4) return 'HOUR4';
    else if (timeScale < minBars * 60 * 8) return 'HOUR8';
    else if (timeScale < minBars * 60 * 24) return 'DAY';
    else if (timeScale < minBars * 60 * 24 * 7) return 'WEEK';
    else if (timeScale < minBars * 60 * 24 * 31) return 'MONTH';
  }
  static getStrictTimescale(createdAt, forecast) {
    const timeScale = moment.utc(moment(forecast).diff(moment(createdAt))) / MSEC_PER_MIN;
    const minBars = 20; // default 240
    if (timeScale < 0) return undefined;
    else if (timeScale < minBars) return 1;
    else if (timeScale < minBars * 5) return 5;
    else if (timeScale < minBars * 15) return 15;
    else if (timeScale < minBars * 30) return 30;
    else if (timeScale < minBars * 60) return 60;
    else if (timeScale < minBars * 60 * 4) return 60 * 4;
    else if (timeScale < minBars * 60 * 8) return 60 * 8;
    else if (timeScale < minBars * 60 * 24) return 60 * 24;
    else if (timeScale < minBars * 60 * 24 * 7) return 60 * 24 * 7;
    else if (timeScale < minBars * 60 * 24 * 31) return 60 * 24 * 31;
  }
  static getChartInfo(createdAt, forecast, timeNow, canvasWidth, isExpired, timeScale) {
    const minutePerBar = timeScale
      ? CanvasHelper.hours[timeScale]
      : this.getStrictTimescale(createdAt, forecast);
    const msecondsPerBar = MSEC_PER_MIN * minutePerBar;
    const barsBetweenStartAndFinish = CanvasHelper.getBarsBetweenStartAndFinish(
      forecast,
      createdAt,
      minutePerBar,
    );
    let barsAfterStart = CanvasHelper.getBarsAfterStart(
      timeNow,
      createdAt,
      minutePerBar,
      msecondsPerBar,
      isExpired,
    );
    const pxPerBar = CanvasHelper.getPxPerBar(canvasWidth, barsBetweenStartAndFinish);
    const barsPerGrid = CanvasHelper.getBarsPerGrid(pxPerBar, minutePerBar);
    const pxPerGrid = pxPerBar * barsPerGrid;
    const maxBars = Math.floor(canvasWidth / pxPerBar);
    let barsBeforeStart =
      barsBetweenStartAndFinish >= maxBars ? 3 : maxBars - barsBetweenStartAndFinish;
    if (barsAfterStart >= maxBars) {
      barsAfterStart = Math.ceil(maxBars * MAX_WIDTH_PERCENT) - 3;
    }
    if (barsBeforeStart > maxBars / 2) {
      barsBeforeStart = Math.floor(maxBars / 2);
    }
    const barsAll = barsBeforeStart + barsAfterStart;
    return {
      pxPerGrid,
      barsPerGrid,
      pxPerBar,
      msecondsPerBar,
      minutePerBar,
      barsAll,
      barsAfterStart,
    };
  }
  static getBarsBetweenStartAndFinish = (forecast, createdAt, minutePerBar) => {
    let minutesBeforeStart = Math.ceil((forecast - createdAt) / MSEC_PER_MIN);
    if (minutesBeforeStart < 4) {
      minutesBeforeStart = 4;
    }
    return Math.ceil(minutesBeforeStart / minutePerBar);
  };
  static getBarsAfterStart = (timeNow, createdAt, minutePerBar, msecondsPerBar, isExpired) => {
    const roundedCreated = Math.floor(moment(createdAt) / msecondsPerBar) * msecondsPerBar;
    const minutesAfterStart = isExpired
      ? Math.round((timeNow - roundedCreated) / MSEC_PER_MIN)
      : Math.ceil((timeNow - roundedCreated) / MSEC_PER_MIN);
    return Math.ceil(minutesAfterStart / minutePerBar);
  };
  static getPxPerBar = (canvasWidth, barsBeforeStart) => {
    let pxPerBar = Math.ceil(canvasWidth / 2 / barsBeforeStart);
    if (pxPerBar < 7) {
      pxPerBar = 7;
    } else if (pxPerBar > 15) {
      pxPerBar = 15;
    }
    return pxPerBar;
  };
  static getBarsPerGrid = (pxPerBar, minutePerBar) => {
    let barsPerGrid =
      minutePerBar === MIN_PER_WEEK || minutePerBar === MIN_PER_DAY
        ? Math.ceil(60 / pxPerBar)
        : Math.floor(60 / pxPerBar);
    if (barsPerGrid > 10) {
      barsPerGrid = 10;
    }
    return barsPerGrid;
  };
}
