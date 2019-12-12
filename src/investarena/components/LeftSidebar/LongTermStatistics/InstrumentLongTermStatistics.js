import { Button } from 'antd';
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import './LongTermStatistics.less';
import api from '../../../../investarena/configApi/apiResources';
import { getLongTermStatisticsForUser } from '../../../helpers/diffDateTime';
import { makeCancelable } from '../../../../client/helpers/stateHelpers';

@injectIntl
@withRouter
class InstrumentLongTermStatistics extends React.Component {
  static propTypes = {
    wobject: PropTypes.shape().isRequired,
    withCompareButton: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    intl: PropTypes.shape().isRequired,
    toggleModalPerformance: PropTypes.func.isRequired,
  };

  static defaultProps = {
    withCompareButton: false,
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

  componentDidMount() {
    this.cancelablePromise.promise.then(data => {
      if (!_.isEmpty(data) && !_.isError(data)) {
        const longTermStatistics = getLongTermStatisticsForUser(data);
        this.setState({ longTermStatistics, loading: false });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  componentWillUnmount() {
    this.cancelablePromise.cancel();
  }

  cancelablePromise = makeCancelable(
    api.performers.getInstrumentStatistics(this.props.wobject.author_permlink),
  );

  render() {
    const { intl, isMobile, toggleModalPerformance, withCompareButton } = this.props;
    return !this.state.loading ? (
      <div className="InstrumentLongTermStatistics">
        <div className="InstrumentLongTermStatistics__title">
          {intl.formatMessage({ id: 'performance', defaultMessage: `Performance` })}
        </div>
        <div>
          {!_.isEmpty(this.state.longTermStatistics) ? (
            <React.Fragment>
              {_.map(this.state.longTermStatistics, period => (
                <div key={`${period.price}${period.label}`} className="PeriodStatisticsLine">
                  <div className="PeriodStatisticsLine__periodName">
                    {intl.formatMessage({ id: period.intlId, defaultMessage: period.label })}
                  </div>
                  <div
                    className={`PeriodStatisticsLine__value-${period.isUp ? 'success' : 'danger'}`}
                  >
                    {period.price}
                  </div>
                </div>
              ))}
              {withCompareButton && !isMobile && (
                <React.Fragment>
                  <Button className="button-compare" onClick={toggleModalPerformance}>
                    {intl.formatMessage({ id: 'compare', defaultMessage: 'Compare' })}
                  </Button>
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <div>
              {intl.formatMessage({
                id: 'unavailableStatisticsObject',
                defaultMessage: 'Long term statistics is unavailable for current instrument',
              })}
            </div>
          )}
        </div>
      </div>
    ) : (
      <div />
    );
  }
}

export default InstrumentLongTermStatistics;
