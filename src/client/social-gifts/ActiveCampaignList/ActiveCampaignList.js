import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';
import useQuery from '../../../hooks/useQuery';
import {
  getActiveCampaign,
  getActiveCampaignTypes,
} from '../../../store/activeCampaign/activeCampaignActions';
import {
  getSelectActiveCampaigns,
  getSelectActiveCampaignHasMore,
  getSelectIsLoadingActiveCampaigns,
  getSelectActiveCampaignsTypes,
} from '../../../store/activeCampaign/activeCampaignSelectors';
import Loading from '../../components/Icon/Loading';
import ActiveCampaignContent from './ActiveCampaignContent';

import './ActiveCampaignList.less';

const ActiveCampaignList = ({ intl }) => {
  const [pageLaoded, setPageLoaded] = React.useState(false);
  const dispatch = useDispatch();
  const activeCampaigns = useSelector(getSelectActiveCampaigns);
  const hasMore = useSelector(getSelectActiveCampaignHasMore);
  const tabs = useSelector(getSelectActiveCampaignsTypes);
  const isLoading = useSelector(getSelectIsLoadingActiveCampaigns);
  const { objectType } = useParams();
  const match = useRouteMatch();
  const query = useQuery().toString();

  useEffect(() => {
    dispatch(getActiveCampaignTypes()).then(() => {
      setPageLoaded(true);
    });
  }, []);

  useEffect(() => {
    dispatch(getActiveCampaign({ objectType, skip: 0, limit: 15 }));
  }, [objectType]);

  const loadMore = () => {
    if (!isLoading)
      dispatch(getActiveCampaign({ objectType, skip: activeCampaigns.length, limit: 15 }));
  };

  const getLinkUrl = (tab, isAll) => {
    const url = isAll ? `/active-campaigns` : `/active-campaigns/${tab}`;
    const queryString = query ? `?${query}` : '';

    return `${url}${queryString}`;
  };

  return (
    <div className={'ActiveCampaignList'}>
      {pageLaoded ? (
        <React.Fragment>
          <div className={'ActiveCampaignList__linksList'}>
            {['all', ...tabs].map(tab => {
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
                  to={getLinkUrl(tab, isAll)}
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
        </React.Fragment>
      ) : (
        <Loading />
      )}
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
