import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Cookie from 'js-cookie';
import { connect, useSelector } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import TokensSelect from './SwapTokens/components/TokensSelect';
import USDDisplay from '../components/Utils/USDDisplay';

import { getCryptosPriceHistory } from '../../store/appStore/appSelectors';
import {
  getTokenFrom,
  getTokenTo,
  getVisibleConvertModal,
} from '../../store/swapStore/swapSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
} from '../../store/authStore/authSelectors';

import {
  changetTokens,
  getSwapList,
  resetModalData,
  setBothTokens,
  setFromToken,
  setToToken,
  toggleConvertHbdModal,
} from '../../store/swapStore/swapActions';

import { getRatesList } from '../../store/ratesStore/ratesSelector';
import '../wallet/SwapTokens/SwapTokens.less';

import api from '../steemConnectAPI';
import { createQuery } from '../../common/helpers/apiHelpers';

const ConvertHbdModal = props => {
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const rates = useSelector(getRatesList);
  const hiveAuth = Cookie.get('auth');
  const insufficientFunds = amount => parseFloat(+props.user?.balance) < +amount;

  const handleSwap = () => {
    const query = {
      owner: props.user.name,
      requestid: Date.now(),
      amount: `${Number(fromAmount)?.toFixed(3)} HIVE`,
    };
    const swapOp = ['collateralized_convert', query];

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

    setToAmount(((value * props.hiveRateInUsd) / rates.HBD).toFixed(2));
  };

  const estimateValue = fromAmount * props.hiveRateInUsd;
  const handleClickBalanceFrom = value => handleChangeFromValue(value);

  const tokenFrom = { balance: parseFloat(props.user.balance) || 0, symbol: props.from.symbol };
  const tokenTo = { balance: parseFloat(props.user.hbd_balance) || 0, symbol: props.to.symbol };

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
      <Form className="SwapTokens">
        <p>
          The conversion system works as follows: HIVE is provided as collateral, granting an
          upfront issuance of HBD equivalent to half of the collateral amount, minus a 5% fee. The
          final transaction is completed in 3.5 days, at which time the remaining HIVE is returned.
        </p>
        <br />
        <h3 className="SwapTokens__title">
          <FormattedMessage id="from" defaultMessage="From" />:
        </h3>
        <TokensSelect
          list={props.swapListFrom}
          // setToken={token => {
          //   props.setFromToken(token);
          //   setToAmount(0);
          // }}
          amount={fromAmount}
          handleChangeValue={handleChangeFromValue}
          token={tokenFrom}
          handleClickBalance={handleClickBalanceFrom}
          isError={insufficientFunds(fromAmount)}
          // isLoading={isLoading}
        />
        <br />
        <h3 className="SwapTokens__title">
          <FormattedMessage id="to" defaultMessage="To" />:
        </h3>
        <TokensSelect
          list={props.swapListTo}
          // setToken={handleSetToToken}
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

  toggleConvertHbdModal: PropTypes.func.isRequired,
  swapListFrom: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  swapListTo: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  from: PropTypes.shape().isRequired,
  to: PropTypes.shape().isRequired,
  hiveRateInUsd: PropTypes.number.isRequired,
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
