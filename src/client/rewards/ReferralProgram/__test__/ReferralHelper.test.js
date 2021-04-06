import React from 'react';
import { Link } from 'react-router-dom';
import * as helper from '../ReferralHelper';
import * as mock from '../__mock__/mockData';

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

  it('should handle days in handleStatusDaysLeft', () => {
    value = 90;
    expect(helper.handleStatusDaysLeft(value)).toEqual('90');
  });

  it('should handle sponsor in getPrymaryObjectLink', () => {
    value = mock.sponsor;
    expect(helper.getPrymaryObjectLink(value)).toEqual('vvr-floret');
  });

  it('should handle sponsor in getReviewObjectLink', () => {
    value = mock.sponsor;
    expect(helper.getReviewObjectLink(value)).toEqual('tbf-clear-tea');
  });

  it('should handle sponsor in getPrymaryObjectName', () => {
    value = mock.sponsor;
    expect(helper.getPrymaryObjectName(value)).toEqual('Floret');
  });

  it('should handle sponsor in getReviewObjectName', () => {
    value = mock.sponsor;
    expect(helper.getReviewObjectName(value)).toEqual('Clear tea');
  });

  it('should handle sponsor in getReservationPermlink', () => {
    value = mock.sponsor;
    expect(helper.getReservationPermlink(value)).toEqual('reserve-hypzi77o2nh');
  });

  it('should handle sponsor in getSponsoredUserWeight', () => {
    value = mock.sponsor;
    expect(helper.getSponsoredUserWeight(value)).toEqual(' (97%)');
  });

  it('should handle handleLoadMoreUserStatusCards', () => {
    value = mock.handleLoadMoreData;
    helper.handleLoadMoreUserStatusCards(value);
    expect(mock.handleLoadMoreData.getMoreUserCards).toHaveBeenCalled();
  });

  it('should handle sponsor in getBeneficiaresInfo', () => {
    value = mock.sponsor;
    const returnedData = [
      <React.Fragment key="waivio">
        <Link to="/@waivio">waivio</Link>
        <span> (3%), </span>
      </React.Fragment>,
    ];

    expect(helper.getBeneficiaresInfo(value)).toEqual(returnedData);
  });

  it('should handle sponsor in getBeneficiaresInfo as null', () => {
    value = mock.sponsorWithoutBeneficiaries;
    expect(helper.getBeneficiaresInfo(value)).toEqual(null);
  });
});
