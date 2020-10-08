export const getCurrentOfferPercent = value => `${100 - value}%`;
export const handleOffersReward = value => `$${value.toFixed(2)}`;
export const handleOffersPercent = value => `${value}%`;
export const handleFeesValue = value => `$${value}`;
export const getCurrentFeesValue = value => value * (value / 100);
export const handleProcessingFees = (staticValue, currentValue) =>
  `$${(staticValue * (staticValue / 100) * currentValue) / 100}`;
export const handleRefName = refName => refName.replace(/^"(.+(?="$))"$/, '$1');
