import React from 'react';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import WalletSummaryInfo from '../WalletSummaryInfo/WalletSummaryInfo';
import Loading from '../../components/Icon/Loading';
import {
  getSwapTokensBalanceList,
  getTokensBalanceList,
} from '../../../store/walletStore/walletSelectors';
import { getCryptosPriceHistory } from '../../../store/appStore/appSelectors';
import HiveEngineCurrencyItem from './HiveEngineCurrencyItem/HiveEngineCurrencyItem';
import './HiveEngineSummaryInfo.less';

const HiveEngineSummaryInfo = props => {
  const combinedList = !isEmpty(props.tokensList)
    ? [...props.swapList, ...props.tokensList]
    : props.swapList;

  if (isEmpty(combinedList)) return <Loading />;

  const estAccValue = combinedList.reduce((acc, curr) => {
    const stake = curr.stake || 0;
    const balanceInUsd = (Number(curr.balance) + Number(stake)) * curr.rate * props.hiveRate;

    return acc + balanceInUsd;
  }, 0);

  return (
    <div>
      <div className="HiveEngineSummaryInfo__hive-engine-blockchain-status">
        <FormattedMessage
          id="hive_engine_blockchain_status"
          defaultMessage="HIVE Engine blockchain status:"
        />
        <div className="HiveEngineSummaryInfo__hive-engine-blockchain-status-green">
          {' '}
          Up-to-date{' '}
        </div>
      </div>
      <WalletSummaryInfo estAccValue={estAccValue}>
        {combinedList.map(token => (
          <HiveEngineCurrencyItem key={token.symbol} token={token} hiveRate={props.hiveRate} />
        ))}
      </WalletSummaryInfo>
    </div>
  );
};

HiveEngineSummaryInfo.propTypes = {
  currencyInfo: PropTypes.shape({}).isRequired,
  tokensList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  swapList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  hiveRate: PropTypes.number.isRequired,
};

export default connect(state => {
  const cryptosPriceHistory = getCryptosPriceHistory(state);

  return {
    tokensList: getTokensBalanceList(state),
    hiveRate: get(cryptosPriceHistory, 'hive.usdPriceHistory.usd', null),
    swapList: getSwapTokensBalanceList(state),
  };
})(HiveEngineSummaryInfo);
