import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

  if (!props.transaction) return 'Empty';

  return (
    <div className="WAIVWalletTransferList">
      {props.transaction.list.map(item => (
        <WAIVWalletTransferItemsSwitcher
          key={item.transactionId}
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
    list: PropTypes.arrayOf(),
  }).isRequired,
};

export default connect(
  state => ({
    transaction: getWaivTransactionHistoryFromState(state),
  }),
  { getWAIVTransferList, getMoreWAIVTransferList },
)(WAIVWalletTransferList);
