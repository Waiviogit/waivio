import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getCampaingBalanceList } from '../../../waivioApi/ApiClient';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import { configGuideBalanceTableHeader } from '../constants/balanceTableConfig';

const GuideBalance = ({ guideName }) => {
  const [balanceList, setBalanceList] = useState();

  useEffect(() => {
    getCampaingBalanceList(guideName).then(res => {
      setBalanceList(res);
    });
  }, []);

  return (
    <div>
      <h2>Account balance (WAIV)</h2>
      <DynamicTbl header={configGuideBalanceTableHeader} bodyConfig={[balanceList]} />
      <p>* All campaigns will be suspended if accounts payable exceed 30 days</p>
    </div>
  );
};

GuideBalance.propTypes = {
  guideName: PropTypes.string.isRequired,
};

export default GuideBalance;
