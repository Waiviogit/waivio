import { Button } from 'antd';
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { getLongTermStatisticsForUser } from '../../../helpers/diffDateTime';
import { makeCancelable } from '../../../../client/helpers/stateHelpers';
import './LongTermStatistics.less';

@injectIntl
class LongTermStatistics extends React.Component {
  static propTypes = {
    /* from decorator */
    intl: PropTypes.shape().isRequired,
    isMobile: PropTypes.bool,
    /* passed props */
    children: PropTypes.oneOfType(),
    itemId: PropTypes.string.isRequired, // username or object permlink
    withCompareButton: PropTypes.bool,
    fetcher: PropTypes.func.isRequired,
    toggleModalPerformance: PropTypes.func,
  };

  static defaultProps = {
    children: '',
    withCompareButton: false,
    isMobile: false,
    toggleModalPerformance: () => {},
    fetcher: () => {},
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

  cancelablePromise = makeCancelable(this.props.fetcher(this.props.itemId));

  render() {
    const { intl, isMobile, toggleModalPerformance, withCompareButton } = this.props;
    return !this.state.loading ? (
      <div className="InstrumentLongTermStatistics SidebarContentBlock">
        <div className="SidebarContentBlock__title">
          {intl.formatMessage({ id: 'performance', defaultMessage: `Performance` })}
        </div>
        <div className="SidebarContentBlock__content">
          {!_.isEmpty(this.state.longTermStatistics) ? (
            <React.Fragment>
              {_.map(this.state.longTermStatistics, period => (
                <div className="PeriodStatisticsLine" key={`${period.price}${period.label}`}>
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
            this.props.children
          )}
        </div>
      </div>
    ) : (
      <div />
    );
  }
}

export default LongTermStatistics;
