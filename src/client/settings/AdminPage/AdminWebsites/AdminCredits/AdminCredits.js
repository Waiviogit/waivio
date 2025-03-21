import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CreditsForm from './CreditsForm';
import CreditsModal from './CreditsModal';
import { getCreditsByAdminList } from '../../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../../store/authStore/authSelectors';
import DynamicTbl from '../../../../components/Tools/DynamicTable/DynamicTable';
import { creditsAdminConfig } from '../adminConfig';

const AdminCredits = () => {
  const [showCredits, setShowCredits] = useState(false);
  const [creditsUser, setCreditsUser] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [amount, setAmount] = useState('');
  const [creditsList, setCreditsList] = useState([]);
  const authUserName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    getCreditsByAdminList(authUserName, 0).then(res => {
      setCreditsList(res.result);
      setHasMore(res.hasMore);
    });
  }, []);

  const loadMoreCredits = () => {
    getCreditsByAdminList(authUserName, creditsList?.length).then(res => {
      setCreditsList([...creditsList, ...res.result]);
      setHasMore(res.hasMore);
    });
  };

  return (
    <div>
      <CreditsForm setCreditsUser={setCreditsUser} setShowCredits={setShowCredits} />
      <CreditsModal
        creditsUser={creditsUser}
        setCreditsUser={setCreditsUser}
        setShowCredits={setShowCredits}
        showCredits={showCredits}
        setAmount={setAmount}
        amount={amount}
      />
      <div className={'AdminPage__title-wrap'}>
        <div className={'AdminPage__title'}>Credits History</div>
      </div>
      <DynamicTbl
        handleShowMore={loadMoreCredits}
        showMore={hasMore}
        header={creditsAdminConfig}
        bodyConfig={creditsList}
      />
      <br />
    </div>
  );
};

export default AdminCredits;
