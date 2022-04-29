import React from 'react';
import PropTypes from 'prop-types';
import ConvertIcon from '@icons/convert.svg';
import CardsTimeStamp from './CardsTimeStamp';

const ConvertHbdRequest = ({ amount, timestamp, isGuestPage }) => {
  const actualAmount = `-${parseFloat(amount)} HBD`;

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-wrapper">
        <img src={ConvertIcon} className="UserWalletTransactions__convert-icon" alt="convert" />
      </div>

      <div className="UserWalletTransactions__content">
        {'HBD>HIVE: conversion request'}
        <CardsTimeStamp timestamp={isGuestPage ? `${timestamp}Z` : timestamp} />
      </div>
      <div className={'UserWalletTransactions__content-recipient'}>
        <div className="UserWalletTransactions__request">{actualAmount}</div>
      </div>
    </div>
  );
};

ConvertHbdRequest.propTypes = {
  amount: PropTypes.string,
  timestamp: PropTypes.string,
  isGuestPage: PropTypes.bool,
};

ConvertHbdRequest.defaultProps = {
  amount: '',
  timestamp: '',
  isGuestPage: false,
};

export default ConvertHbdRequest;
