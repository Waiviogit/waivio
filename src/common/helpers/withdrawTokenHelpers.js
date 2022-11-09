import BigNumber from 'bignumber.js';
import _, { isEmpty } from 'lodash';
import WAValidator from 'multicoin-address-validator';
import { message } from 'antd';

import { converHiveEngineCoins, getMarketPools, headers } from '../../waivioApi/ApiClient';
import { getSwapOutputNew } from './swapForWithDraw';

const AVAILABLE_TOKEN_WITHDRAW = {
  BTC: 'SWAP.BTC',
  HIVE: 'SWAP.HIVE',
  LTC: 'SWAP.LTC',
  ETH: 'SWAP.ETH',
};

const DEFAULT_PRECISION = 8;
const DEFAULT_SLIPPAGE = 0.0001;
const DEFAULT_SLIPPAGE_MAX = 0.01;
const DEFAULT_TRADE_FEE_MUL = 0.9975;
const DEFAULT_WITHDRAW_FEE_MUL = 0.9925;

const getETHAccountToTransfer = async ({ destination }) => {
  const validAddress = WAValidator.validate(destination, 'eth');

  if (!validAddress) return { error: 'invalid ETH address' };

  return {
    account: 'swap-eth',
    memo: destination,
  };
};

const getAccountToTransfer = async ({ destination, from_coin, to_coin }) => {
  if (to_coin === 'ETH') {
    return getETHAccountToTransfer({ destination });
  }

  try {
    const result = await converHiveEngineCoins({
      destination,
      from_coin,
      to_coin,
    });

    if (result && result.data) return result.data;

    return result;
  } catch (error) {
    return { error };
  }
};

const validateEthAmount = async amount => {
  try {
    let error = null;
    const resp = await fetch('https://ethgw.hive-engine.com/api/utils/withdrawalfee/SWAP.ETH', {
      method: 'GET',
      headers,
    }).then(res => res.json());
    const fee = resp?.data;

    if (!fee) return false;
    if (
      !BigNumber(amount)
        .minus(fee)
        .times(DEFAULT_WITHDRAW_FEE_MUL)
        .gt(0)
    ) {
      error = new Error(`gas fee ${fee}`);
    }

    return {
      error,
      predictiveAmount: BigNumber(amount)
        .minus(fee)
        .times(DEFAULT_WITHDRAW_FEE_MUL)
        .dp(8, BigNumber.ROUND_HALF_DOWN)
        .toNumber(),
    };
  } catch (error) {
    return false;
  }
};

const validateBtcAmount = async amount => {
  try {
    let error = null;
    const resp = await fetch('https://api.tribaldex.com/settings', {
      method: 'GET',
      headers,
    }).then(res => res.json());

    const minimum_withdrawals = resp?.minimum_withdrawals;

    if (!minimum_withdrawals) return false;
    const fee = _.find(minimum_withdrawals, el => el[0] === 'SWAP.BTC')[1];

    if (!fee) return false;

    if (
      !BigNumber(amount)
        .minus(fee)
        .gte(0)
    ) {
      error = new Error(`minimum withdraw amount ${fee}`);
    }

    return {
      error,
      predictiveAmount: BigNumber(amount)
        .times(DEFAULT_WITHDRAW_FEE_MUL)
        .dp(8, BigNumber.ROUND_HALF_DOWN)
        .toNumber(),
    };
  } catch (error) {
    return false;
  }
};

const validateLtcAmount = amount => ({
  predictiveAmount: BigNumber(amount)
    .times(DEFAULT_WITHDRAW_FEE_MUL)
    .dp(8, BigNumber.ROUND_HALF_DOWN)
    .toNumber(),
});

const validateHiveAmount = amount => {
  let error = null;

  if (!BigNumber(amount).gte(0.002)) {
    error = new Error('minimum withdraw amount 0.002');
  }

  return {
    error,
    predictiveAmount: BigNumber(amount)
      .times(DEFAULT_WITHDRAW_FEE_MUL)
      .dp(3, BigNumber.ROUND_DOWN)
      .toNumber(),
  };
};

const validateAmount = async ({ amount, outputSymbol }) => {
  const validation = {
    HIVE: validateHiveAmount,
    ETH: validateEthAmount,
    BTC: validateBtcAmount,
    LTC: validateLtcAmount,
  };

  return validation[outputSymbol](amount);
};

const getWithdrawToAddress = async ({ address, outputSymbol, amount }) => {
  const { error, memo, account: to } = await getAccountToTransfer({
    destination: address,
    from_coin: AVAILABLE_TOKEN_WITHDRAW[outputSymbol],
    to_coin: outputSymbol,
  });

  if (error) return { error };

  const validAmount = await validateAmount({ amount, outputSymbol });

  if (!validAmount)
    return {
      error: `to low amount: ${amount} for ${outputSymbol} on output to withdraw`,
    };

  return {
    withdraw: {
      contractName: 'tokens',
      contractAction: 'transfer',
      contractPayload: {
        symbol: AVAILABLE_TOKEN_WITHDRAW[outputSymbol],
        to,
        quantity: amount,
        memo,
      },
    },
  };
};

const getWithdrawContract = ({ amount }) => ({
  withdraw: {
    contractName: 'hivepegged',
    contractAction: 'withdraw',
    contractPayload: {
      quantity: new BigNumber(amount).toFixed(3),
    },
  },
});

export const directPoolSwapData = async ({ quantity, inputSymbol, params }) => {
  const { tokenPair } = params;
  const pool = await getMarketPools({ query: { tokenPair } });

  const { json, minAmountOut } = getSwapOutputNew({
    symbol: inputSymbol,
    amountIn: quantity,
    pool: pool[0],
    precision: DEFAULT_PRECISION,
    slippage: DEFAULT_SLIPPAGE,
    tradeFeeMul: DEFAULT_TRADE_FEE_MUL,
  });

  const amount = BigNumber(minAmountOut).toFixed();

  return { swapJson: [json], amount, predictionAmount: amount * DEFAULT_WITHDRAW_FEE_MUL };
};

export const indirectSwapData = async ({ quantity, params }) => {
  const { tokenPair, exchangeSequence } = params;
  const swapJson = [];
  let amount = '0';
  const pools = await getMarketPools({ query: { tokenPair: { $in: tokenPair } } });

  if (isEmpty(pools)) return { error: 'market pool is unavailable' };

  // eslint-disable-next-line no-restricted-syntax
  for (const [index, pair] of tokenPair.entries()) {
    const pool = pools.find(p => p.tokenPair === pair);

    if (!pool) return { error: 'market pool is unavailable' };
    const { json, minAmountOut } = getSwapOutputNew({
      symbol: exchangeSequence[index],
      amountIn: index ? amount : quantity,
      pool,
      precision: DEFAULT_PRECISION,
      slippage: index ? DEFAULT_SLIPPAGE_MAX : DEFAULT_SLIPPAGE,
      tradeFeeMul: DEFAULT_TRADE_FEE_MUL,
    });

    swapJson.push(json);
    amount = BigNumber(minAmountOut).toFixed();
  }

  return { swapJson, amount, predictionAmount: amount * DEFAULT_WITHDRAW_FEE_MUL };
};

const withdrawParams = Object.freeze({
  HIVE: {
    getSwapData: directPoolSwapData,
    withdrawContract: getWithdrawContract,
    tokenPair: 'SWAP.HIVE:WAIV',
    prediction: 3,
  },
  BTC: {
    getSwapData: indirectSwapData,
    withdrawContract: getWithdrawToAddress,
    tokenPair: ['SWAP.HIVE:WAIV', 'SWAP.HIVE:SWAP.BTC'],
    exchangeSequence: ['WAIV', 'SWAP.HIVE'],
    prediction: 8,
  },
  LTC: {
    getSwapData: indirectSwapData,
    withdrawContract: getWithdrawToAddress,
    tokenPair: ['SWAP.HIVE:WAIV', 'SWAP.HIVE:SWAP.LTC'],
    exchangeSequence: ['WAIV', 'SWAP.HIVE'],
    prediction: 8,
  },
  ETH: {
    getSwapData: indirectSwapData,
    withdrawContract: getWithdrawToAddress,
    tokenPair: ['SWAP.HIVE:WAIV', 'SWAP.HIVE:SWAP.ETH'],
    exchangeSequence: ['WAIV', 'SWAP.HIVE'],
    prediction: 8,
  },
});

const getWithdrawInfo = async ({ account, data, onlyAmount }) => {
  const { quantity, inputSymbol, outputSymbol, address } = data;

  const params = withdrawParams[outputSymbol];

  const { swapJson, amount } = await params.getSwapData({
    params,
    quantity,
    inputSymbol,
  });

  const { error: err, predictiveAmount } = await validateAmount({ amount, outputSymbol });

  if (onlyAmount) return predictiveAmount;

  if (err) {
    message.error(err);

    return null;
  }

  const { withdraw, error: errWithdrawData } = await params.withdrawContract({
    address,
    outputSymbol,
    params,
    amount,
    inputSymbol,
    account,
    inputQuantity: quantity,
  });

  if (errWithdrawData) {
    message.error(errWithdrawData);

    return errWithdrawData;
  }

  const customJsonPayload = [...swapJson, withdraw];

  return { customJsonPayload };
};

export default getWithdrawInfo;
