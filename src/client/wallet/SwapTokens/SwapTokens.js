import Cookie from 'js-cookie';
import React, { useLayoutEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Icon, Modal, Radio, message } from 'antd';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import api from '../../steemConnectAPI';
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
import {
  HIVE_ENGINE_DEFAULT_SWAP_LIST,
  swapImpactPercent,
} from '../../../common/constants/swapList';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getCryptosPriceHistory } from '../../../store/appStore/appSelectors';
import { getSwapOutput } from '../../../common/helpers/swapTokenHelpers';
import { createQuery } from '../../../common/helpers/apiHelpers';
import TokensSelect from './components/TokensSelect';
import { getImpact } from '../../../common/helpers/swapWalletHelpers';
import { getFeeInfo, getSwapInfoForRebalance } from '../../../waivioApi/ApiClient';
import { getRatesList } from '../../../store/ratesStore/ratesSelector';
import { getSwapInfo } from '../../../common/helpers/withdrawTokenHelpers';

import './SwapTokens.less';

const doubleSwapToWaiv = ['SWAP.LTC', 'SWAP.BTC', 'SWAP.ETH'];

const SwapTokens = props => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const rates = useSelector(getRatesList);
  const swapToWaiv = (from, to) =>
    doubleSwapToWaiv?.includes(from?.symbol) && to?.symbol === 'WAIV';

  const [impact, setImpact] = useState(0);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [param, setParams] = useState(0);
  const [json, setJson] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const disable = Boolean(props.bdPair);
  const arrowButtonClassList = classNames('SwapTokens__arrow', {
    'SwapTokens__arrow--disabled': disable,
  });
  const setFeeInfo = async () => {
    const data = await getFeeInfo();

    setParams(data[0]);
  };

  const setSwapData = async () => {
    try {
      const data = await getSwapInfoForRebalance(authUserName, props.bdPair);

      setIsLoading(false);
      setFromAmount(data.from.quantity);
      setImpact(data.priceImpact);
      setToAmount(data.to.quantity);
      setJson(data.json);
    } catch (e) {
      message.error(e.message);
    }
  };

  useLayoutEffect(() => {
    setFeeInfo();
    setIsLoading(true);
    if (props.bdPair) {
      setSwapData();
    } else {
      props.getSwapList().then(() => {
        setIsLoading(false);
      });
    }

    return () => props.resetModalData();
  }, []);

  const insufficientFunds = amount => +props.from?.balance < +amount;

  const calculateOutputInfo = (value = 0, from, to, isFrom, onlyAmount) => {
    if (swapToWaiv(from, to) || swapToWaiv(to, from)) {
      return getSwapInfo({
        data: {
          quantity: value,
          inputSymbol: to.symbol,
          outputSymbol: from.symbol,
        },
        onlyAmount,
      });
    }

    if (!from?.tokenPair && !to.tokenPair) return {};

    return getSwapOutput({
      symbol: from.symbol,
      amountIn: value || 0,
      pool: { ...to, ...from, tokenPair: from.tokenPair || to.tokenPair },
      slippage: 0.005,
      precision: to.precision,
      from: isFrom,
      params: param,
    });
  };

  const calculationImpact = props.bdPair
    ? 0
    : calculateOutputInfo(toAmount, props.to, props.from, true, true).priceImpact;

  const handelChangeOrderToken = () => {
    if (!isEmpty(props.to) && !isEmpty(props.from)) {
      const amount = calculateOutputInfo(toAmount, props.to, props.from, true, true);

      props.changetTokens(props.to);
      setFromAmount(toAmount);
      setToAmount(amount.amountOut);
    }
  };

  const handleChangeFromValue = async value => {
    setFromAmount(value);

    if (!isEmpty(props.to)) {
      const amount = swapToWaiv(props.from, props.to)
        ? await calculateOutputInfo(value, props.from, props.to, true, true)
        : calculateOutputInfo(value, props.from, props.to, true, true);

      setImpact(amount.priceImpact);
      setToAmount(amount.amountOut || 0);
      setJson(amount.json);
    }
  };

  const handleSetToToken = async token => {
    props.setToToken(token);
    if (!isEmpty(props.from)) {
      const from = props.swapList[token.symbol].find(pair => pair.symbol === props.from.symbol);
      const amount = swapToWaiv(props.from, token)
        ? await calculateOutputInfo(fromAmount, props.from, token, true, true)
        : calculateOutputInfo(fromAmount, from, token, true, true);

      setImpact(amount.priceImpact);
      setToAmount(amount.amountOut || 0);
      setJson(amount.json);
    }
  };

  const handleChangeToValue = value => {
    const to = props.swapList[props.from.symbol].find(pair => pair.symbol === props.to.symbol);

    setToAmount(+value || 0);

    if (!isEmpty(props.from)) {
      const amount = calculateOutputInfo(value, to, props.from);

      setImpact(amount.priceImpact);
      setFromAmount(amount.amountOut);
      setJson(amount.json);
    }
  };

  const handleCloseModal = () => props.toggleModal(false);

  const handleClickBalanceFrom = value => handleChangeFromValue(value);

  const handleClickBalanceTo = value => handleChangeToValue(value);

  const handleSwap = async () => {
    if (Cookie.get('auth')) {
      setWaiting(true);
      api
        .broadcast(
          [
            [
              'custom_json',
              {
                id: 'ssc-mainnet-hive',
                required_auths: [props.authUser],
                required_posting_auths: [],
                json,
              },
            ],
          ],
          null,
          'active',
        )
        .then(() => {
          handleCloseModal();
          setWaiting(false);
        });
    } else {
      const win =
        window &&
        window.open(
          `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${
            props.authUser
          }"]&required_posting_auths=[]&${createQuery({
            id: 'ssc-mainnet-hive',
            json,
          })}`,
          '_blank',
        );

      win.focus();
      handleCloseModal();
    }
  };
  const estimateValue = HIVE_ENGINE_DEFAULT_SWAP_LIST?.includes(props.from.symbol)
    ? fromAmount * rates[props.from.symbol]
    : fromAmount * rates[props.from.symbol] * props.hiveRateInUsd;

  return (
    <Modal
      title={props.intl.formatMessage({ id: 'swap_tokens', defaultMessage: 'Swap tokens' })}
      visible={props.visible}
      onOk={handleSwap}
      onCancel={handleCloseModal}
      okButtonProps={{
        disabled: !fromAmount || !toAmount || insufficientFunds(fromAmount),
        loading: waiting,
      }}
      okText={props.intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}
      wrapClassName="SwapTokens__wrapper"
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
            onClick={
              props.isChanging || disable || swapToWaiv(props.from, props.to)
                ? null
                : handelChangeOrderToken
            }
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
          disabled={disable || swapToWaiv(props.from, props.to)}
          isLoading={isLoading}
        />
        <div className="SwapTokens__estimatedWrap">
          <p>
            <FormattedMessage
              id="estimated_transaction_value"
              defaultMessage="Estimated transaction value"
            />
            : <USDDisplay value={estimateValue} />
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
            defaultMessage="Click the button below to be redirected to HiveSigner to complete your transaction."
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
};

SwapTokens.defaultProps = {
  isRebalance: false,
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
