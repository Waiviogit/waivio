import { Button } from 'antd';
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './LongTermStatistics.less';
import { getQuotesState } from '../../../redux/selectors/quotesSelectors';
import { getFieldWithMaxWeight } from '../../../../client/object/wObjectHelper';
import { objectFields } from '../../../../common/constants/listOfFields';
import * as ApiClient from '../../../../waivioApi/ApiClient';
import { quoteIdForWidget } from '../../../constants/constantsWidgets';
import { getLongTermStatisticsFromWidgets } from '../../../helpers/diffDateTime';

@injectIntl
@withRouter
@connect(state => ({
  quotes: getQuotesState(state),
}))
class InstrumentLongTermStatistics extends React.Component {
  static propTypes = {
    wobject: PropTypes.shape().isRequired,
    withCompareButton: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    quotes: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    toggleModalPerformance: PropTypes.func,
  };

  static defaultProps = {
    withCompareButton: false,
    toggleModalPerformance: () => {},
  };
  constructor(props) {
    super(props);
    this.state = {
      longTermStatistics: {},
      longTermStatisticsWidgets: {},
      loading: true,
      chartId: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.wobject) && !_.isEmpty(nextProps.quotes)) {
      let chartId = this.state.chartId;
      if (!this.state.chartId) {
        chartId = getFieldWithMaxWeight(nextProps.wobject, objectFields.chartId);
        this.setState({ chartId });
      }
      const quote = nextProps.quotes[chartId];
      const id = quoteIdForWidget[chartId];

      if (chartId && quote && id) {
        let longTermStatistics = {};
        if (_.isEmpty(this.state.longTermStatisticsWidgets)) {
          ApiClient.getInstrumentLongTermStatistics(id).then(data => {
            if (data && !_.isError(data)) {
              const parsedData = _.attempt(JSON.parse, data);
              if (!_.isError(parsedData))
                longTermStatistics = getLongTermStatisticsFromWidgets(
                  parsedData,
                  nextProps.intl,
                  quote,
                );
              if (!_.isEmpty(longTermStatistics))
                this.setState({
                  longTermStatistics,
                  longTermStatisticsWidgets: parsedData,
                  loading: false,
                });
            }
          });
        } else {
          longTermStatistics = getLongTermStatisticsFromWidgets(
            this.state.longTermStatisticsWidgets,
            nextProps.intl,
            quote,
          );
          if (!_.isEmpty(longTermStatistics)) this.setState({ longTermStatistics, loading: false });
        }
      } else {this.setState({loading: false})}
    }
  }
  render() {
    return !this.state.loading ? (
      <div className="InstrumentLongTermStatistics">
        <div className="InstrumentLongTermStatistics__title">{`Performance`}</div>
        <div>
          {!_.isEmpty(this.state.longTermStatistics) ? (
            <React.Fragment>
              {_.map(this.state.longTermStatistics, period => (
                <div key={`${period.price}${period.label}`} className="PeriodStatisticsLine">
                  <div className="PeriodStatisticsLine__periodName">{period.label}</div>
                  <div
                    className={`PeriodStatisticsLine__value-${period.isUp ? 'success' : 'danger'}`}
                  >
                    {period.price}
                  </div>
                </div>
              ))}
              {this.props.withCompareButton && !this.props.isMobile && (
                <React.Fragment>
                  <Button className="button-compare" onClick={this.props.toggleModalPerformance}>
                    {this.props.intl.formatMessage({ id: 'compare', defaultMessage: 'Compare' })}
                  </Button>
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <div>{
              this.props.intl.formatMessage({
                id: 'unavailableStatisticsObject',
                defaultMessage: 'Long term statistics is unavailable for current instrument',
              })
            }</div>
          )}
        </div>
      </div>
    ) : (
      <div />
    );
  }
}

export default InstrumentLongTermStatistics;
