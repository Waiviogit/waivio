import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { useParams } from 'react-router';

import {
  getHasMoreHiveEngineTransactionHistory,
  getHiveEngineTransactionHistory,
} from '../../../../store/walletStore/walletSelectors';
import {
  getHiveEngineTransferList,
  getMoreHiveEngineTransferList,
} from '../../../../store/walletStore/walletActions';
import ReduxInfiniteScroll from '../../../vendor/ReduxInfiniteScroll';
import Loading from '../../../components/Icon/Loading';
import WAIVWalletTransferItemsSwitcher from '../../WAIVwallet/WAIVWalletTransferList/WAIVWalletTransferItemsSwitcher';

const HiveEngineTransferList = React.memo(props => {
  const params = useParams();

  useEffect(() => {
    props.getHiveEngineTransferList(params.name);
  }, []);

  const handleLoadMore = useCallback(
    () => props.getMoreHiveEngineTransferList(params.name, props.transactionList.length),
    [params.name, props.transactionList.length],
  );

  if (isEmpty(props.transactionList))
    return (
      <div className="UserWallet__empty-transactions-list">
        <FormattedMessage
          id="empty_transaction_list"
          defaultMessage="You don't have any transactions yet"
        />
      </div>
    );

  return (
    <div>
      <ReduxInfiniteScroll
        className="WAIVWalletTransferList"
        loadMore={handleLoadMore}
        hasMore={props.hasMore}
        elementIsScrollable={false}
        threshold={300}
        loader={<Loading />}
      >
        {props.transactionList.map(item => (
          <WAIVWalletTransferItemsSwitcher
            key={item._id}
            transaction={item}
            currentName={params.name}
          />
        ))}
      </ReduxInfiniteScroll>
    </div>
  );
});

HiveEngineTransferList.propTypes = {
  getHiveEngineTransferList: PropTypes.func.isRequired,
  getMoreHiveEngineTransferList: PropTypes.func.isRequired,
  transactionList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  hasMore: PropTypes.bool.isRequired,
};

export default connect(
  state => ({
    transactionList: getHiveEngineTransactionHistory(state),
    hasMore: getHasMoreHiveEngineTransactionHistory(state),
  }),
  { getHiveEngineTransferList, getMoreHiveEngineTransferList },
)(HiveEngineTransferList);
