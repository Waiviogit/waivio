import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Manage } from './Manage';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import GuideBalance from './GuideBalance';
import HistoryCampaing from './HistoryCampaing';

import './ManageCampaingsTab.less';

const ManageCampaingsTab = ({ intl }) => {
  const guideName = useSelector(getAuthenticatedUserName);
  const [historyLoading, setHistoryLoading] = useState(true);

  return (
    <div className={'ManageCampaingsTab'}>
      <GuideBalance guideName={guideName} />
      <Manage guideName={guideName} intl={intl} setHistoryLoading={setHistoryLoading} />
      <Link className={'ManageCampaingsTab__create'} to={'/rewards/create'}>
        Create new campaing
      </Link>
      <HistoryCampaing
        guideName={guideName}
        setLoading={setHistoryLoading}
        loading={historyLoading}
      />
    </div>
  );
};

ManageCampaingsTab.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default injectIntl(ManageCampaingsTab);
