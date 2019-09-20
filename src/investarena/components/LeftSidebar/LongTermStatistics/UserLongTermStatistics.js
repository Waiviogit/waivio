import { Button } from 'antd';
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import api from '../../../../investarena/configApi/apiResources';
import { getLongTermStatisticsForUser } from '../../../helpers/diffDateTime';
import { makeCancelable } from "../../../../client/helpers/stateHelpers";
import './LongTermStatistics.less';

@injectIntl
class UserLongTermStatistics extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    isMobile: PropTypes.bool,
    userName: PropTypes.string.isRequired,
    withCompareButton: PropTypes.bool,
    toggleModalPerformance: PropTypes.func,
  };

  static defaultProps = {
    withCompareButton: false,
    isMobile: false,
    toggleModalPerformance: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      longTermStatistics: {},
      loading: true,
    };
  }

  componentDidMount() {
    this.cancelablePromise.promise.then(data => {
      if (data && !_.isError(data) && !_.isEmpty(data)) {
        const longTermStatistics = getLongTermStatisticsForUser(data, this.props.intl);
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
    api.performers.getUserStatistics(this.props.userName),
  );

  render() {
    return !this.state.loading ? (
      <div className="InstrumentLongTermStatistics">
        <div className="InstrumentLongTermStatistics__title">{`Performance`}</div>
        <div>
          {!_.isEmpty(this.state.longTermStatistics) ? (
            <React.Fragment>
              {_.map(this.state.longTermStatistics, period => (
                <div className="PeriodStatisticsLine" key={`${period.price}${period.label}`}>
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
            <div>
              {this.props.intl.formatMessage({
                id: 'unavailableStatisticsUser',
                defaultMessage: 'The user has not written any posts with forecasts',
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

export default UserLongTermStatistics;
