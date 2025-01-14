import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Tag } from 'antd';

import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverContent from './DiscoverContent';
import Affix from '../components/Utils/Affix';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import { resetSearchUsersForDiscoverPage } from '../../store/searchStore/searchActions';
import { PATH_NAME_DISCOVER } from '../../common/constants/rewards';
import { getHelmetIcon } from '../../store/appStore/appSelectors';
import { useSeoInfo } from '../../hooks/useSeoInfo';

import './Discover.less';

const Discover = ({ match, history }) => {
  const dispatch = useDispatch();
  const favicon = useSelector(getHelmetIcon);
  const desc = 'All users are located here. Discover new users!';
  const image =
    'https://images.hive.blog/p/DogN7fF3oJDSFnVMQK19qE7K3somrX2dTE7F3viyR7zVngPPv827QvEAy1h8dJVrY1Pa5KJWZrwXeHPHqzW6dL9AG9fWHRaRVeY8B4YZh4QrcaPRHtAtYLGebHH7zUL9jyKqZ6NyLgCk3FRecMX7daQ96Zpjc86N6DUQrX18jSRqjSKZgaj2wVpnJ82x7nSGm5mmjSih5Xf71?format=match&mode=fit&width=800&height=600';
  const { canonicalUrl } = useSeoInfo();
  const title = 'Discover - Waivio';

  const handleDeleteTag = () => {
    history.push(PATH_NAME_DISCOVER);
    dispatch(resetSearchUsersForDiscoverPage());
  };

  return (
    <div className="shifted">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@waivio'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content="Waivio" />
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <div className="container settings-layout">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <div className="center">
          {match.params.search && (
            <div className="Objects__tags">
              <Tag closable onClose={handleDeleteTag}>
                {match.params.search}
              </Tag>
            </div>
          )}
          <MobileNavigation />
          <div className={match.params.search ? '' : 'Objects__content'}>
            <DiscoverContent searchString={match.params.search} />
          </div>
        </div>
      </div>
    </div>
  );
};

Discover.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      search: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape().isRequired,
};

// Discover.fetchData = ({ store, match }) => {
//
// }

export default Discover;
