import React from 'react';
import { Modal } from 'antd';
import TokensSelect from '../SwapTokens/components/TokensSelect';

const WithdrawModal = () => (
    <Modal>
      <section>
        <p>
          All crypto withdrawals are processed by{' '}
          <a href="https://hive-engine.com/">Hive-Engine.com</a>.
        </p>
        <p>There is a 1% fee on withdrawals.</p>
        <p>
          Please note that standard network transfer fees will also be subtracted from the amount.
        </p>
      </section>
      <div>
        <h3 className="SwapTokens__title">Withdraw:</h3>
        <TokensSelect
          list={[]}
          setToken={() => {}}
          inputWrapClassList={'inputWrapClassList'}
          amount={0}
          handleChangeValue={() => {}}
          token={{}}
          handleClickBalance={() => {}}
        />
      </div>
    </Modal>
  );

export default WithdrawModal;
