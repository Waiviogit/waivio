import React from 'react';
import { Modal, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getDepositVisible } from '../../../store/walletStore/walletSelectors';
import { toggleDepositModal } from '../../../store/walletStore/walletActions';

const Deposit = () => {
  const visible = useSelector(getDepositVisible);
  const dispatch = useDispatch();
  const handleCloseModal = () => dispatch(toggleDepositModal);

  return (
    <Modal visible={visible} okText="Done" title="Deposit" onCancel={handleCloseModal}>
      <div>
        <p>
          All crypto deposits are processed by{' '}
          <a href="https://hive-engine.com/">Hive-Engine.com</a>. Once the deposit is made, you will
          receive an equal amount of the SWAP version of the deposited token, which can be exchanged
          for other tokens on the Hive-Engine blockchain.
        </p>
        <p>
          There is a 1% fee on deposits. ETH, ERC-20, BNB, BEP-20, Polygon (MATIC) and Polygon
          ERC-20 deposits have no deposit fees.
        </p>
        <p>
          Please note that you will also have to pay standard network fees when sending cryptos.
        </p>
      </div>
      <div>
        <h4>Step 1</h4>
        <p>Select the crypto token to deposit:</p>
        <Select>
          <Select.Option key={'BTC'}>BTC</Select.Option>
        </Select>
      </div>
      <div>
        <h4>Step 2</h4>
      </div>
    </Modal>
  );
};

export default Deposit;
