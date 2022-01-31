import React, {useEffect} from 'react';
import { Modal } from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {isEmpty} from "lodash";

import TokensSelect from '../SwapTokens/components/TokensSelect';
import {getWithdrawList} from "../../../store/depositeWithdrawStore/depositWithdrawSelector";
import {getDepositWithdrawPairs, resetSelectPair} from "../../../store/depositeWithdrawStore/depositeWithdrawAction";

const WithdrawModal = () => {
  const withdraList = useSelector(getWithdrawList);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(withdraList)) dispatch(getDepositWithdrawPairs());

    return () => {
      dispatch(resetSelectPair());
    };
  }, []);

  return (
    <Modal visible>
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
          list={withdraList}
          setToken={() => {
          }}
          amount={0}
          handleChangeValue={() => {}}
          token={withdraList[0]}
          handleClickBalance={() => {
          }}
        />
      </div>
    </Modal>
  )
};

export default WithdrawModal;
