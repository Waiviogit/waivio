import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';
import { getActiveCampaign } from '../../../store/activeCampaign/activeCampaignActions';
import {
  getSelectActiveCampaigns,
  getSelectActiveCampaignHasMore,
  getSelectIsLoadingActiveCampaigns,
} from '../../../store/activeCampaign/activeCampaignSelectors';
import ActiveCampaignContent from './ActiveCampaignContent';

import './ActiveCampaignList.less';

const tabs = ['all', 'product', 'business', 'restaurant', 'recipe'];

const ActiveCampaignList = ({ intl }) => {
  const dispatch = useDispatch();
  const activeCampaigns = useSelector(getSelectActiveCampaigns);
  const hasMore = useSelector(getSelectActiveCampaignHasMore);
  const isLoading = useSelector(getSelectIsLoadingActiveCampaigns);
  const { objectType } = useParams();
  const match = useRouteMatch();

  useEffect(() => {
    dispatch(getActiveCampaign({ objectType, skip: 0, limit: 15 }));
  }, [objectType]);

  const loadMore = () => {
    if (!isLoading)
      dispatch(getActiveCampaign({ objectType, skip: activeCampaigns.length, limit: 15 }));
  };

  return (
    <div className={'ActiveCampaignList'}>
      <div className={'ActiveCampaignList__linksList'}>
        {tabs.map(tab => {
          const isAll = tab === 'all';

          return (
            <NavLink
              key={tab}
              isActive={() =>
                isAll
                  ? match.url === `/active-campaigns`
                  : match?.url === `/active-campaigns/${tab}`
              }
              activeClassName="ActiveCampaignList__link--active"
              to={isAll ? '/active-campaigns' : `/active-campaigns/${tab}`}
            >
              {intl.formatMessage({ id: `activeCampaigns_${tab}` })}
            </NavLink>
          );
        })}
      </div>
      <ActiveCampaignContent
        isLoading={isLoading}
        activeCampaigns={activeCampaigns}
        loadMore={loadMore}
        hasMore={hasMore}
      />
    </div>
  );
};

ActiveCampaignList.fetchData = ({ store, match }) => {
  const { objectType } = match.params;

  return store.dispatch(getActiveCampaign({ objectType, skip: 0, limit: 15 }));
};

ActiveCampaignList.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

export default injectIntl(ActiveCampaignList);
