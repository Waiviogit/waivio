import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import Helmet from 'react-helmet';
import InfiniteSroll from 'react-infinite-scroller';
import { Tag } from 'antd';
import { uniqBy } from 'lodash';

import { getHelmetIcon } from '../../../store/appStore/appSelectors';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import Loading from '../../components/Icon/Loading';
import useQuery from '../../../hooks/useQuery';
import { getObjectType } from '../../../waivioApi/ApiClient';
import { getLocale } from '../../../store/settingsStore/settingsSelectors';

import './NewDiscover.less';
import { useSeoInfo } from '../../../hooks/useSeoInfo';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const wobjects_count = 20;

const NewDiscover = () => {
  const { type } = useParams();
  const favicon = useSelector(getHelmetIcon);
  const locale = useSelector(getLocale);
  const userName = useSelector(getAuthenticatedUserName);
  const history = useHistory();
  const query = useQuery();
  const [objects, setObjects] = useState([]);
  const [hasMoreObjects, setHasMoreObjects] = useState();
  const [loading, setLoading] = useState(true);
  const search = query.get('search')?.replaceAll('%26%', '&');

  const desc = 'All objects are located here. Discover new objects!';
  const image =
    'https://images.hive.blog/p/DogN7fF3oJDSFnVMQK19qE7K3somrX2dTE7F3viyR7zVngPPv827QvEAy1h8dJVrY1Pa5KJWZrwXeHPHqzW6dL9AG9fWHRaRVeY8B4YZh4QrcaPRHtAtYLGebHH7zUL9jyKqZ6NyLgCk3FRecMX7daQ96Zpjc86N6DUQrX18jSRqjSKZgaj2wVpnJ82x7nSGm5mmjSih5Xf71?format=match&mode=fit&width=800&height=600';
  const { canonicalUrl } = useSeoInfo();
  const title = 'Discover - Waivio';

  useEffect(() => {
    const ac = new AbortController();
    const requestData = {
      locale,
      userName,
      wobjects_count,
    };

    setLoading(true);

    if (search)
      requestData.filter = {
        searchString: search,
      };

    getObjectType(type, requestData, ac).then(res => {
      setObjects(uniqBy(res?.related_wobjects, 'author_permlink'));
      setHasMoreObjects(res?.hasMoreWobjects);
      setLoading(false);
    });

    return () => ac.abort();
  }, [search, type]);

  const loadMore = () => {
    const requestData = {
      locale,
      wobjects_skip: objects?.length,
      wobjects_count,
    };

    if (search)
      requestData.filter = {
        searchString: search,
      };

    getObjectType(type, requestData).then(res => {
      setObjects([...objects, ...res?.related_wobjects]);
      setHasMoreObjects(res?.hasMoreWobjects);
    });
  };

  const handleDeleteTag = () => {
    history.push(`/discover-objects/${type}`);
    setObjects([]);
    setHasMoreObjects(false);
    setLoading(true);
  };

  return (
    <div className="NewDiscover">
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
      <div className="NewDiscover__wrap">
        <h3 className="NewDiscover__type">{type}</h3>
        {search && (
          <Tag closable onClose={handleDeleteTag}>
            {search}
          </Tag>
        )}
      </div>
      {loading ? (
        <Loading />
      ) : (
        <InfiniteSroll hasMore={hasMoreObjects} loader={<Loading />} loadMore={loadMore}>
          <div className="NewDiscover__list" key={'list'}>
            {objects?.map(obj => (
              <ShopObjectCard key={obj?.author_permlink} wObject={obj} />
            ))}{' '}
          </div>
        </InfiniteSroll>
      )}
    </div>
  );
};

export default NewDiscover;
