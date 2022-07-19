import React, { useLayoutEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Icon, Modal, Radio } from 'antd';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  changetTokens,
  getSwapList,
  resetModalData,
  setBothTokens,
  setFromToken,
  setToToken,
  toggleModal,
} from '../../../store/swapStore/swapActions';
import {
  getBdPair,
  getIsChanging,
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
import { getFeeInfo, getSwapInfoForRebalance } from '../../../waivioApi/ApiClient';

import './SwapTokens.less';

const SwapTokens = props => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const [impact, setImpact] = useState(0);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [param, setParams] = useState(0);
  const [json, setJson] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const disable = Boolean(props.bdPair);
  const arrowButtonClassList = classNames('SwapTokens__arrow', {
    'SwapTokens__arrow--disabled': disable,
  });

  const setFeeInfo = async () => {
    const data = await getFeeInfo();

    setParams(data);
  };

  const setSwapData = async () => {
    const data = await getSwapInfoForRebalance(authUserName, props.bdPair);

    setIsLoading(false);
    setFromAmount(data.from.quantity);
    setImpact(data.priceImpact);
    setToAmount(data.to.quantity);
    setJson(data.json);
    if (props.from.symbol !== data.from.symbol) {
      props.setBothTokens(props.to, props.from);
    }
  };

  useLayoutEffect(() => {
    setFeeInfo();
    setIsLoading(true);
    props.getSwapList().then(() => {
      if (props.bdPair) setSwapData();
      else setIsLoading(false);
    });

    return () => props.resetModalData();
  }, []);

  const insufficientFunds = amount => props.from.balance < amount;

  const calculateOutputInfo = (value = 0, from, to, isFrom, fixed) => {
    if (!from.tokenPair) return {};

    return getSwapOutput({
      symbol: from.symbol,
      amountIn: value || 0,
      pool: from,
      slippage: 0.005,
      precision: to.precision,
      from: isFrom,
      params: param,
      fixed,
    });
  };

  const calculationImpact = calculateOutputInfo(toAmount, props.to, props.from, true).priceImpact;

  const handelChangeOrderToken = () => {
    if (!isEmpty(props.to) && !isEmpty(props.from)) {
      const amount = calculateOutputInfo(toAmount, props.to, props.from, true);

      props.changetTokens(props.to);
      setFromAmount(toAmount);
      setToAmount(amount.amountOut);
    }
  };

  const handleChangeFromValue = value => {
    setFromAmount(value);

    if (!isEmpty(props.to)) {
      const amount = calculateOutputInfo(value, props.from, props.to, true);

      setImpact(amount.priceImpact);
      setToAmount(amount.amountOut || 0);
    }
  };

  const handleSetToToken = token => {
    props.setToToken(token);

    if (!isEmpty(props.from)) {
      const from = props.swapList[token.symbol].find(pair => pair.symbol === props.from.symbol);
      const amount = calculateOutputInfo(fromAmount, from, token, true);

      setImpact(amount.priceImpact);
      setToAmount(amount.amountOut || 0);
    }
  };

  const handleChangeToValue = value => {
    const to = props.swapList[props.from.symbol].find(pair => pair.symbol === props.to.symbol);

    setToAmount(+value || 0);

    if (!isEmpty(props.from)) {
      const amount = calculateOutputInfo(value, to, props.from);

      setImpact(amount.priceImpact);
      setFromAmount(amount.amountOut);
    }
  };

  const handleCloseModal = () => props.toggleModal(false);

  const handleClickBalanceFrom = value => handleChangeFromValue(value);

  const handleClickBalanceTo = value => handleChangeToValue(value);

  const handleSwap = () => {
    const swapInfo = calculateOutputInfo(fromAmount, props.from, props.to, true, true);
    const win = window.open(
      `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${
        props.authUser
      }"]&required_posting_auths=[]&${createQuery({
        id: 'ssc-mainnet-hive',
        json: json || get(swapInfo, 'json'),
      })}`,
      '_blank',
    );

    win.focus();
    handleCloseModal();
  };

  return (
    <Modal
      title={props.intl.formatMessage({ id: 'swap_tokens', defaultMessage: 'Swap tokens' })}
      visible={props.visible}
      onOk={handleSwap}
      onCancel={handleCloseModal}
      okButtonProps={{ disabled: !fromAmount || !toAmount || insufficientFunds(fromAmount) }}
      okText={props.intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}
    >
      <Form className="SwapTokens">
        <h3 className="SwapTokens__title">
          <FormattedMessage id="from" defaultMessage="From" />:
        </h3>
        <TokensSelect
          list={props.swapListFrom}
          setToken={token => {
            props.setFromToken(token);
            setToAmount(0);
          }}
          amount={fromAmount}
          handleChangeValue={handleChangeFromValue}
          token={isLoading ? null : props.from}
          handleClickBalance={handleClickBalanceFrom}
          isError={insufficientFunds(fromAmount)}
          disabled={disable}
          isLoading={isLoading}
        />
        <div className={arrowButtonClassList}>
          <Icon
            type="arrow-down"
            onClick={props.isChanging || disable ? null : handelChangeOrderToken}
          />
        </div>
        <h3 className="SwapTokens__title">
          <FormattedMessage id="to" defaultMessage="To" />:
        </h3>
        <TokensSelect
          list={props.swapListTo}
          setToken={handleSetToToken}
          amount={toAmount}
          handleChangeValue={handleChangeToValue}
          token={isLoading ? null : props.to}
          handleClickBalance={handleClickBalanceTo}
          disabled={disable}
          isLoading={isLoading}
        />
        <div className="SwapTokens__estimatedWrap">
          <p>
            <FormattedMessage
              id="estimated_transaction_value"
              defaultMessage="Estimated transaction value"
            />
            : <USDDisplay value={fromAmount * props.from.rate * props.hiveRateInUsd} />
          </p>
          <p>
            <FormattedMessage id="estimated_price_impact" defaultMessage="Estimated price impact" />
            : {impact}%
          </p>
        </div>
        <div className="SwapTokens__impactBlock">
          <h4>
            <FormattedMessage id="max_price_impact" defaultMessage="Max price impact" />:
          </h4>
          <Radio.Group value={getImpact(impact)}>
            {swapImpactPercent.map(imp => (
              <Radio.Button
                disabled={calculationImpact > imp || disable}
                key={imp}
                value={imp}
                onClick={() => {
                  setImpact(imp);
                }}
              >
                {imp}%
              </Radio.Button>
            ))}
          </Radio.Group>
          <p>
            <FormattedMessage
              id="swaptokens_info"
              defaultMessage="Large transactions may have an impact on the exchange rate. If this impact is greater
            than the set value, the transaction will be cancelled."
            />
          </p>
        </div>
        <p className="SwapTokens__hiveEngineInfo">
          <FormattedMessage
            id="SwapTokens__hiveEngineInfo"
            defaultMessage="Click the button below to be redirected to HiveSinger to complete your transaction."
          />
        </p>
      </Form>
    </Modal>
  );
};

SwapTokens.propTypes = {
  intl: PropTypes.shape().isRequired,
  getSwapList: PropTypes.func.isRequired,
  setFromToken: PropTypes.func.isRequired,
  setToToken: PropTypes.func.isRequired,
  resetModalData: PropTypes.func.isRequired,
  changetTokens: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  swapListFrom: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  swapListTo: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  swapList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  from: PropTypes.shape().isRequired,
  to: PropTypes.shape().isRequired,
  authUser: PropTypes.string.isRequired,
  hiveRateInUsd: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
  bdPair: PropTypes.string.isRequired,
  isChanging: PropTypes.bool.isRequired,
  setBothTokens: PropTypes.func.isRequired,
};

export default connect(
  state => {
    const cryptosPriceHistory = getCryptosPriceHistory(state);

    return {
      swapList: getSwapListFromStore(state),
      authName: getAuthenticatedUserName(state),
      swapListTo: getSwapListTo(state),
      bdPair: getBdPair(state),
      swapListFrom: getSwapListFrom(state),
      to: getTokenTo(state),
      from: getTokenFrom(state),
      hiveRateInUsd: get(cryptosPriceHistory, 'hive.usdPriceHistory.usd', null),
      authUser: getAuthenticatedUserName(state),
      visible: getVisibleModal(state),
      isChanging: getIsChanging(state),
    };
  },
  {
    getSwapList,
    setFromToken,
    setToToken,
    toggleModal,
    resetModalData,
    changetTokens,
    setBothTokens,
  },
)(injectIntl(SwapTokens));
