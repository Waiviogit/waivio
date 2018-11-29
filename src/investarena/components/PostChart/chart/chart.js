import _ from 'lodash';
import moment from 'moment/moment';
import { ParsingPriceHelper } from '../../../platform/parsingPrice';

const MINUTE_PER_DAY = 60 * 24;

class Chart {
    constructor ({ canvas, animatedCircle }) {
        this.canvas = canvas;
        this.animatedCircle = animatedCircle;
        this.imageStart = new Image();
        this.imageStart.src = '/images/investarena/start.png';
        this.imageEnd = new Image();
        this.imageEnd.src = '/images/investarena/finish.png';
        this.ctx = this.canvas.getContext('2d');
        this.gridCellHeight = 30;
        this.canvasWork = {
            height: this.canvas.height - 80,
            width: this.canvas.width - 80
        };
        this.centerHeight = this.canvas.height / 2 - 10;
        this.lineWidth = {
            grid: 0.3,
            chart: 1
        };
        this.colors = {
            chartLine: '#2942ee',
            startLine: 'grey',
            finishLine: '#ee5451',
            gridLine: '#eee',
            polygon: { Buy: '#1ebea5', Sell: '#ee5451' },
            quote: {
                notUpdate: '#c7c7c7', up: '#1ebea5', down: '#ee5451', stroke: { up: '#1a735b', down: '#733230' }
            }
        };
        if (this.ctx) {
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#ccc';
        }
    }
    clearCanvas () {
        this.ctx.save();
        this.ctx.translate(0.5, 0.5);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawChart = (chartData) => {
        this.clearCanvas();
        const {
            shortBars, chartInfo, chartType, quote, scaleY,
            quoteSettings, stopPrices, recommend, times, notEnoughData, locale, isExpired,
            expiredByTime, brokenStopPrices
        } = chartData;
        this.assignChartInfo(chartInfo);
        if (notEnoughData) {
            this.pxPerGrid = 55;
            this.drawErrors(locale);
        } else {
            this.getStartFinishX(shortBars, times);
            this.scaleY = scaleY;
            this.quoteBeforeStart = quote.beforeStart;
            if (shortBars && shortBars.length !== 0) {
                this.drawGrid();
                if (chartType === 'Line') {
                    this.drawLineChart(shortBars, quote, isExpired, expiredByTime);
                } else if (chartType === 'Candle') {
                    this.drawCandleChart(shortBars, quote.askBid, isExpired);
                }
                this.drawQuotationMark();
                if (!isExpired && quote) {
                    this.drawQuotationLine(chartType, quote, quoteSettings, shortBars);
                }
                this.drawStartLine();
                this.drawTimeMark(shortBars, times);
                this.drawStartPolygon(recommend, brokenStopPrices);
                if (isExpired) {
                    this.drawExpiredText(locale, brokenStopPrices);
                }
                if (!isExpired || expiredByTime) {
                    this.drawFinishLine();
                }
                this.drawStopPriceLine(scaleY, stopPrices, recommend, brokenStopPrices);
                this.ctx.restore();
            }
        }
    };
    assignChartInfo = (chartInfo) => {
        if (chartInfo) {
            Object.keys(chartInfo).forEach((key) => {
                this[key] = chartInfo[key];
            });
        }
    };
    getStartFinishX = (shortBars, times) => {
        this.firstBarTime = shortBars[0].time;
        this.startLineX = this.getXByTimestamp(times.created);
        this.finishLineX = this.getXByTimestamp(times.forecast);
    };
    drawLineChart (shortBars, quote, isExpired, expiredByTime) {
        let x = 0;
        let y = 0;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth.chart;
        this.ctx.lineTo(-1, this.centerHeight + this.canvasWork.height);
        shortBars.forEach((bar, i) => {
            const continueDrawing = isExpired
                ? expiredByTime || !bar.correctedBars
                : true;
            if (continueDrawing) {
                if (i === shortBars.length - 1) {
                    const price = isExpired ? bar[quote.askBid] : quote.price;
                    y = this.getYByPrice(price);
                    x = isExpired ? this.finishLineX : this.getXByTimestamp(bar.time);
                } else {
                    y = this.getYByPrice(bar[quote.askBid]);
                    x = i === 0 ? this.getXByTimestamp(bar.time) - 1 : this.getXByTimestamp(bar.time);
                }
                if (x <= this.finishLineX) {
                    this.ctx.lineTo(x, y);
                }
            }
        });
        this.ctx.strokeStyle = this.colors.chartLine;
        this.ctx.stroke();
        this.ctx.lineTo(x, this.centerHeight + this.canvasWork.height);
        this.ctx.lineWidth = 0.1;
        this.ctx.stroke();
        this.ctx.closePath();
        const gradientLineChart = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        this.ctx.globalAlpha = 0.5;
        gradientLineChart.addColorStop(0, '#2942ee');
        gradientLineChart.addColorStop(0.5, '#3a79ee');
        gradientLineChart.addColorStop(1, '#dbe1f9');
        this.ctx.fillStyle = gradientLineChart;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
    drawErrors () {
        this.drawGrid(true);
        const canvasPart = this.canvas.width / 4;
        this.drawLine(canvasPart, 0, canvasPart, this.canvas.height - 30, this.colors.startLine, 1, 1);
        this.drawCircle(canvasPart, this.canvas.height - 30, 10, 2, this.colors.startLine, this.colors.startLine);
        this.ctx.drawImage(this.imageStart, canvasPart - 7.5, this.canvas.height - 37.5);
        this.drawLine(3 * canvasPart, 0, 3 * canvasPart, this.canvas.height - 30, this.colors.finishLine, 1, 1);
        this.drawCircle(3 * canvasPart, this.canvas.height - 30, 10, 2, this.colors.finishLine, this.colors.finishLine);
        this.ctx.drawImage(this.imageEnd, 3 * canvasPart - 4.5, this.canvas.height - 38);
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this.drawText(this.canvas.width / 2, this.canvas.height / 2, 'Not enought data', '18px Arial', 'gray');
        this.drawText(this.canvas.width / 2, this.canvas.height / 2 + 30, 'For this period', '16px Arial', 'gray');
        this.ctx.restore();
    }
    drawStopPriceLine (scaleY, stopPrices, recommend, brokenStopPrices) {
        const finishX = this.finishLineX > this.canvasWork.width || brokenStopPrices
            ? this.canvasWork.width
            : this.finishLineX;
        if (stopPrices.lowerLine) {
            const color = recommend === 'Buy' ? 'red' : 'green';
            const heightCoord = this.getYByPrice(stopPrices.lowerLine) + 0.5;
            this.drawLine(this.startLineX, heightCoord, finishX, heightCoord, color, 1, false, true);
        }
        if (stopPrices.upperLine) {
            const color = recommend === 'Sell' ? 'red' : 'green';
            const heightCoord = this.getYByPrice(stopPrices.upperLine) + 0.5;
            this.drawLine(this.startLineX, heightCoord, finishX, heightCoord, color, 1, false, true);
        }
    }
    drawGrid (expired) {
        this.ctx.strokeStyle = this.colors.gridLine;
        this.ctx.lineWidth = this.lineWidth.grid;
        const width = expired ? this.canvas.width : this.canvasWork.width;
        const height = expired ? this.canvas.height : this.canvas.height - this.gridCellHeight;
        for (let x = this.pxPerGrid; x < width; x += this.pxPerGrid) {
            for (let y = this.gridCellHeight; y < this.canvas.height; y += this.gridCellHeight) {
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, height);
                this.ctx.stroke();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(width, y);
                this.ctx.stroke();
            }
        }
    }
    drawStartLine () {
        this.drawLine(this.startLineX, 0, this.startLineX, this.canvas.height - 30, this.colors.startLine, 1, 1);
    }
    drawFinishLine () {
        if (this.finishLineX <= this.canvas.width) {
            this.drawLine(this.finishLineX, 0, this.finishLineX, this.canvas.height - 30, this.colors.finishLine, 1, 1);
            this.drawCircle(this.finishLineX, this.canvas.height - 30, 10, 2, this.colors.finishLine, this.colors.finishLine);
            this.ctx.drawImage(this.imageEnd, this.finishLineX - 4.5, this.canvas.height - 38);
        }
    }
    drawStartPolygon (recommend, brokenStopPrices) {
        const polygonHeightCoord = this.canvas.height - 30;
        const start = this.startLineX;
        const finishLine = brokenStopPrices ? this.canvasWork.width : this.finishLineX;
        const startLine = start + 50;
        const arrayDot = [
            [start + 10,
                start,
                start - 40,
                start - 40,
                start,
                start + 10],
            [polygonHeightCoord,
                polygonHeightCoord - 10,
                polygonHeightCoord - 10,
                polygonHeightCoord + 10,
                polygonHeightCoord + 10,
                polygonHeightCoord]
        ];
        const grd = this.ctx.createLinearGradient(startLine, polygonHeightCoord, startLine + (finishLine - startLine) + 25, polygonHeightCoord);
        if (recommend === 'Buy') {
            grd.addColorStop(0.000, 'rgba(30, 190, 165, 1.000)');
            grd.addColorStop(1.000, 'rgba(255, 255, 255, 1.000)');
        } else if (recommend === 'Sell') {
            grd.addColorStop(0.000, 'rgba(238, 84, 81, 1.000)');
            grd.addColorStop(1.000, 'rgba(255, 255, 255, 1.000)');
        }
        this.ctx.fillStyle = grd;
        this.ctx.fillRect(start - 40, polygonHeightCoord - 11, finishLine - startLine + 95, 22);
        this.ctx.beginPath();
        this.ctx.moveTo(arrayDot[0][0], arrayDot[1][0]);
        this.ctx.lineWidth = 15;
        for (let i = 0; i < arrayDot[0].length - 1; i += 1) {
            this.ctx.lineWidth = 3;
            this.ctx.lineTo(arrayDot[0][i], arrayDot[1][i]);
        }
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'white';
        this.ctx.fill();
        this.drawText(start - 33, polygonHeightCoord + 4, recommend.toUpperCase(), '14px OpenSans, sans-serif', this.colors.polygon[recommend]);
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colors.polygon[recommend];
        this.ctx.lineWidth = 1.5;
        this.ctx.moveTo(start - 40, polygonHeightCoord + 10);
        this.ctx.lineTo(start, polygonHeightCoord + 10);
        this.ctx.moveTo(start - 40, polygonHeightCoord - 10);
        this.ctx.lineTo(start, polygonHeightCoord - 10);
        this.ctx.moveTo(start - 40, polygonHeightCoord - 10);
        this.ctx.lineTo(start - 40, polygonHeightCoord + 10);
        this.ctx.moveTo(start, polygonHeightCoord - 10);
        this.ctx.lineTo(start + 10, polygonHeightCoord);
        this.ctx.moveTo(start, polygonHeightCoord + 10);
        this.ctx.lineTo(start + 10, polygonHeightCoord);
        this.ctx.stroke();
    }
    drawText (x, y, text, font, color) {
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }
    drawExpiredText (locale, brokenStopPrices) {
        this.ctx.font = '18px Arial';
        this.ctx.fillStyle = 'white';
        const text = 'Chart expired';
        const textWidth = this.ctx.measureText(text).width;
        const finishX = brokenStopPrices ? this.canvasWork.width : this.finishLineX;
        if (finishX - this.startLineX > textWidth) {
            const x = this.startLineX + (finishX - this.startLineX) / 2 - textWidth / 2;
            const y = this.canvas.height - 25;
            this.ctx.fillText(text, x, y);
        }
    }
    drawLine (x1, y1, x2, y2, color, strokeWidth, alpha, dashed) {
        let oldWidth = null;
        if (strokeWidth) {
            oldWidth = this.ctx.lineWidth;
            this.ctx.lineWidth = strokeWidth;
        }
        if (alpha) {
            this.ctx.globalAlpha = alpha;
        }
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        x1 = Math.round(x1);
        x2 = Math.round(x2);
        y1 = Math.round(y1);
        y2 = Math.round(y2);
        if (dashed) {
            this.ctx.setLineDash([15, 5]);
        }
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        if (strokeWidth) {
            this.ctx.lineWidth = oldWidth;
        }
        if (alpha) {
            this.ctx.globalAlpha = 1;
        }
    }
    drawCircle (cx, cy, radius, lineWidth, fillColor, lineColor) {
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = fillColor;
        this.ctx.fill();
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = lineColor;
        this.ctx.stroke();
    }
    drawPolygon (arrayDot, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(arrayDot[0][0], arrayDot[1][0]);
        for (let i = 0; i < arrayDot[0].length - 1; i += 1) {
            this.ctx.lineTo(arrayDot[0][i], arrayDot[1][i]);
        }
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.fill();
    }
    drawCandleChart (shortBars, askBid, isExpired) {
        let diff = 0;
        _.forEach(shortBars, (bar, i) => {
            const startCandleX = Math.round(this.getXByBar(i) - (this.pxPerBar - 2) / 2) + 0.5;
            if (isExpired && startCandleX >= this.finishLineX) {
                diff++;
            }
        });
        const centerBar = shortBars[this.barsBeforeStart - 1];
        _.forEach(shortBars, (bar, i) => {
            this.drawCandle(centerBar, bar, this.getXByBar(i - diff), askBid);
        });
    }
    drawCandle (centerBar, currentBar, candleXCoord, askBid) {
        const candleYHighCoord = Math.round(this.getYByPrice(currentBar[askBid === 'closeAsk' ? 'highAsk' : 'highBid'])) + 0.5;
        const candleYLowCoord = Math.round(this.getYByPrice(currentBar[askBid === 'closeAsk' ? 'lowAsk' : 'lowBid'])) + 0.5;
        const candleYOpenCoord = Math.round(this.getYByPrice(currentBar[askBid === 'closeAsk' ? 'openAsk' : 'openBid'])) + 0.5;
        const candleYCloseCoordOffset = Math.round((currentBar[askBid === 'closeAsk' ? 'openAsk' : 'openBid'] - currentBar[askBid === 'closeAsk' ? 'closeAsk' : 'closeBid']) * this.scaleY);
        this.ctx.beginPath();
        this.ctx.moveTo(candleXCoord, candleYHighCoord);
        this.ctx.lineTo(candleXCoord, candleYLowCoord);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.closePath();
        const x1 = Math.round(candleXCoord - (this.pxPerBar - 2) / 2) + 0.5;
        const y1 = candleYOpenCoord;
        const x2 = this.pxPerBar - 4;
        const y2 = candleYCloseCoordOffset;
        this.ctx.beginPath();
        this.ctx.rect(x1, y1, x2, y2);
        if (currentBar[askBid === 'closeAsk' ? 'openAsk' : 'openBid'] > currentBar[askBid === 'closeAsk' ? 'closeAsk' : 'closeBid']) {
            this.ctx.fillStyle = this.colors.quote.down;
            this.ctx.strokeStyle = this.colors.quote.stroke.down;
        } else {
            this.ctx.fillStyle = this.colors.quote.up;
            this.ctx.strokeStyle = this.colors.quote.stroke.up;
        }
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }
    drawQuotationMark () {
        const gridHeight = this.gridCellHeight;
        const maxHeight = this.canvas.height - gridHeight;
        for (let i = gridHeight; i < this.canvas.height - gridHeight; i += gridHeight) {
            const quotationMark = Math.abs((((maxHeight - i) - this.centerHeight) - this.quoteBeforeStart * this.scaleY) / this.scaleY) / 1000000;
            const countBefore = (quotationMark.toString()).split('.')[0].length;
            let countAfter = (quotationMark.toString()).split('.')[1] ? (quotationMark.toString()).split('.')[1].length : countBefore;
            if (countBefore + countAfter > 6) {
                countAfter -= (countAfter + countBefore) - 6;
            }
            this.drawText(this.canvasWork.width + 10, maxHeight - i + 3, quotationMark.toFixed(countAfter), '13px sans-serif', 'black');
        }
    }
    drawQuotationLine (chartType, quote, quoteSettings, shortBars) {
        let color = null;
        const heightCoord = Math.round(this.getYByPrice(quote.price)) + 0.5;
        if (chartType === 'Line') {
            color = this.colors.quote[quote.state] || this.colors.quote['notUpdate'];
            this.drawLine(0, heightCoord, this.canvasWork.width, heightCoord, color, 1, 1);
            if (this.animatedCircle.classList.contains('invisible')) {
                this.animatedCircle.classList.remove('invisible');
            }
            const topPositionCircle = Math.abs(heightCoord - this.animatedCircle.offsetHeight / 2);
            const leftPositionCircle = Math.abs(this.getXByTimestamp(_.last(shortBars).time) - this.animatedCircle.offsetWidth / 2) + 1;
            this.animatedCircle.style.top = `${topPositionCircle}px`;
            this.animatedCircle.style.left = `${leftPositionCircle}px`;
        } else if (chartType === 'Candle') {
            const open = shortBars[shortBars.length - 1]['openAsk'];
            const close = shortBars[shortBars.length - 1][quote.askBid];
            if (open > close && quote.state) {
                color = this.colors.quote['down'];
            } else if (open < close && quote.state) {
                color = this.colors.quote['up'];
            } else if (!quote.state) {
                color = this.colors.quote['notUpdate'];
            }
            if (!this.animatedCircle.classList.contains('invisible')) {
                this.animatedCircle.classList.add('invisible');
            }
            this.drawLine(0, heightCoord, this.canvasWork.width, heightCoord, color, 1, 1);
        }
        const arrayDot = [
            [this.canvasWork.width - 0.5,
                this.canvasWork.width + 10.5,
                this.canvas.width - 1.5,
                this.canvas.width - 1.5,
                this.canvasWork.width + 10.5,
                this.canvasWork.width - 0.5],
            [heightCoord,
                heightCoord - 11,
                heightCoord - 11,
                heightCoord + 11,
                heightCoord + 11,
                heightCoord]
        ];
        this.drawPolygon(arrayDot, color);
        let rate;
        if (quoteSettings) {
            rate = ParsingPriceHelper.parseRate(quote.price / 1000000, quoteSettings.tickSize, quoteSettings.priceRounding / 1000000);
        }
        if (rate) {
            const dot = rate.dot === 0 ? '' : '.';
            const priceArray = [rate.small, dot + rate.big, rate.mid];
            let textPosition = this.canvasWork.width + 10;
            this.drawText(textPosition, heightCoord + 5, priceArray[0], '13px sans-serif', 'white');
            textPosition += this.ctx.measureText(priceArray[0]).width;
            this.drawText(textPosition, heightCoord + 5, priceArray[1], '16px sans-serif', 'white');
            textPosition += this.ctx.measureText(priceArray[1]).width;
            this.drawText(textPosition, heightCoord + 2, priceArray[2], '13px sans-serif', 'white');
        } else {
            const textPosition = this.canvasWork.width + 10;
            this.drawText(textPosition, heightCoord + 5, '-', '13px sans-serif', 'white');
        }
    }
    drawTimeMark (shortBars, times) {
        const startDate = this.firstBarTime;
        let date = null;
        let oldDate = moment(startDate);
        for (let i = 1; i <= Math.floor(this.canvasWork.width / this.pxPerBar); i += 1) {
            if (!(this.pxPerGrid < 40 && i % 2 === 0)) {
                const bar = shortBars[i * this.barsPerGrid];
                if (bar && !bar.quote) {
                    date = moment(bar.time);
                } else {
                    const deltaSeconds = (this.msecondsPerBar * this.barsPerGrid);
                    date = moment(oldDate + deltaSeconds);
                    if (date - (60 * 1000) > times.forecast) {
                        continue;
                    }
                }
                if (this.minutePerBar < MINUTE_PER_DAY) { // "Day": 60*24
                    if ((oldDate.toDate().getDay() !== date.toDate().getDay()) && (Math.abs(startDate - date) > this.msecondsPerBar)) {
                        this.drawText(i * this.pxPerGrid - 21, this.canvas.height - 7, date.format('DD MMM'), '13px sans-serif', 'black');
                    } else {
                        this.drawText(i * this.pxPerGrid - 18, this.canvas.height - 7, date.format('HH:mm'), '13px sans-serif', 'black');
                    }
                } else if ((oldDate.toDate().getYear() !== date.toDate().getYear()) && (Math.abs(startDate - date) > this.msecondsPerBar)) {
                    this.drawText(i * this.pxPerGrid - 18, this.canvas.height - 7, date.format('YYYY'), '13px sans-serif', 'black');
                } else {
                    this.drawText(i * this.pxPerGrid - 21, this.canvas.height - 7, date.format('DD MMM'), '13px sans-serif', 'black');
                }
                oldDate = date;
            }
        }
    }
    getXByBar = (barIndex) => {
        return barIndex * this.pxPerBar;
    };
    getXByMseconds = (mseconds) => {
        return (this.pxPerBar / (this.msecondsPerBar)) * mseconds;
    };
    getYByPrice = (price) => {
        return this.centerHeight + (this.quoteBeforeStart - price) * this.scaleY;
    };
    getXByTimestamp = (timestamp) => {
        return this.getXByMseconds(timestamp - this.firstBarTime);
    };
}

export default Chart;
