import React, { useLayoutEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Modal, Radio } from 'antd';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  getSwapList,
  resetModalData,
  setFromToken,
  setToToken,
  toggleModal,
} from '../../../store/swapStore/swapActions';
import {
  getSwapListFrom,
  getSwapListFromStore,
  getSwapListTo,
  getTokenFrom,
  getTokenTo,
  getVisibleModal,
} from '../../../store/swapStore/swapSelectors';
import USDDisplay from '../../components/Utils/USDDisplay';
import { swapImpactPercent } from '../../../common/constants/swapList';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getCryptosPriceHistory } from '../../../store/appStore/appSelectors';
import { getSwapOutput } from '../../../common/helpers/swapTokenHelpers';
import { createQuery } from '../../../common/helpers/apiHelpers';
import TokensSelect from './components/TokensSelect';
import { getImpact } from '../../../common/helpers/swapWalletHelpers';

import './SwapTokens.less';
import { getFeeInfo } from '../../../waivioApi/ApiClient';

const SwapTokens = props => {
  const [impact, setImpact] = useState(0);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [param, setParams] = useState(0);

  const setFeeInfo = async () => {
    const data = await getFeeInfo();

    setParams(data);
  };

  useLayoutEffect(() => {
    setFeeInfo();
    props.getSwapList();

    return () => props.resetModalData();
  }, []);

  const insufficientFunds = amount => props.from.balance < amount;
  const inputWrapClassList = classNames('SwapTokens__inputWrap', {
    'SwapTokens__inputWrap--error': insufficientFunds(fromAmount),
  });

  const calculateOutputInfo = (value = 0, from, to, isFrom) => {
    const pool = from.tokenPair ? from : to;

    if (!pool.tokenPair) return {};

    const swap = pool.tokenPair.split(':')[0];

    return getSwapOutput({
      symbol: from.symbol,
      amountIn: value || 0,
      pool: {
        ...pool,
        tokenPair: `${swap}:${swap === from.symbol ? to.symbol : from.symbol}`,
      },
      slippage: 0,
      from: isFrom,
      params: param,
    });
  };

  const calculationImpact = calculateOutputInfo(toAmount, props.to, props.from, true).priceImpact;

  const handelChangeOrderToken = () => {
    if (!isEmpty(props.to) && !isEmpty(props.from)) {
      const amount = calculateOutputInfo(toAmount, props.to, props.from, true);

      props.setFromToken(props.to);
      props.setToToken(props.from);
      setFromAmount(toAmount);
      setToAmount(amount.amountOut);
    }
  };

  const handleChangeFromValue = value => {
    setFromAmount(value);

    if (!isEmpty(props.to)) {
      const amount = calculateOutputInfo(value, props.from, props.to, true);

      setImpact(amount.priceImpact);
      setToAmount(amount.amountOut);
    }
  };

  const handleChangeToValue = value => {
    setToAmount(value);

    if (!isEmpty(props.from)) {
      const amount = calculateOutputInfo(value, props.to, props.from);

      setImpact(amount.priceImpact);
      setFromAmount(amount.amountOut);
    }
  };

  const handleCloseModal = () => props.toggleModal(false);

  const handleClickBalanceFrom = value => handleChangeFromValue(value);

  const handleClickBalanceTo = value => handleChangeToValue(value);

  const handleSwap = () => {
    const swapInfo = calculateOutputInfo(fromAmount, props.from, props.to, true);

    const win = window.open(
      `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${
        props.authUser
      }"]&required_posting_auths=[]&${createQuery({
        id: 'ssc-mainnet-hive',
        json: get(swapInfo, 'json'),
      })}`,
      '_blank',
    );

    win.focus();
    handleCloseModal();
  };

  return (
    <Modal
      title="Swap tokens"
      visible={props.visible}
      onOk={handleSwap}
      onCancel={handleCloseModal}
      okButtonProps={{ disabled: !fromAmount || !toAmount || insufficientFunds(fromAmount) }}
      okText={'Submit'}
    >
      <Form className="SwapTokens">
        <h3 className="SwapTokens__title">From:</h3>
        <TokensSelect
          list={props.swapListFrom}
          setToken={props.setFromToken}
          inputWrapClassList={inputWrapClassList}
          amount={fromAmount}
          handleChangeValue={handleChangeFromValue}
          token={props.from}
          handleClickBalance={handleClickBalanceFrom}
          isError={insufficientFunds(fromAmount)}
        />
        <div className="SwapTokens__arrow">
          <Icon type="arrow-down" onClick={handelChangeOrderToken} />
        </div>
        <h3 className="SwapTokens__title">To:</h3>
        <TokensSelect
          list={props.swapListTo}
          setToken={props.setToToken}
          inputWrapClassList={inputWrapClassList}
          amount={toAmount}
          handleChangeValue={handleChangeToValue}
          token={props.to}
          handleClickBalance={handleClickBalanceTo}
        />
        <div className="SwapTokens__estimatedWrap">
          <p>
            Estimated transaction value:{' '}
            <USDDisplay value={fromAmount * props.from.rate * props.hiveRateInUsd} />
          </p>
          <p>Estimated price impact: {impact}%</p>
        </div>
        <div className="SwapTokens__impactBlock">
          <h4>Max price impact:</h4>
          <Radio.Group value={getImpact(impact)}>
            {swapImpactPercent.map(imp => (
              <Radio.Button
                disabled={calculationImpact > imp}
                key={imp}
                value={imp}
                onClick={() => setImpact(imp)}
              >
                {imp}%
              </Radio.Button>
            ))}
          </Radio.Group>
          <p>
            Large transactions may have an impact on the exchange rate If this impact is greater
            than the set value, the transaction will be cancelled
          </p>
        </div>
        <p className="SwapTokens__hiveEngineInfo">
          Click the button below to be redirected to HiveSinger to complete your transaction
        </p>
      </Form>
    </Modal>
  );
};

SwapTokens.propTypes = {
  getSwapList: PropTypes.func.isRequired,
  setFromToken: PropTypes.func.isRequired,
  setToToken: PropTypes.func.isRequired,
  resetModalData: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  swapListFrom: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  swapListTo: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  authUser: PropTypes.string.isRequired,
  hiveRateInUsd: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default connect(
  state => {
    const cryptosPriceHistory = getCryptosPriceHistory(state);

    return {
      swapList: getSwapListFromStore(state),
      authName: getAuthenticatedUserName(state),
      swapListTo: getSwapListTo(state),
      swapListFrom: getSwapListFrom(state),
      to: getTokenTo(state),
      from: getTokenFrom(state),
      hiveRateInUsd: get(cryptosPriceHistory, 'hive.usdPriceHistory.usd', null),
      authUser: getAuthenticatedUserName(state),
      visible: getVisibleModal(state),
    };
  },
  { getSwapList, setFromToken, setToToken, toggleModal, resetModalData },
)(SwapTokens);
