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
import { getSwapOutput } from '../../helpers/swapTokenHelpers';
import { createQuery } from '../../helpers/apiHelpers';
import TokensSelect from './components/TokensSelect';

import './SwapTokens.less';

const SwapTokens = props => {
  const [impact, setImpact] = useState(0);
  const [slippage, setSlippage] = useState(0.05);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);

  useLayoutEffect(() => {
    props.getSwapList();

    return () => props.resetModalData();
  }, []);

  if (isEmpty(props.swapListTo) && isEmpty(props.swapListFrom)) return null;

  const insufficientFunds = amount => props.from.balance < amount;
  const inputWrapClassList = classNames('SwapTokens__inputWrap', {
    'SwapTokens__inputWrap--error': insufficientFunds(fromAmount),
  });

  const calculateOutputInfo = (value = 0, from, to, isFrom) => {
    const pool = from.tokenPair ? from : to;

    return getSwapOutput({
      symbol: from.symbol,
      amountIn: value || 0,
      pool,
      slippage,
      from: isFrom,
    });
  };

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

  const handleClickBalanceFrom = e =>
    handleChangeFromValue(parseFloat(e.currentTarget.textContent));

  const handleClickBalanceTo = e => handleChangeToValue(parseFloat(e.currentTarget.textContent));

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
          symbol={props.from.symbol}
        />
        {insufficientFunds(fromAmount) && <p className="invalid">Insufficient funds.</p>}{' '}
        <p>
          Your balance:{' '}
          <span className="SwapTokens__balance" onClick={handleClickBalanceFrom}>
            {get(props.from, 'balance')} {get(props.from, 'symbol')}
          </span>
        </p>
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
          symbol={props.to.symbol}
        />
        <p>
          Your balance:{' '}
          <span className="SwapTokens__balance" onClick={handleClickBalanceTo}>
            {get(props.to, 'balance', 0)} {get(props.to, 'symbol')}
          </span>
        </p>
        <div className="SwapTokens__estimatedWrap">
          <p>
            Estimated transaction value:{' '}
            <USDDisplay value={fromAmount * props.from.rate * props.hiveRateInUsd} />
          </p>
          <p>Estimated price impact: {impact}%</p>
        </div>
        <div className="SwapTokens__impactBlock">
          <h4>Max price impact:</h4>
          <Radio.Group defaultValue={0.5}>
            {swapImpactPercent.map(imp => (
              <Radio.Button key={imp} value={imp} onClick={() => setSlippage(imp * 0.05)}>
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
