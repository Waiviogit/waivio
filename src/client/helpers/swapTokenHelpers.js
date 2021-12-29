import BigNumber from 'bignumber.js';

export const createJSON = ({ tokenPair, from, symbol, amountOut, amountIn, minAmountOut }) => {
  // eslint-disable-next-line no-nested-ternary
  const tokenSymbol = from
    ? symbol
    : symbol === tokenPair.split(':')[0]
    ? tokenPair.split(':')[1]
    : tokenPair.split(':')[0];

  const tokenAmount = from ? amountIn : amountOut;

  return JSON.stringify({
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
};

export const getSwapOutput = ({ symbol, amountIn, pool, slippage, from }) => {
  if (!pool) return {};

  const { baseQuantity, quoteQuantity, tokenPair, precision } = pool;
  const [baseSymbol] = tokenPair.split(':');
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

  const slippageAmount = from ? amountOut.times(slippage) : BigNumber(amountIn).times(slippage);

  const minAmountOut = from
    ? amountOut.minus(slippageAmount)
    : BigNumber(amountIn).minus(slippageAmount);

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

  const amountOutToFixed = amountOut.toFixed(precision, BigNumber.ROUND_DOWN);
  const minAmountOutToFixed = minAmountOut.toFixed(precision, BigNumber.ROUND_DOWN);

  const json = createJSON({
    amountIn: BigNumber(amountIn).toFixed(precision, BigNumber.ROUND_DOWN),
    minAmountOut: minAmountOutToFixed,
    amountOut: amountOutToFixed,
    tokenPair,
    symbol,
    from,
  });

  return {
    priceImpact: priceImpact.toFixed(2),
    minAmountOut: minAmountOutToFixed,
    amountOut: amountOutToFixed,
    newBalances,
    newPrices,
    json,
  };
};

export default null;
