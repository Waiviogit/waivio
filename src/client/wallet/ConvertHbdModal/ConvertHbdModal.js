import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Cookie from 'js-cookie';
import { connect, useSelector } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import TokensSelect from '../SwapTokens/components/TokensSelect';
import USDDisplay from '../../components/Utils/USDDisplay';

import { getCryptosPriceHistory } from '../../../store/appStore/appSelectors';
import {
  getTokenFrom,
  getTokenTo,
  getVisibleConvertModal,
} from '../../../store/swapStore/swapSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
} from '../../../store/authStore/authSelectors';

import {
  changetTokens,
  getSwapList,
  resetModalData,
  setBothTokens,
  setFromToken,
  setToToken,
  toggleConvertHbdModal,
} from '../../../store/swapStore/swapActions';

import { getRatesList } from '../../../store/ratesStore/ratesSelector';
import '../SwapTokens/SwapTokens.less';

import api from '../../steemConnectAPI';
import { createQuery } from '../../../common/helpers/apiHelpers';
import './ConvertHbdModal.less';

const ConvertHbdModal = props => {
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [symbol, setSymbol] = useState(props.from?.symbol || props.from);
  const isFromHive = symbol === 'HIVE';
  const toSymbol = isFromHive ? 'HBD' : 'HIVE';
  const rates = useSelector(getRatesList);
  const hiveAuth = Cookie.get('auth');

  const rate = isFromHive ? props.hiveRateInUsd : props.hbdRateInUsd;
  const insufficientFunds = amount => parseFloat(+props.user?.balance) < +amount;

  const handleSwap = () => {
    props.toggleConvertHbdModal(false);
    const query = {
      owner: props.user.name,
      requestid: Date.now(),
      amount: `${Number(fromAmount)?.toFixed(3)} ${symbol}`,
    };
    const op = isFromHive ? 'collateralized_convert' : 'convert';
    const swapOp = [op, query];

    if (hiveAuth) {
      const brodc = () => api.broadcast([swapOp], null, 'active');

      brodc();
    } else {
      window &&
        window.open(
          `https://hivesigner.com/sign/collateralized_convert?${createQuery(query)}`,
          '_blank',
        );
    }
  };

  const handleCloseModal = () => {
    props.toggleConvertHbdModal(false);
  };

  const handleChangeFromValue = value => {
    setFromAmount(value);

    setToAmount(((value * rate) / rates[toSymbol]).toFixed(2));
  };

  const estimateValue = fromAmount * rate;
  const handleClickBalanceFrom = value => handleChangeFromValue(value);
  const balanceHive = parseFloat(props.user.balance);
  const balanceHbd = parseFloat(props.user.hbd_balance);
  const tokenFrom = {
    balance: isFromHive ? balanceHive : balanceHbd || 0,
    symbol: isFromHive ? 'HIVE' : 'HBD',
  };
  const tokenTo = {
    balance: isFromHive ? balanceHbd : balanceHive || 0,
    symbol: isFromHive ? 'HBD' : 'HIVE',
  };

  const immediatelyPaidVal = ((fromAmount / 2) * rate - (fromAmount / 2) * rate * 0.05).toFixed(2);
  const hiveEstimated = (fromAmount / rates[toSymbol]).toFixed(2);
  const tokensList = [tokenFrom, tokenTo];

  return (
    <Modal
      title={props.intl.formatMessage({
        id: 'convert_hive_to_hbd',
        defaultMessage: 'Convert HIVE to HBD',
      })}
      visible={props.visible}
      onOk={handleSwap}
      onCancel={handleCloseModal}
      okButtonProps={{
        disabled: !fromAmount || !toAmount || insufficientFunds(fromAmount),
        // loading: waiting,
      }}
      okText={props.intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}
      wrapClassName="SwapTokens__wrapper"
    >
      <Form className="SwapTokens ConvertHbdModal">
        <p>
          The conversion works like this: Each HBD is exchanged for $1 USD worth of HIVE, based on
          the 3.5-day median price from Hive witnesses. After 3.5 days, the newly created HIVE is
          delivered. Since this isn&apos;t a market trade, there are no limits on volume or price
          impact on HIVE or HBD.
        </p>
        <br />
        <h3 className="SwapTokens__title">
          <FormattedMessage id="from" defaultMessage="From" />:
        </h3>
        <TokensSelect
          list={tokensList}
          setToken={token => {
            setSymbol(token.symbol);
            props.setFromToken(token.symbol, tokensList);
          }}
          amount={fromAmount}
          handleChangeValue={handleChangeFromValue}
          token={tokenFrom}
          handleClickBalance={handleClickBalanceFrom}
          isError={insufficientFunds(fromAmount)}
          // isLoading={isLoading}
          disabled={false}
        />
        <br />
        <h3 className="SwapTokens__title">
          <FormattedMessage id="to" defaultMessage="To" />:
        </h3>
        <TokensSelect
          list={props.swapListTo}
          disabled
          amount={toAmount}
          token={tokenTo}
          hideMax
          hideBalance
        />
        <div className="SwapTokens__estimatedWrap">
          <p>
            <FormattedMessage
              id="estimated_transaction_value"
              defaultMessage="Estimated transaction value"
            />
            : <USDDisplay value={estimateValue} />
          </p>
        </div>{' '}
        <div className="SwapTokens__estimatedWrap">
          <p>
            {isFromHive ? (
              <>
                HBD to be paid immediately: {immediatelyPaidVal} {toSymbol}
              </>
            ) : (
              <>
                Estimated HIVE amount: {hiveEstimated} {toSymbol}{' '}
              </>
            )}
          </p>
        </div>
        <p className="SwapTokens__hiveEngineInfo">
          Click the button below to be redirected to HiveSigner to complete your transaction.
        </p>
      </Form>
    </Modal>
  );
};

ConvertHbdModal.propTypes = {
  intl: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired,
  from: PropTypes.shape(),
  toggleConvertHbdModal: PropTypes.func.isRequired,
  setFromToken: PropTypes.func.isRequired,
  swapListTo: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  hiveRateInUsd: PropTypes.number.isRequired,
  hbdRateInUsd: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
};

ConvertHbdModal.defaultProps = {
  isRebalance: false,
};

export default connect(
  state => {
    const cryptosPriceHistory = getCryptosPriceHistory(state);

    return {
      user: getAuthenticatedUser(state),
      to: getTokenTo(state),
      from: getTokenFrom(state),
      hiveRateInUsd: get(cryptosPriceHistory, 'hive.usdPriceHistory.usd', null),
      hbdRateInUsd: get(cryptosPriceHistory, 'hive_dollar.usdPriceHistory.usd', null),

      authUser: getAuthenticatedUserName(state),
      visible: getVisibleConvertModal(state),
    };
  },
  {
    getSwapList,
    setFromToken,
    setToToken,
    toggleConvertHbdModal,
    resetModalData,
    changetTokens,
    setBothTokens,
  },
)(injectIntl(ConvertHbdModal));
