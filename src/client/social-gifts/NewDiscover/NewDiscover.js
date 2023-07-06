import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import Helmet from 'react-helmet';
import InfiniteSroll from 'react-infinite-scroller';
import { Tag } from 'antd';
import { trimEnd } from 'lodash';

import { getHelmetIcon } from '../../../store/appStore/appSelectors';
import {
  getObjectTypeByStateFilters,
  setActiveFilters,
} from '../../../store/objectTypeStore/objectTypeActions';
import {
  getFilteredObjects,
  getHasMoreRelatedObjects,
} from '../../../store/objectTypeStore/objectTypeSelectors';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import Loading from '../../components/Icon/Loading';
import { resetSearchUsersForDiscoverPage } from '../../../store/searchStore/searchActions';
import useQuery from '../../../hooks/useQuery';

import './NewDiscover.less';

const NewDiscover = () => {
  const { type } = useParams();
  const dispatch = useDispatch();
  const favicon = useSelector(getHelmetIcon);
  const filteredObjects = useSelector(getFilteredObjects);
  const hasMoreObjects = useSelector(getHasMoreRelatedObjects);
  const history = useHistory();
  const query = useQuery();
  const search = query.get('search');

  const desc = 'All objects are located here. Discover new objects!';
  const image =
    'https://images.hive.blog/p/DogN7fF3oJDSFnVMQK19qE7K3somrX2dTE7F3viyR7zVngPPv827QvEAy1h8dJVrY1Pa5KJWZrwXeHPHqzW6dL9AG9fWHRaRVeY8B4YZh4QrcaPRHtAtYLGebHH7zUL9jyKqZ6NyLgCk3FRecMX7daQ96Zpjc86N6DUQrX18jSRqjSKZgaj2wVpnJ82x7nSGm5mmjSih5Xf71?format=match&mode=fit&width=800&height=600';
  const canonicalUrl = `https://www.waivio.com/discover-objects/${type}`;
  const title = 'Discover - Waivio';

  useEffect(() => {
    const searchFilters = {};

    if (search) searchFilters.searchString = trimEnd(search);

    dispatch(setActiveFilters(searchFilters));
    dispatch(getObjectTypeByStateFilters(type));
  }, [type, search]);

  const loadMore = () => {
    dispatch(getObjectTypeByStateFilters(type, { skip: filteredObjects?.length }));
  };

  const handleDeleteTag = () => {
    history.push(`/discover-objects/${type}`);
    dispatch(resetSearchUsersForDiscoverPage());
  };

  return (
    <div className="NewDiscover">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="description" content={desc} />
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
      <h3 className="NewDiscover__type">{type}</h3>
      {search && (
        <div className="Objects__tags">
          <Tag closable onClose={handleDeleteTag}>
            {search}
          </Tag>
        </div>
      )}
      <InfiniteSroll hasMore={hasMoreObjects} loader={<Loading />} loadMore={loadMore}>
        <div className="NewDiscover__list">
          {filteredObjects?.map(obj => (
            <ShopObjectCard key={obj?.author_permlink} wObject={obj} />
          ))}
        </div>
      </InfiniteSroll>
    </div>
  );
};

export default NewDiscover;
