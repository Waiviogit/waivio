import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import {
  makePlatformUserStatisticsState,
  getPlatformAccountCurrencyState,
  getIsConnectPlatformState,
} from '../../../redux/selectors/platformSelectors';
import Balance from './Balance';

const propTypes = {
  balanceType: PropTypes.string.isRequired,
  platformConnect: PropTypes.bool.isRequired,
  userStatistics: PropTypes.number,
};

const defaultProps = {
  userStatistics: 0,
};

const BalanceContainer = props => <Balance {...props} />;

BalanceContainer.propTypes = propTypes;
BalanceContainer.defaultProps = defaultProps;

const mapState = () => {
  const getUserStatisticsState = makePlatformUserStatisticsState();
  return (state, ownProps) => {
    return {
      userStatistics: getUserStatisticsState(state, ownProps),
      platformConnect: getIsConnectPlatformState(state),
      accountCurrency: getPlatformAccountCurrencyState(state),
    };
  };
};

export default connect(mapState)(BalanceContainer);
