import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Modal, Select, Radio } from 'antd';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  getSwapList,
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

import './SwapTokens.less';

const SwapTokens = props => {
  const [impact, setImpact] = useState(0.05);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);

  useEffect(() => {
    props.getSwapList();
  }, []);

  if (isEmpty(props.swapListTo) && isEmpty(props.swapListFrom)) return null;

  const currFrom = props.swapListTo.find(symbol => symbol.symbol === props.from.symbol) || {};
  const currTo = props.swapListFrom.find(symbol => symbol.symbol === props.to.symbol) || {};

  const insufficientFunds = amount => currFrom.balance < amount;
  const inputWrapClassList = classNames('SwapTokens__inputWrap', {
    'SwapTokens__inputWrap--error': insufficientFunds(fromAmount),
  });

  const handelChangeOrderToken = () => {
    const amount = getSwapOutput({
      symbol: props.to.symbol,
      amountIn: toAmount,
      pool: currTo,
      impact,
      from: true,
    });

    props.setFromToken(props.to);
    props.setToToken(props.from);
    setFromAmount(toAmount);
    setToAmount(amount.amountOut);
  };

  const handleChangeFromValue = value => {
    setFromAmount(value);

    if (!isEmpty(currTo)) {
      const amount = getSwapOutput({
        symbol: props.from.symbol,
        amountIn: value,
        pool: currFrom,
        impact,
        from: true,
      });

      setToAmount(amount.amountOut);
    }
  };

  const handleChangeToValue = value => {
    setToAmount(value);

    if (!isEmpty(currFrom)) {
      const amount = getSwapOutput({
        symbol: props.to.symbol,
        amountIn: value,
        pool: currTo,
        impact,
      });

      setFromAmount(amount.amountOut);
    }
  };

  const handleCloseModal = () => props.toggleModal(false);

  const handleClickBalanceFrom = e =>
    handleChangeFromValue(parseFloat(e.currentTarget.textContent));

  const handleClickBalanceTo = e => handleChangeToValue(parseFloat(e.currentTarget.textContent));

  const handleSwap = () => {
    const swapInfo = getSwapOutput({
      symbol: props.from.symbol,
      amountIn: fromAmount,
      pool: currFrom,
      impact,
      from: true,
    });

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
    >
      <Form className="SwapTokens">
        <h3 className="SwapTokens__title">From:</h3>
        <div className={inputWrapClassList}>
          <input
            value={fromAmount}
            onChange={e => handleChangeFromValue(e.currentTarget.value)}
            type="number"
            className="SwapTokens__input"
          />
          <Select value={props.from.symbol} className="SwapTokens__selector">
            {props.swapListTo.map(swap => (
              <Select.Option
                className="SwapTokens__selector-option"
                onClick={() => props.setFromToken(swap)}
                key={swap.symbol}
              >
                <span>{swap.symbol}</span>
                <span className="SwapTokens__selector-balance">{swap.balance}</span>
              </Select.Option>
            ))}
          </Select>
        </div>
        {insufficientFunds(fromAmount) && <p className="invalid">Insufficient funds.</p>}{' '}
        <p>
          Your balance:{' '}
          <span className="SwapTokens__balance" onClick={handleClickBalanceFrom}>
            {get(currFrom, 'balance')} {get(currFrom, 'symbol')}
          </span>
        </p>
        <div className="SwapTokens__arrow" onClick={handelChangeOrderToken}>
          <Icon type="arrow-down" />
        </div>
        <h3 className="SwapTokens__title">To:</h3>
        <div className="SwapTokens__inputWrap">
          <input
            onChange={e => handleChangeToValue(e.currentTarget.value)}
            value={toAmount}
            type="number"
            className="SwapTokens__input"
          />
          <Select value={props.to.symbol} className="SwapTokens__selector">
            {props.swapListFrom.map(swap => (
              <Select.Option
                className="SwapTokens__selector-option"
                key={swap}
                onClick={() => props.setToToken(swap)}
              >
                <span>{swap.symbol}</span>
                <span className="SwapTokens__selector-balance">{swap.balance}</span>
              </Select.Option>
            ))}
          </Select>
        </div>
        <p>
          Your balance:{' '}
          <span className="SwapTokens__balance" onClick={handleClickBalanceTo}>
            {get(currTo, 'balance', 0)} {get(currTo, 'symbol')}
          </span>
        </p>
        <div className="SwapTokens__estimatedWrap">
          <p>
            Estimated transaction value:{' '}
            <USDDisplay value={fromAmount * currFrom.rate * props.hiveRateInUsd} />
          </p>
          <p>Estimated price impact: {impact}%</p>
        </div>
        <div className="SwapTokens__impactBlock">
          <h4>Max price impact:</h4>
          <Radio.Group defaultValue={0.5} onChange={setImpact}>
            {swapImpactPercent.map(imp => (
              <Radio.Button key={imp} value={imp}>
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
  { getSwapList, setFromToken, setToToken, toggleModal },
)(SwapTokens);
