import * as helper from '../ReferralHelper';

describe('ReferralHelper', () => {
  let value;
  let staticValue;
  let currentValue;

  it('should handle value 5 in getCurrentOfferPercent', () => {
    value = 5;
    expect(helper.getCurrentOfferPercent(value)).toEqual('95%');
  });

  it('should handle value 12 in getCurrentOfferPercent', () => {
    value = 12;
    expect(helper.getCurrentOfferPercent(value)).toEqual('88%');
  });

  it('should handle value 95 in getCurrentOfferPercent', () => {
    value = 95;
    expect(helper.getCurrentOfferPercent(value)).toEqual('5%');
  });

  it('should handle value 14.5 in getCurrentOfferPercent', () => {
    value = 14.5;
    expect(helper.getCurrentOfferPercent(value)).toEqual('85.5%');
  });

  it('should handle value 14.500 in handleOffersReward', () => {
    value = 14.5;
    expect(helper.handleOffersReward(value)).toEqual('$14.50');
  });

  it('should handle value 1.0000098 in handleOffersReward', () => {
    value = 1.0000098;
    expect(helper.handleOffersReward(value)).toEqual('$1.00');
  });

  it('should handle value 0.9800014 in handleOffersReward', () => {
    value = 0.9800014;
    expect(helper.handleOffersReward(value)).toEqual('$0.98');
  });

  it('should handle value 0.9800014 in handleOffersPercent', () => {
    value = 0.9800014;
    expect(helper.handleOffersPercent(value)).toEqual('0.9800014%');
  });

  it('should handle value 18 in handleOffersPercent', () => {
    value = 18;
    expect(helper.handleOffersPercent(value)).toEqual('18%');
  });

  it('should handle value 56.4 in handleOffersPercent', () => {
    value = 56.4;
    expect(helper.handleOffersPercent(value)).toEqual('56.4%');
  });

  it('should handle value 56.4 in handleFeesValue', () => {
    value = 56.4;
    expect(helper.handleFeesValue(value)).toEqual('$56.4');
  });

  it('should handle value 4 in handleFeesValue', () => {
    value = 4;
    expect(helper.handleFeesValue(value)).toEqual('$4');
  });

  it('should handle value 48 in handleFeesValue', () => {
    value = 48;
    expect(helper.handleFeesValue(value)).toEqual('$48');
  });

  it('should handle value 32 in getCurrentFeesValue', () => {
    value = 32;
    expect(helper.getCurrentFeesValue(value)).toEqual(10.24);
  });

  it('should handle value 0.4 in getCurrentFeesValue', () => {
    value = 0.4;
    expect(helper.getCurrentFeesValue(value)).toEqual(0.0016);
  });

  it('should handle staticValue = 5, currentValue = 5 in handleProcessingFees', () => {
    staticValue = 5;
    currentValue = 5;
    expect(helper.getCurrentFeesValue(staticValue, currentValue)).toEqual(0.25);
  });

  it('should handle staticValue = 3, currentValue = 8 in handleProcessingFees', () => {
    staticValue = 3;
    currentValue = 8;
    expect(helper.getCurrentFeesValue(staticValue, currentValue)).toEqual(0.09);
  });

  it('should handle staticValue = 0.3, currentValue = 4 in handleProcessingFees', () => {
    staticValue = 0.3;
    currentValue = 4;
    expect(helper.getCurrentFeesValue(staticValue, currentValue)).toEqual(0.0009);
  });

  it('should handle ref name in handleRefName', () => {
    const name = 'vallon';
    value = `"${name}"`;
    expect(helper.handleRefName(value)).toEqual(name);
  });
});
