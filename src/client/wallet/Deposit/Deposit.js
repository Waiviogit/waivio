import React, { useEffect } from 'react';
import { Modal, Select } from 'antd';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getDepositVisible } from '../../../store/walletStore/walletSelectors';
import { openTransfer, toggleDepositModal } from '../../../store/walletStore/walletActions';
import {
  getDepositWithdrawPairs,
  setTokenPair,
  resetSelectPair,
} from '../../../store/depositeWithdrawStore/depositeWithdrawAction';
import {
  getDepositList,
  getSelectPair,
} from '../../../store/depositeWithdrawStore/depositWithdrawSelector';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import DepositInfo from './components/DepositInfo';

import './Deposit.less';

const Deposit = () => {
  const visible = useSelector(getDepositVisible);
  const list = useSelector(getDepositList);
  const authUserName = useSelector(getAuthenticatedUserName);
  const selectPair = useSelector(getSelectPair);
  const dispatch = useDispatch();
  const hiveTokens = ['HIVE', 'HBD'];

  useEffect(() => {
    if (isEmpty(list)) dispatch(getDepositWithdrawPairs());

    return () => {
      dispatch(resetSelectPair());
    };
  }, []);

  const handleCloseModal = () => dispatch(toggleDepositModal());

  const handleDoneDeposit = () => {
    dispatch(toggleDepositModal());
    if (hiveTokens.includes(selectPair.from_coin_symbol)) {
      dispatch(openTransfer(selectPair.account, 0, selectPair.from_coin_symbol, selectPair.memo));
    }
  };

  const handleSelectPair = pair => dispatch(setTokenPair(pair, authUserName));

  return (
    <Modal
      visible={visible}
      okText={selectPair && hiveTokens.includes(selectPair.from_coin_symbol) ? 'Continue' : 'Done'}
      title="Deposit"
      onCancel={handleCloseModal}
      onOk={handleDoneDeposit}
      className="Deposit"
      okButtonProps={{ disabled: !selectPair }}
    >
      <div className="Deposit__step">
        <p>
          All crypto deposits are processed by{' '}
          <a href="https://hive-engine.com/" className="Deposit__engine-link">
            Hive-Engine.com
          </a>
          . Once the deposit is made, you will receive an equal amount of the SWAP version of the
          deposited token, which can be exchanged for other tokens on the Hive-Engine blockchain.
        </p>
        <p>
          There is a 1% fee on deposits. ETH, ERC-20, BNB, BEP-20, Polygon (MATIC) and Polygon
          ERC-20 deposits have no deposit fees.
        </p>
        <p>
          Please note that you will also have to pay standard network fees when sending cryptos.
        </p>
      </div>
      <div className="Deposit__step">
        <h4 className="Deposit__title">Step 1:</h4>
        <h4>Select the crypto token to deposit:</h4>
        <Select placeholder={'Select the crypto token'}>
          {list.map(pair => (
            <Select.Option onClick={() => handleSelectPair(pair)} key={pair.from_coin_symbol}>
              {pair.display_name} ({pair.from_coin_symbol})
            </Select.Option>
          ))}
        </Select>
      </div>
      <div>
        <h4 className="Deposit__title">Step 2:</h4>
        <h4>Follow the deposit instructions:</h4>
        <DepositInfo />
      </div>
    </Modal>
  );
};

export default Deposit;
