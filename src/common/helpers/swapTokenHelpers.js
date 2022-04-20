const BigNumber = require('bignumber.js');

const getAmountOut = (tradeFeeMul, amountIn, liquidityIn, liquidityOut) => {
  const amountInWithFee = BigNumber(amountIn).times(tradeFeeMul);
  const num = BigNumber(amountInWithFee).times(liquidityOut);
  const den = BigNumber(liquidityIn).plus(amountInWithFee);
  const amountOut = num.dividedBy(den);

  return amountOut;
};

const calcFee = ({ tradeFeeMul, tokenAmount, liquidityIn, liquidityOut, precision }) => {
  const tokenAmountAdjusted = BigNumber(
    getAmountOut(tradeFeeMul, tokenAmount, liquidityIn, liquidityOut),
  );
  const fee = BigNumber(tokenAmountAdjusted)
    .dividedBy(tradeFeeMul)
    .minus(tokenAmountAdjusted)
    .toFixed(precision, BigNumber.ROUND_HALF_UP);

  return fee;
};

const createJSON = ({ tokenPair, minAmountOut, tokenSymbol, tokenAmount }) =>
  JSON.stringify({
    contractName: 'marketpools',
    contractAction: 'swapTokens',
    contractPayload: {
      tokenPair,
      tokenSymbol,
      tokenAmount,
      tradeType: 'exactInput',
      minAmountOut,
    },
  });

export const getSwapOutput = ({ symbol, amountIn, pool, slippage, from, params, precision }) => {
  if (!pool) return {};
  let liquidityIn;
  let liquidityOut;

  const { baseQuantity, quoteQuantity, tokenPair } = pool;
  const [baseSymbol, quoteSymbol] = tokenPair.split(':');
  const isBase = symbol === baseSymbol;

  const tokenToExchange = isBase ? baseQuantity : quoteQuantity;

  const tokenExchangedOn = isBase ? quoteQuantity : baseQuantity;

  const absoluteValue = BigNumber(tokenToExchange).times(tokenExchangedOn);
  const tokenToExchangeNewBalance = from
    ? BigNumber(tokenToExchange).plus(amountIn)
    : BigNumber(tokenToExchange).minus(amountIn);

  const tokenExchangedOnNewBalance = absoluteValue.div(tokenToExchangeNewBalance);
  const amountOut = BigNumber(tokenExchangedOn)
    .minus(tokenExchangedOnNewBalance)
    .absoluteValue();

  const priceImpact = from
    ? BigNumber(amountIn)
        .times(100)
        .div(tokenToExchange)
    : BigNumber(amountOut)
        .times(100)
        .div(tokenExchangedOn);

  const newBalances = {
    tokenToExchange: tokenToExchangeNewBalance.toFixed(precision, BigNumber.ROUND_DOWN),
    tokenExchangedOn: tokenExchangedOnNewBalance.toFixed(precision, BigNumber.ROUND_DOWN),
  };

  const newPrices = {
    tokenToExchange: tokenToExchangeNewBalance
      .div(tokenExchangedOnNewBalance)
      .toFixed(precision, BigNumber.ROUND_DOWN),
    tokenExchangedOn: tokenExchangedOnNewBalance
      .div(tokenToExchangeNewBalance)
      .toFixed(precision, BigNumber.ROUND_DOWN),
  };

  // eslint-disable-next-line no-nested-ternary
  const tokenSymbol = from ? symbol : symbol === baseSymbol ? quoteSymbol : baseSymbol;

  const tradeDirection = tokenSymbol === baseSymbol;

  if (tradeDirection) {
    liquidityIn = pool.baseQuantity;
    liquidityOut = pool.quoteQuantity;
  } else {
    liquidityIn = pool.quoteQuantity;
    liquidityOut = pool.baseQuantity;
  }

  const tokenAmount = from ? BigNumber(amountIn).toFixed() : amountOut;

  const slippageAmount = from ? amountOut.times(slippage) : BigNumber(amountIn).times(slippage);

  const fee = calcFee({
    tradeFeeMul: params.tradeFeeMul,
    tokenAmount,
    liquidityIn,
    liquidityOut,
    precision,
  });
  const minAmountOut = from
    ? amountOut.minus(slippageAmount)
    : BigNumber(amountIn).minus(slippageAmount);

  let amountOutToFixed;

  if (from) {
    amountOutToFixed = amountOut.minus(fee).toFixed(precision, BigNumber.ROUND_DOWN);
  } else {
    const feeAmount = calcFee({
      tokenAmount: amountIn,
      liquidityIn: tokenToExchangeNewBalance.toFixed(),
      liquidityOut: tokenExchangedOnNewBalance.toFixed(),
      precision,
      tradeFeeMul: params.tradeFeeMul,
    });
    const tradeFee = BigNumber(feeAmount).times(0.025);
    const priceImpactFee = BigNumber(priceImpact)
      .div(100)
      .times(feeAmount);

    amountOutToFixed = BigNumber(amountOut)
      .plus(tradeFee)
      .plus(feeAmount)
      .plus(priceImpactFee)
      .toFixed();
  }

  const minAmountOutToFixed = minAmountOut.minus(fee).toFixed(precision, BigNumber.ROUND_UP);
  const json = createJSON({
    minAmountOut: minAmountOutToFixed,
    tokenPair,
    tokenSymbol,
    tokenAmount,
  });

  return {
    fee,
    priceImpact: priceImpact.toFixed(2),
    minAmountOut: minAmountOutToFixed,
    amountOut: amountOutToFixed,
    newBalances,
    newPrices,
    json,
  };
};

export default null;
