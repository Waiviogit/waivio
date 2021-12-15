import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import WalletSummaryInfo from '../WalletSummaryInfo/WalletSummaryInfo';
import Loading from '../../components/Icon/Loading';
import {
  getCurrUserTokensBalanceList,
  resetTokenBalance,
} from '../../../store/walletStore/walletActions';
import { getTokensBalanceList } from '../../../store/walletStore/walletSelectors';
import { getCryptosPriceHistory } from '../../../store/appStore/appSelectors';
import HiveEngineCurrencyItem from './HiveEngineCurrencyItem/HiveEngineCurrencyItem';

const HiveEngineSummaryInfo = props => {
  const params = useParams();

  useEffect(() => {
    props.getCurrUserTokensBalanceList(params.name);
  }, []);

  if (isEmpty(props.tokensList)) return <Loading />;
  const estAccValue = props.tokensList.reduce((acc, curr) => {
    const balanceInUsd = curr.balance * curr.rate * props.hiveRate;

    return acc + balanceInUsd;
  }, 0);

  return (
    <WalletSummaryInfo estAccValue={estAccValue}>
      {props.tokensList.map(token => (
        <HiveEngineCurrencyItem key={token.symbol} token={token} hiveRate={props.hiveRate} />
      ))}
    </WalletSummaryInfo>
  );
};

HiveEngineSummaryInfo.propTypes = {
  currencyInfo: PropTypes.shape({}).isRequired,
  tokensList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  hiveRate: PropTypes.number.isRequired,
  getCurrUserTokensBalanceList: PropTypes.func.isRequired,
};

export default connect(
  state => {
    const cryptosPriceHistory = getCryptosPriceHistory(state);

    return {
      tokensList: getTokensBalanceList(state),
      hiveRate: get(cryptosPriceHistory, 'hive.usdPriceHistory.usd', null),
    };
  },
  {
    resetTokenBalance,
    getCurrUserTokensBalanceList,
  },
)(HiveEngineSummaryInfo);
