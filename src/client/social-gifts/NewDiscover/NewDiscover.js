import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from 'react-router';
import Helmet from 'react-helmet';
import InfiniteSroll from 'react-infinite-scroller';
import { Tag } from 'antd';

import { getHelmetIcon } from '../../../store/appStore/appSelectors';
import {
  getObjectsTypeByTypesName,
  getObjectsTypeByTypesNameMore,
  resetObjects,
} from '../../../store/objectTypeStore/objectTypeActions';
import {
  getWobjectsList,
  getWobjectsHasMore,
} from '../../../store/objectTypeStore/objectTypeSelectors';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import Loading from '../../components/Icon/Loading';
import useQuery from '../../../hooks/useQuery';
import { searchUsers } from '../../../waivioApi/ApiClient';
import { useSeoInfo } from '../../../hooks/useSeoInfo';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import UserDynamicList from '../../user/UserDynamicList';
import './NewDiscover.less';

const wobjects_count = 20;
const limit = 30;

const NewDiscover = () => {
  const { type, user } = useParams();
  const favicon = useSelector(getHelmetIcon);
  const isGuest = useSelector(isGuestUser);
  const userName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const history = useHistory();
  const query = useQuery();
  const dispatch = useDispatch();
  const objects = useSelector(getWobjectsList);
  const hasMoreObjects = useSelector(getWobjectsHasMore);
  const [loading, setLoading] = useState(false);
  const search = query.get('search')?.replaceAll('%26%', '&');
  const tag = query.get('tag')?.replaceAll('%26%', '&');
  const category = query.get('category')?.replaceAll('%26%', '&');
  const discoverUsers = match.url.includes('discover-users');
  const desc = 'All objects are located here. Discover new objects!';
  const image =
    'https://images.hive.blog/p/DogN7fF3oJDSFnVMQK19qE7K3somrX2dTE7F3viyR7zVngPPv827QvEAy1h8dJVrY1Pa5KJWZrwXeHPHqzW6dL9AG9fWHRaRVeY8B4YZh4QrcaPRHtAtYLGebHH7zUL9jyKqZ6NyLgCk3FRecMX7daQ96Zpjc86N6DUQrX18jSRqjSKZgaj2wVpnJ82x7nSGm5mmjSih5Xf71?format=match&mode=fit&width=800&height=600';
  const { canonicalUrl } = useSeoInfo();
  const canonical = `${canonicalUrl}?${query?.toString() || ''}`;

  const title = 'Discover - Waivio';
  const tagTitle = search || `${category}: ${tag}`;
  const hasTag = (category && tag) || search;

  useEffect(() => {
    const ac = new AbortController();

    if (!discoverUsers) {
      setLoading(true);

      const filter = {};

      if (search) filter.searchString = search;
      if (tag && category) {
        filter.tagCategory = [
          {
            categoryName: category,
            tags: [tag],
          },
        ];
      }

      dispatch(getObjectsTypeByTypesName(type, filter, wobjects_count, ac)).then(() => {
        setLoading(false);
      });
    }

    return () => ac.abort();
  }, [search, type, user, tag, category]);

  const loadMore = () => {
    const filter = {};

    if (search) filter.searchString = search;

    if (tag && category) {
      filter.tagCategory = [
        {
          categoryName: category,
          tags: [tag],
        },
      ];
    }

    dispatch(getObjectsTypeByTypesNameMore(type, filter, 0, wobjects_count, filter.tagCategory));
  };

  const handleDeleteTag = () => {
    if (discoverUsers) {
      history.push(`/discover-users`);
      // setLoading(true);
    } else {
      history.push(`/discover-objects/${type}`);
      dispatch(resetObjects());
      setLoading(true);
    }
  };
  const fetcher = async (users, authUser, sort, skip) => {
    const response = await searchUsers(user, userName, limit, !isGuest, skip);
    const newUsers = response.users.map(u => ({ ...u, name: u.account }));

    setLoading(false);

    return { users: newUsers, hasMore: response.hasMore };
  };

  return (
    <div className="NewDiscover">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonical} />
        <meta name="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@waivio'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content="Waivio" />
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <div className={`NewDiscover__wrap ${discoverUsers ? ' new-discover-content-margin' : ''}`}>
        <h3 className="NewDiscover__type">{discoverUsers ? 'Users' : type}</h3>
        {(discoverUsers ? user : hasTag) && (
          <Tag closable onClose={handleDeleteTag}>
            {discoverUsers ? user : tagTitle}
          </Tag>
        )}
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          {discoverUsers ? (
            <div className=" new-discover-content-margin">
              <UserDynamicList hideSort limit={limit} fetcher={fetcher} searchLine={user} />
            </div>
          ) : (
            <InfiniteSroll hasMore={hasMoreObjects} loader={<Loading />} loadMore={loadMore}>
              <div className="NewDiscover__list" key={'list'}>
                {objects?.map(obj => (
                  <ShopObjectCard key={obj?.author_permlink} wObject={obj} />
                ))}{' '}
              </div>
            </InfiniteSroll>
          )}
        </>
      )}
    </div>
  );
};

NewDiscover.fetchData = ({ match, store, query }) => {
  const { type } = match.params;
  const search = query?.get('search')?.replaceAll('%26%', '&');
  const tag = query?.get('tag')?.replaceAll('%26%', '&');
  const category = query?.get('category')?.replaceAll('%26%', '&');

  const filter = {};

  if (search) filter.searchString = search;

  if (tag && category) {
    filter.tagCategory = [
      {
        categoryName: category,
        tags: [tag],
      },
    ];
  }

  return Promise.allSettled([
    store.dispatch(getObjectsTypeByTypesName(type, filter, 20, wobjects_count, filter.tagCategory)),
  ]);
};

export default NewDiscover;
