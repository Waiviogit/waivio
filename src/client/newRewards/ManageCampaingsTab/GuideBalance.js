import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { getCampaingBalanceList } from '../../../waivioApi/ApiClient';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import { configGuideBalanceTableHeader } from '../constants/balanceTableConfig';

const GuideBalance = ({ guideName, intl }) => {
  const [balanceList, setBalanceList] = useState();

  useEffect(() => {
    getCampaingBalanceList(guideName).then(res => {
      setBalanceList(res);
    });
  }, []);

  return (
    <div>
      <h2>
        {intl.formatMessage({ id: 'account_balance', defaultMessage: 'Account balance' })} (WAIV)
      </h2>
      <DynamicTbl header={configGuideBalanceTableHeader} bodyConfig={[balanceList]} />
      <p>
        *{' '}
        {intl.formatMessage({
          id: 'note_all_campaign_suspended',
          defaultMessage: 'All campaigns will be suspended if accounts payable exceed 30 days',
        })}
      </p>
    </div>
  );
};

GuideBalance.propTypes = {
  guideName: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default injectIntl(GuideBalance);
