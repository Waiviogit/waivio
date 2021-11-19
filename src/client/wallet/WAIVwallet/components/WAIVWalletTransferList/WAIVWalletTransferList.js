import React, { useEffect } from 'react';
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

import './WAIVWalletTransferList.less';

const WAIVWalletTransferList = props => {
  useEffect(() => {
    props.getWAIVTransferList(props.name);
  }, []);

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
    <div className="WAIVWalletTransferList">
      {props.transaction.list.map(item => (
        <WAIVWalletTransferItemsSwitcher
          key={item._id}
          transaction={item}
          currentName={props.name}
        />
      ))}
    </div>
  );
};

WAIVWalletTransferList.propTypes = {
  getWAIVTransferList: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  transaction: PropTypes.shape({
    list: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default connect(
  state => ({
    transaction: getWaivTransactionHistoryFromState(state),
  }),
  { getWAIVTransferList, getMoreWAIVTransferList },
)(WAIVWalletTransferList);
