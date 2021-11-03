import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';

import { epochToUTC } from '../helpers/formatter';

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
      <span className="UserWalletTransactions__timestamp">
        {isGuestPage ? (
          <BTooltip
            title={
              <span>
                <FormattedDate value={`${timestamp}Z`} /> <FormattedTime value={`${timestamp}Z`} />
              </span>
            }
          >
            <span>
              <FormattedRelative value={`${timestamp}Z`} />
            </span>
          </BTooltip>
        ) : (
          <BTooltip
            title={
              <span>
                <FormattedRelative value={epochToUTC(timestamp)} />
              </span>
            }
          >
            <span>
              <FormattedRelative value={epochToUTC(timestamp)} />
            </span>
          </BTooltip>
        )}
      </span>
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
