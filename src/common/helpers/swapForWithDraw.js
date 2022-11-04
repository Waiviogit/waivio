const BigNumber = require('bignumber.js');

const operationForJson = ({ tokenPair, minAmountOut, tokenSymbol, tokenAmount }) => ({
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

const getAmountOut = ({ tokenAmount, liquidityIn, liquidityOut, tradeFeeMul }) => {
  const amountInWithFee = new BigNumber(tokenAmount).times(tradeFeeMul);
  const num = new BigNumber(amountInWithFee).times(liquidityOut);
  const den = new BigNumber(liquidityIn).plus(amountInWithFee);

  return num.dividedBy(den);
};

// eslint-disable-next-line import/prefer-default-export
export const getSwapOutputNew = ({ symbol, amountIn, pool, slippage, tradeFeeMul, precision }) => {
  if (!pool) return;

  const { baseQuantity, quoteQuantity, tokenPair } = pool;
  const [baseSymbol] = tokenPair.split(':');

  let liquidityIn;
  let liquidityOut;
  const isBase = symbol === baseSymbol;

  if (isBase) {
    liquidityIn = baseQuantity;
    liquidityOut = quoteQuantity;
  } else {
    liquidityIn = quoteQuantity;
    liquidityOut = baseQuantity;
  }

  const amountOut = new BigNumber(
    getAmountOut({
      tradeFeeMul,
      tokenAmount: amountIn,
      liquidityIn,
      liquidityOut,
    }),
  ).toFixed(precision, BigNumber.ROUND_DOWN);
  const minAmountOut = new BigNumber(amountOut)
    .minus(new BigNumber(amountOut).multipliedBy(slippage).toFixed(precision, BigNumber.ROUND_DOWN))
    .toFixed(precision, BigNumber.ROUND_DOWN);

  const json = operationForJson({
    minAmountOut,
    tokenPair,
    tokenSymbol: symbol,
    tokenAmount: amountIn,
  });

  // eslint-disable-next-line consistent-return
  return {
    minAmountOut,
    amountOut,
    json,
  };
};
