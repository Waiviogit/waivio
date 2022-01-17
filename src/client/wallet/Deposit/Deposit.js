import React, { useEffect } from 'react';
import { Modal, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getDepositVisible } from '../../../store/walletStore/walletSelectors';
import { toggleDepositModal } from '../../../store/walletStore/walletActions';
import {
  getDepositWithdrawPairs,
  setTokenPair,
} from '../../../store/depositeWithdrawStore/depositeWithdrawAction';
import {
  getDepositList,
  getSelectPair,
} from '../../../store/depositeWithdrawStore/depositWithdrawSelector';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import AddressSection from './components/AddressSection';
import MemoSection from './components/MemoSection';
import AccountSection from './components/AccountSection';

import './Deposit.less';

const Deposit = () => {
  const visible = useSelector(getDepositVisible);
  const list = useSelector(getDepositList);
  const selectPair = useSelector(getSelectPair);
  const authUserName = useSelector(getAuthenticatedUserName);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDepositWithdrawPairs());
  }, []);

  const handleCloseModal = () => dispatch(toggleDepositModal());

  const handleSelectPair = pair => dispatch(setTokenPair(pair, authUserName));

  return (
    <Modal
      visible={visible}
      okText="Done"
      title="Deposit"
      onCancel={handleCloseModal}
      onOk={handleCloseModal}
      className="Deposit"
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
        <h4 className="Deposit__title">Step 1</h4>
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
        <h4 className="Deposit__title">Step 2</h4>
        <h4>Follow the deposit instructions:</h4>
        {selectPair ? (
          <div>
            <p>
              Please send any amount of {selectPair.from_coin_symbol} to the following address and
              you will receive an equal amount of {selectPair.to_coin_symbol} in the{' '}
              <a className="Deposit__account-link" href={`/@${authUserName}`}>
                @{authUserName}
              </a>{' '}
              account once the transaction has received the required number of confirmations on the
              external chain.
            </p>
            {selectPair.account && <AccountSection account={selectPair.account} />}
            {selectPair.memo && <MemoSection memo={selectPair.memo} />}
            {selectPair.address && <AddressSection address={selectPair.address} />}
          </div>
        ) : (
          <p>Please select the crypto token first.</p>
        )}
      </div>
    </Modal>
  );
};

export default Deposit;
