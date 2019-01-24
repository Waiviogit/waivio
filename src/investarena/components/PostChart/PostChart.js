import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import './PostChart.less';
import { optionsChartType, optionsPrice } from '../../constants/selectData';
import { CanvasHelper } from '../../helpers/canvasHelper';
import Chart from './chart/chart';
import ChartData from './chart/chartData';
import { currentTime } from '../../helpers/currentTime';
import TabSelect from './TabSelect';
import quoteData from "../../default/quoteData";
import quoteSettingsData from "../../default/quoteSettingsData";

const propTypes = {
    bars: PropTypes.object,
    platformName: PropTypes.string,
    connect: PropTypes.bool,
    isObjectProfile: PropTypes.bool,
    quote: PropTypes.object,
    expiredBars: PropTypes.array,
    slPrice: PropTypes.string,
    tpPrice: PropTypes.string,
    expiredAt: PropTypes.string,
    quoteSettings: PropTypes.object,
    expiredTimeScale: PropTypes.string,
    toggleModalPost: PropTypes.func.isRequired,
    quoteSecurity: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    createdAt: PropTypes.string.isRequired,
    forecast: PropTypes.string.isRequired,
    recommend: PropTypes.string.isRequired,
    getChartData: PropTypes.func.isRequired
};
const defaultProps = {
  platformName: 'widgets',
  quote: quoteData,
  quoteSettings: quoteSettingsData,
  isObjectProfile: false,
};
class PostChart extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            timeScale: CanvasHelper.getTimeScale(this.props.createdAt, this.props.forecast),
            chartType: 'Line',
            priceType: this.props.recommend,
            expired: !!this.props.expiredAt || this.isExpiredByTime(),
            disabledSelect: false,
            isSession: this.props.platformName === 'widgets'
                ? this.props.quote.isSession
                : this.props.quoteSettings.isSession
        };
    }
    componentDidMount () {
        const parentSize = this.canvasRef.parentElement.getBoundingClientRect();
        this.canvasRef.width = parentSize.width;
        this.canvasRef.height = parentSize.height;
        if (this.canvasRef.width > 0 && this.canvasRef.height > 0) {
            this.chartData = this.createChartData();
            this.chart = this.createChart();
            this.chartData.onUpdate(this.chart.drawChart);
            if (this.state.expired) {
                this.setState({
                    timeScale: this.props.expiredTimeScale || this.state.timeScale
                }, () => this.updateChartData(this.props));
            } else if (this.props.connect) {
                if (this.props.quote && this.props.bars && this.props.bars[this.state.timeScale]) {
                    this.updateChartData(this.props);
                } else {
                    this.props.getChartData(this.state.timeScale);
                }
            }
        }
    }
    componentWillReceiveProps (nextProps) {
        if (!this.state.expired && this.chartData && this.chart) {
            if (nextProps.expiredBars && nextProps.expiredAt) {
                this.setState({
                    expired: true,
                    timeScale: nextProps.expiredTimeScale || this.state.timeScale
                }, () => this.updateChartData(nextProps));
            } else if (nextProps.connect) {
                if (!nextProps.bars || !nextProps.bars[this.state.timeScale]) {
                    this.props.getChartData(this.state.timeScale);
                } else if (nextProps.bars && nextProps.bars[this.state.timeScale] && nextProps.quote) {
                    if (this.props.connect && this.state.isSession && this.shouldGetChartData(nextProps.bars)) {
                        this.props.getChartData(this.state.timeScale);
                    } else if (this.isExpiredByTime()) {
                        const expiredProps = {
                            ...nextProps,
                            expiredByTime: true,
                            expiredBars: nextProps.expiredBars || nextProps.bars
                        };
                        this.setState({
                            expired: true
                        }, () => this.updateChartData(expiredProps));
                    } else {
                        this.updateChartData(nextProps);
                    }
                }
            }
        }
    }
    isExpiredByTime = () => currentTime.getTime() > (moment(this.props.forecast).valueOf());
    createChartData = () => new ChartData({
            createdAt: this.props.createdAt,
            forecast: this.props.forecast,
            quoteSecurity: this.props.quoteSecurity,
            locale: this.props.intl.locale,
            canvas: this.canvasRef,
            slPrice: this.props.slPrice,
            tpPrice: this.props.tpPrice,
            recommend: this.props.recommend
        });
    updateChartData = (props) => {
        const notEnoughData = this.chartData.updateData({
            isScaleChanged: !!this.props.expiredTimeScale,
            timeScale: this.state.timeScale,
            data: this.state.expired ? props.expiredBars : props.bars,
            quote: props.quote,
            expiredAt: props.expiredAt,
            quoteSettings: props.quoteSettings,
            expiredByTime: props.expiredByTime,
            chartType: this.state.chartType,
            priceType: this.state.priceType,
            isExpired: this.state.expired
        });
        this.setState({ disabledSelect: notEnoughData, isLoading: false });
    };
    createChart = () => new Chart({
            canvas: this.canvasRef,
            animatedCircle: this.circleRef,
            isObjectProfile: this.props.isObjectProfile
        });
    shouldGetChartData = (bars) => {
        const timeNow = currentTime.getTime();
        let lastTime = _.last(bars[this.state.timeScale]).time;
        const coefficient = 1000 * 60 * CanvasHelper.hours[this.state.timeScale];
        if (((timeNow - lastTime) - coefficient) > coefficient && timeNow - lastTime > coefficient) {
            lastTime += coefficient * Math.floor((timeNow - lastTime) / coefficient);
        }
        const timeDiff = (timeNow - lastTime) / 1000 / 60;
        const maxDiff = CanvasHelper.hours[this.state.timeScale];
        return timeDiff > maxDiff;
    };
    updateChartType = (newValue) => {
        this.setState({ chartType: newValue.value }, () => this.updateChartData(this.props));
    };
    updatePriceType = (newValue) => {
        this.setState({ priceType: newValue.value }, () => this.updateChartData(this.props));
    };
    updateTimeScaleType = (newValue) => {
        this.props.getChartData(newValue.value);
        this.setState({ timeScale: newValue.value, isLoading: true });
        this.updateChartData(this.props);
    };
    render () {
        let classNameCircle = '';
        if (!this.state.isLoading && !this.state.expired && !this.state.disabledSelect) {
            classNameCircle = !this.state.isSession ? 'st-chart-circle-not-session' : 'st-chart-circle-session';
        }
        const { chartType, timeScale, priceType } = this.state;
        const { createdAt, forecast } = this.props;
        return (
            <div className="w-100">
                <div className="st-chart-select">
                    <TabSelect data={optionsChartType} className="st-chart-tab-select" defaultValue={chartType} onSelect={this.updateChartType}/>
                    <TabSelect data={optionsPrice} className="st-chart-tab-select" defaultValue={priceType} onSelect={this.updatePriceType}/>
                    {this.props.tpPrice &&
                    <div className="st-post-price-select take-profit">
                        TP: {this.props.tpPrice.slice(0, 6)}
                    </div>}
                    {this.props.slPrice &&
                    <div className="st-post-price-select stop-loss">
                        SL: {this.props.slPrice.slice(0, 6)}
                    </div>}
                </div>
                <div className="st-post-chart-wrap">
                    {this.state.isLoading && !this.state.expired && <div className="spinner"/>}
                    <div className="st-post-chart-block">
                        <div className={`st-chart-circle ${classNameCircle} invisible`} ref={(div) => { this.circleRef = div }}/>
                        <canvas dir="ltr" className="st-canvas" ref={(canvas) => { this.canvasRef = canvas }} onClick={this.props.toggleModalPost}/>
                    </div>
                </div>
                <TabSelect
                    data={CanvasHelper.getTimeScaleOptions(createdAt, forecast)}
                    disable={this.state.expired}
                    defaultValue={timeScale}
                    position="bottom"
                    className="st-chart-tab-select time"
                    onSelect={this.updateTimeScaleType}
                />
            </div>
        );
    }
}

PostChart.propTypes = propTypes;
PostChart.defaultProps = defaultProps;

export default injectIntl(PostChart);
