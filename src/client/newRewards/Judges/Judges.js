import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getJudgeRewardsMain } from '../../../waivioApi/ApiClient';
import Campaing from '../reuseble/Campaing';

// const filterConfig = [
//   { title: 'Sponsors', type: 'sponsors' },
// ];
const Judges = () => {
  const [campaigns, setCampaigns] = useState([]);
  // const [hasCampaigns, setHasCampaigns] = useState([]);
  const authUserName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    getJudgeRewardsMain(authUserName).then(res => {
      setCampaigns(res?.rewards);
      // setHasCampaigns(res?.hasMore)
    });
  }, []);

  return (
    <div>
      <div className={'PropositionList__breadcrumbs'}>Judges</div>
      <br />
      <p>You have been selected as a judge for these campaigns.</p>
      {campaigns?.map(cap => (
        <Campaing
          key={cap?.guideName + cap?.lastCreated}
          campain={{ ...cap, rewardInUSD: cap?.rewardInUSD || cap?.payout }}
        />
      ))}
      {/* <RewardsFilters */}
      {/*   onClose={() => setVisible(false)} */}
      {/*   visible={visible} */}
      {/*   config={filterConfig} */}
      {/*   getFilters={getFilters} */}
      {/*   onlyOne */}
      {/* /> */}
    </div>
  );
};

export default Judges;
