import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import { getWaivTransactionHistoryFromState } from '../../../../../store/walletStore/walletSelectors';
import {
  getMoreWAIVTransferList,
  getWAIVTransferList,
} from '../../../../../store/walletStore/walletActions';
import WAIVWalletTransferItemsSwitcher from './WAIVWalletTransferItemsSwitcher';
import ReduxInfiniteScroll from '../../../../vendor/ReduxInfiniteScroll';
import Loading from '../../../../components/Icon/Loading';
import './WAIVWalletTransferList.less';

const WAIVWalletTransferList = React.memo(props => {
  useEffect(() => {
    props.getWAIVTransferList(props.name);
  }, []);

  const handleLoadMore = useCallback(
    () => props.getMoreWAIVTransferList(props.name, props.transaction.list.length),
    [props.name, props.transaction.list.length],
  );

  if (isEmpty(props.transaction.list))
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
        hasMore={props.transaction.hasMore}
        elementIsScrollable={false}
        threshold={300}
        loader={<Loading />}
      >
        {props.transaction.list.map(item => (
          <WAIVWalletTransferItemsSwitcher
            key={item._id}
            transaction={item}
            currentName={props.name}
          />
        ))}
      </ReduxInfiniteScroll>
    </div>
  );
});

WAIVWalletTransferList.propTypes = {
  getWAIVTransferList: PropTypes.func.isRequired,
  getMoreWAIVTransferList: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  transaction: PropTypes.shape({
    list: PropTypes.arrayOf(PropTypes.shape({})),
    hasMore: PropTypes.bool,
  }).isRequired,
};

export default connect(
  state => ({
    transaction: getWaivTransactionHistoryFromState(state),
  }),
  { getWAIVTransferList, getMoreWAIVTransferList },
)(WAIVWalletTransferList);
