import React from 'react';
import PropTypes from 'prop-types';
import CardsTimeStamp from './CardsTimeStamp';

const ConvertHbdRequest = ({ amount, timestamp, isGuestPage }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-wrapper">
      <img
        src="../images/icons/convert.svg"
        className="UserWalletTransactions__convert-icon"
        alt="convert"
      />
    </div>

    <div className="UserWalletTransactions__content">
      {'HBD>HIVE: conversion request'}
      <CardsTimeStamp timestamp={isGuestPage ? `${timestamp}Z` : timestamp} />
    </div>
    <div className={'UserWalletTransactions__content-recipient'}>
      <div className="UserWalletTransactions__request"> {`- ${amount}`}</div>
    </div>
  </div>
);

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
