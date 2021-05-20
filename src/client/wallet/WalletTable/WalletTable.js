import { map } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import WalletTableHeader from '../constants';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import WalletTableBodyRow from './WalletTableBodyRow';
import { guestUserRegex } from '../../helpers/regexHelpers';

import './WalletTable.less';

const WalletTable = ({
  intl,
  handleLoadMore,
  hasMore,
  isErrorLoading,
  transactions,
  currentUsername,
  totalVestingShares,
  totalVestingFundSteem,
}) => (
  <div className="WalletTable">
    <table>
      <thead>
        <tr>
          {WalletTableHeader.map(tdInfo => (
            <th key={tdInfo.id} className={tdInfo.className}>
              {tdInfo.symbol ||
                intl.formatMessage({
                  id: tdInfo.id,
                  defaultMessage: tdInfo.message,
                })}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <ReduxInfiniteScroll
          className="WalletTable__main-content"
          loadMore={handleLoadMore}
          hasMore={hasMore}
          elementIsScrollable={false}
          threshold={500}
          loader={
            !isErrorLoading && (
              <div className="WalletTable__loader">
                <Loading />
              </div>
            )
          }
        >
          {map(transactions, transaction => (
            <WalletTableBodyRow
              key={transaction.timestamp}
              transaction={transaction}
              isGuestPage={guestUserRegex.test(currentUsername)}
              currentUsername={currentUsername}
              totalVestingShares={totalVestingShares}
              totalVestingFundSteem={totalVestingFundSteem}
            />
          ))}
        </ReduxInfiniteScroll>
      </tbody>
    </table>
  </div>
);

WalletTable.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  handleLoadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isErrorLoading: PropTypes.bool.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currentUsername: PropTypes.string.isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
};

export default WalletTable;
