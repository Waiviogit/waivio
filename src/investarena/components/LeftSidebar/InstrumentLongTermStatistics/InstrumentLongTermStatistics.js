import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './InstrumentLongTermStatistics.less';
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
    quotes: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      longTermStatistics: {},
      longTermStatisticsWidgets: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.wobject) && !_.isEmpty(nextProps.quotes)) {
      const chartId = getFieldWithMaxWeight(nextProps.wobject, objectFields.chartId);
      const quote = nextProps.quotes[chartId];
      if (chartId && quote) {
        let longTermStatistics = {};
        if (_.isEmpty(this.state.longTermStatisticsWidgets)) {
          ApiClient.getInstrumentLongTermStatistics(quoteIdForWidget[chartId]).then(data => {
            if (data && !_.isError(data)) {
              const parsedData = _.attempt(JSON.parse, data);
              if (!_.isError(parsedData))
                longTermStatistics = getLongTermStatisticsFromWidgets(
                  parsedData,
                  nextProps.intl,
                  quote,
                );
              if (!_.isEmpty(longTermStatistics))
                this.setState({ longTermStatistics, longTermStatisticsWidgets: parsedData });
            }
          });
        } else {
          longTermStatistics = getLongTermStatisticsFromWidgets(
            this.state.longTermStatisticsWidgets,
            nextProps.intl,
            quote,
          );
          if (!_.isEmpty(longTermStatistics)) this.setState({ longTermStatistics });
        }
      }
    }
  }
  render() {
    return (
      <div className="InstrumentLongTermStatistics">
        <div className="InstrumentLongTermStatistics__title">{`Performance`}</div>
        <div>
          {_.map(this.state.longTermStatistics, period => (
            <div className="PeriodStatisticsLine">
              <div className="PeriodStatisticsLine__periodName">{period.label}</div>
              <div className={`PeriodStatisticsLine__value-${period.isUp ? 'success' : 'danger'}`}>
                {period.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default InstrumentLongTermStatistics;
