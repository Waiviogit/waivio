import React from 'react';
import PropTypes from 'prop-types';
import CardsTimeStamp from './CardsTimeStamp';

const ConvertHiveRequest = ({ amount, timestamp, isGuestPage }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-wrapper">
      <img
        src="../images/icons/convert.svg"
        className="UserWalletTransactions__convert-icon"
        alt="convert"
      />
    </div>

    <div className="UserWalletTransactions__content">
      {'HIVE>HBD: conversion request'}
      <CardsTimeStamp timestamp={isGuestPage ? `${timestamp}Z` : timestamp} />
    </div>
    <div className={'UserWalletTransactions__content-recipient'}>
      <div className="UserWalletTransactions__request"> {`- ${amount}`}</div>
    </div>
  </div>
);

ConvertHiveRequest.propTypes = {
  amount: PropTypes.string,
  timestamp: PropTypes.string,
  isGuestPage: PropTypes.bool,
};

ConvertHiveRequest.defaultProps = {
  amount: '',
  timestamp: '',
  isGuestPage: false,
};

export default ConvertHiveRequest;
