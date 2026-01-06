import BigNumber from 'bignumber.js';

export const getUpdatedPoolStats = ({ pool, baseAdjusted, quoteAdjusted }) => {
  const uPool = { ...pool };

  uPool.baseQuantity = new BigNumber(pool.baseQuantity)
    .plus(baseAdjusted)
    .toFixed(pool.precision, BigNumber.ROUND_HALF_UP);
  uPool.quoteQuantity = new BigNumber(pool.quoteQuantity)
    .plus(quoteAdjusted)
    .toFixed(pool.precision, BigNumber.ROUND_HALF_UP);

  uPool.basePrice = new BigNumber(uPool.quoteQuantity).dividedBy(uPool.baseQuantity).toFixed();
  uPool.quotePrice = new BigNumber(uPool.baseQuantity).dividedBy(uPool.quoteQuantity).toFixed();

  return uPool;
};

export const getDiffPercent = (before, after) => {
  if (new BigNumber(before).eq(0)) return '0';

  return new BigNumber(after)
    .minus(before)
    .div(before)
    .times(100)
    .toFixed();
};

const getAmountOut = (tradeFeeMul, amountIn, liquidityIn, liquidityOut) => {
  const amountInWithFee = BigNumber(amountIn).times(tradeFeeMul);
  const num = BigNumber(amountInWithFee).times(liquidityOut);
  const den = BigNumber(liquidityIn).plus(amountInWithFee);

  return num.dividedBy(den);
};

const calcFee = ({ tradeFeeMul, tokenAmount, liquidityIn, liquidityOut, precision }) => {
  const tokenAmountAdjusted = BigNumber(
    getAmountOut(tradeFeeMul, tokenAmount, liquidityIn, liquidityOut),
  );

  return BigNumber(tokenAmountAdjusted)
    .dividedBy(tradeFeeMul)
    .minus(tokenAmountAdjusted)
    .toFixed(precision, BigNumber.ROUND_HALF_UP);
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
  const tokenPairDelta =
    symbol === baseSymbol
      ? [new BigNumber(amountIn), new BigNumber(amountOut).negated()]
      : [new BigNumber(amountOut).negated(), new BigNumber(amountIn)];

  const updatedPool = getUpdatedPoolStats({
    pool,
    baseAdjusted: tokenPairDelta[0],
    quoteAdjusted: tokenPairDelta[1],
  });

  const priceImpact = new BigNumber(getDiffPercent(pool.basePrice, updatedPool.basePrice))
    .abs()
    .toFixed(2);

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

  const tokenAmount = from
    ? BigNumber(amountIn).toFixed(precision, BigNumber.ROUND_DOWN)
    : amountOut;

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
    const tradeFee = BigNumber(feeAmount).times(0.02);
    const priceImpactFee = BigNumber(priceImpact)
      .div(100)
      .times(feeAmount);

    amountOutToFixed = BigNumber(amountOut)
      .minus(feeAmount)
      .plus(priceImpactFee)
      .minus(tradeFee)
      .toFixed(precision, BigNumber.ROUND_DOWN);
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
    priceImpact,
    minAmountOut: minAmountOutToFixed,
    amountOut: amountOutToFixed,
    newBalances,
    newPrices,
    json,
  };
};

export default null;
