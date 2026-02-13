import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouteMatch, useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import Helmet from 'react-helmet';
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
import { getHelmetIcon, getAppHost, getSiteName } from '../../../store/appStore/appSelectors';
import Loading from '../../components/Icon/Loading';
import ActiveCampaignContent from './ActiveCampaignContent';

import './ActiveCampaignList.less';

const ActiveCampaignList = ({ intl, initialType }) => {
  const [pageLaoded, setPageLoaded] = React.useState(false);
  const dispatch = useDispatch();
  const activeCampaigns = useSelector(getSelectActiveCampaigns);
  const hasMore = useSelector(getSelectActiveCampaignHasMore);
  const tabs = useSelector(getSelectActiveCampaignsTypes);
  const isLoading = useSelector(getSelectIsLoadingActiveCampaigns);
  const favicon = useSelector(getHelmetIcon);
  const host = useSelector(getAppHost);
  const siteName = useSelector(getSiteName);
  const { objectType: type } = useParams();
  const objectType = type || initialType;
  const match = useRouteMatch();
  const location = useLocation();
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

  const title = 'Active Campaigns';
  const desc = 'Discover active campaigns and special offers!';
  const image = favicon;
  const canonical = `https://${host}${location.pathname}${location.search ? location.search : ''}`;

  return (
    <div className={'ActiveCampaignList'}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content={siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      {pageLaoded ? (
        <React.Fragment>
          <div className={'ActiveCampaignList__linksList'}>
            {['all', ...tabs].map(tab => {
              const isAll = tab === 'all';

              return (
                <NavLink
                  key={tab}
                  isActive={() => {
                    if (location.pathname === '/' && initialType) {
                      return tab === initialType;
                    }

                    if (isAll) {
                      return match.url === `/active-campaigns`;
                    }

                    return match?.url === `/active-campaigns/${tab}`;
                  }}
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
  initialType: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

export default injectIntl(ActiveCampaignList);
