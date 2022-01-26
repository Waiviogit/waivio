import React from 'react';
import { useSelector } from 'react-redux';

import AccountSection from './AccountSection';
import MemoSection from './MemoSection';
import AddressSection from './AddressSection';
import {
  getPairLoading,
  getSelectPair,
} from '../../../../store/depositeWithdrawStore/depositWithdrawSelector';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import Loading from '../../../components/Icon/Loading';

const DepositInfo = () => {
  const selectPair = useSelector(getSelectPair);
  const pairLoading = useSelector(getPairLoading);
  const authUserName = useSelector(getAuthenticatedUserName);

  if (pairLoading) return <Loading />;

  return selectPair ? (
    <div>
      <p>
        Please send any amount of {selectPair.from_coin_symbol} to the following address and you
        will receive an equal amount of {selectPair.to_coin_symbol} in the{' '}
        <a className="Deposit__account-link" href={`/@${authUserName}`}>
          @{authUserName}
        </a>{' '}
        account once the transaction has received the required number of confirmations on the
        external chain.
      </p>
      {selectPair.account && <AccountSection account={selectPair.account} />}
      {selectPair.memo && (
        <MemoSection
          memo={
            typeof selectPair.memo === 'object' ? JSON.stringify(selectPair.memo) : selectPair.memo
          }
        />
      )}
      {selectPair.address && <AddressSection address={selectPair.address} />}
    </div>
  ) : (
    <p>Please select the crypto token first.</p>
  );
};

export default DepositInfo;
