import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { getHiveEngineStatus } from '../../../store/walletStore/walletActions';
import WalletSummaryInfo from '../WalletSummaryInfo/WalletSummaryInfo';
import Loading from '../../components/Icon/Loading';
import {
  getHiveEngineDelayInfo,
  getSwapTokensBalanceList,
  getTokensBalanceList,
} from '../../../store/walletStore/walletSelectors';
import HiveEngineCurrencyItem from './HiveEngineCurrencyItem/HiveEngineCurrencyItem';
import { HIVE_ENGINE_DEFAULT_SWAP_LIST } from '../../../common/constants/swapList';
import { getRatesList } from '../../../store/ratesStore/ratesSelector';

import './HiveEngineSummaryInfo.less';

const HiveEngineSummaryInfo = props => {
  useEffect(() => {
    props.getHiveEngineStatus();
  }, []);
  const status = get(props.hiveEngineDelayInfo, 'status', 'OK');
  const hiveEngineStatusClassList = classNames(
    'HiveEngineSummaryInfo__hive-engine-blockchain-status',
    {
      'HiveEngineSummaryInfo__hive-engine-blockchain-status--green': status === 'OK',
      'HiveEngineSummaryInfo__hive-engine-blockchain-status--red': status !== 'OK',
    },
  );
  const combinedList = !isEmpty(props.tokensList)
    ? [...props.swapList, ...props.tokensList]
    : props.swapList;

  if (isEmpty(combinedList)) return <Loading />;
  const estAccValue = combinedList.reduce((acc, curr) => {
    const stake = curr.stake || 0;

    const balanceInUsd = HIVE_ENGINE_DEFAULT_SWAP_LIST.includes(curr.symbol)
      ? (Number(curr.balance) + Number(stake)) * props?.rates?.[curr.symbol]
      : (Number(curr.balance) + Number(stake)) * props?.rates?.[curr.symbol] * props.rates.HIVE;

    return acc + balanceInUsd;
  }, 0);

  return (
    <div>
      <div className="HiveEngineSummaryInfo__margin">
        <div className="HiveEngineSummaryInfo__hive-engine-blockchain-status">
          <FormattedMessage
            id="hive_engine_blockchain_status"
            defaultMessage="Hive Engine blockchain status:"
          />
          <div className={hiveEngineStatusClassList}>
            {' '}
            {status === 'OK' ? (
              <FormattedMessage id="up_to_date" defaultMessage="Up-to-date" />
            ) : (
              <FormattedMessage
                id="delay_by_blocks"
                values={{
                  delay: get(props.hiveEngineDelayInfo, 'delay', 0),
                }}
                defaultMessage="Delay by {delay} blocks"
              />
            )}{' '}
          </div>
        </div>
      </div>
      <WalletSummaryInfo estAccValue={estAccValue}>
        {combinedList.map(token => (
          <HiveEngineCurrencyItem key={token.symbol} token={token} rates={props.rates} />
        ))}
      </WalletSummaryInfo>
    </div>
  );
};

HiveEngineSummaryInfo.propTypes = {
  currencyInfo: PropTypes.shape({}).isRequired,
  rates: PropTypes.shape({
    HIVE: PropTypes.number,
  }).isRequired,
  hiveEngineDelayInfo: PropTypes.shape({
    status: PropTypes.string,
    delay: PropTypes.number,
  }).isRequired,
  tokensList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  swapList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  getHiveEngineStatus: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    tokensList: getTokensBalanceList(state),
    swapList: getSwapTokensBalanceList(state),
    rates: getRatesList(state),
    hiveEngineDelayInfo: getHiveEngineDelayInfo(state),
  }),
  { getHiveEngineStatus },
)(HiveEngineSummaryInfo);
