import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import './WalletTable.less';

const WalletTable = ({ intl }) => {
  console.log('table');
  return (
    <React.Fragment>
      <table className="WalletTable">
        <thead>
          <tr>
            <th className="WalletTable__date">
              {intl.formatMessage({
                id: 'table_date',
                defaultMessage: `Date`,
              })}
            </th>
            <th className="WalletTable__HIVE">
              {intl.formatMessage({
                id: 'table_HIVE',
                defaultMessage: `HIVE`,
              })}
            </th>
            <th className="WalletTable__HP">
              {intl.formatMessage({
                id: 'table_HP',
                defaultMessage: `HP`,
              })}
            </th>
            <th className="WalletTable__HBD">
              {intl.formatMessage({
                id: 'table_HBD',
                defaultMessage: `HBD`,
              })}
            </th>
            <th className="WalletTable__description">
              {intl.formatMessage({
                id: 'table_description',
                defaultMessage: `Description`,
              })}
            </th>
            <th className="WalletTable__memo">
              {intl.formatMessage({
                id: 'table_memo',
                defaultMessage: `Memo`,
              })}
            </th>
          </tr>
        </thead>
        {/* <tbody> */}

        {/* </tbody> */}
      </table>
    </React.Fragment>
  );
};

WalletTable.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

WalletTable.defaultProps = {};

export default injectIntl(WalletTable);
