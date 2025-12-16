import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from 'react-router';
import Helmet from 'react-helmet';
import InfiniteScroll from 'react-infinite-scroller';
import { Tag } from 'antd';
import { isEmpty } from 'lodash';

import { getHelmetIcon, getAppHost, getSiteName } from '../../../store/appStore/appSelectors';
import {
  getObjectsTypeByTypesName,
  getObjectsTypeByTypesNameMore,
  resetObjects,
  getTagCategories,
} from '../../../store/objectTypeStore/objectTypeActions';
import {
  getWobjectsList,
  getWobjectsHasMore,
  getActiveFilters,
} from '../../../store/objectTypeStore/objectTypeSelectors';
import EmptyCampaing from '../../statics/EmptyCampaign';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import Loading from '../../components/Icon/Loading';
import useQuery from '../../../hooks/useQuery';
import { searchUsers } from '../../../waivioApi/ApiClient';
import { useSeoInfo } from '../../../hooks/useSeoInfo';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import UserDynamicList from '../../user/UserDynamicList';
import NewDiscoverFilters from './NewDiscoverFilters';
import './NewDiscover.less';

const wobjects_count = 20;
const limit = 30;

const NewDiscover = () => {
  const { type, user } = useParams();

  const favicon = useSelector(getHelmetIcon);
  const host = useSelector(getAppHost);
  const siteName = useSelector(getSiteName);
  const isGuest = useSelector(isGuestUser);
  const userName = useSelector(getAuthenticatedUserName);
  const activeFilters = useSelector(getActiveFilters);
  const objects = useSelector(getWobjectsList);
  const hasMoreObjects = useSelector(getWobjectsHasMore);

  const match = useRouteMatch();
  const history = useHistory();
  const query = useQuery();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const discoverUsers = match.url?.includes('discover-users');
  const search = query.get('search') || '';

  const queryEntries = [...query.entries()];
  const dynamicEntry = queryEntries.find(([key]) => key !== 'search');

  const category = dynamicEntry?.[0] || null;
  const rawTags = dynamicEntry?.[1] || '';

  const parsedTags = useMemo(() => {
    if (!category || !rawTags) return [];

    return decodeURIComponent(rawTags)
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
  }, [category, rawTags]);

  const desc = 'All objects are located here. Discover new objects!';
  const image =
    'https://images.hive.blog/p/DogN7fF3oJDSFnVMQK19qE7K3somrX2dTE7F3viyR7zVngPPv827QvEAy1h8dJVrY1Pa5KJWZrwXeHPHqzW6dL9AG9fWHRaRVeY8B4YZh4QrcaPRHtAtYLGebHH7zUL9jyKqZ6NyLgCk3FRecMX7daQ96Zpjc86N6DUQrX18jSRqjSKZgaj2wVpnJ82x7nSGm5mmjSih5Xf71?format=match&mode=fit&width=800&height=600';

  const { canonicalUrl } = useSeoInfo();
  const canonical = `https://${host}${canonicalUrl}?${query?.toString() || ''}`;
  const title = 'Discover - Waivio';

  useEffect(() => {
    if (!discoverUsers && type) {
      dispatch(getTagCategories(type));
    }
  }, [type, discoverUsers]);

  useEffect(() => {
    const ac = new AbortController();

    if (!discoverUsers && type) {
      setLoading(true);
      dispatch(resetObjects());

      const filter = { ...activeFilters };

      if (search) {
        filter.searchString = search;
      }

      if (category && parsedTags.length) {
        filter.tagCategory = [
          {
            categoryName: category,
            tags: parsedTags,
          },
        ];
      }

      dispatch(getObjectsTypeByTypesName(type, filter, wobjects_count, ac)).finally(() =>
        setLoading(false),
      );
    }

    return () => ac.abort();
  }, [search, type, category, parsedTags, activeFilters, discoverUsers, dispatch]);

  const loadMore = () => {
    const filter = { ...activeFilters };

    if (search) {
      filter.searchString = search;
    }

    if (category && parsedTags.length) {
      filter.tagCategory = [
        {
          categoryName: category,
          tags: parsedTags,
        },
      ];
    }

    const skip = objects?.length || 0;

    dispatch(getObjectsTypeByTypesNameMore(type, filter, wobjects_count, skip, filter.tagCategory));
  };

  const handleDeleteSingleTag = removedTag => {
    const remainingTags = parsedTags.filter(t => t !== removedTag);

    if (!remainingTags.length) {
      history.push(`/discover-objects/${type}`);

      return;
    }

    history.push(
      `/discover-objects/${type}?${category}=${encodeURIComponent(remainingTags.join(','))}`,
    );
  };

  const fetcher = async (users, authUser, sort, skip) => {
    const response = await searchUsers(user, userName, limit, !isGuest, skip);
    const newUsers = response.users.map(u => ({ ...u, name: u.account }));

    return { users: newUsers, hasMore: response.hasMore };
  };

  const renderContent = () => {
    if (loading) return <Loading />;

    if (discoverUsers) {
      return (
        <div className="new-discover-content-margin">
          <UserDynamicList hideSort limit={limit} fetcher={fetcher} searchLine={user} />
        </div>
      );
    }

    if (isEmpty(objects)) {
      return <EmptyCampaing emptyMessage="No results were found for your filters" />;
    }

    return (
      <InfiniteScroll hasMore={hasMoreObjects} loader={<Loading />} loadMore={loadMore}>
        <div className="NewDiscover__list">
          {objects.map(obj => (
            <ShopObjectCard key={obj?.author_permlink} wObject={obj} />
          ))}
        </div>
      </InfiniteScroll>
    );
  };

  return (
    <div className="NewDiscover">
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
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <div className="NewDiscover__container">
        {!discoverUsers && (
          <div className="NewDiscover__sidebar">
            <NewDiscoverFilters />
          </div>
        )}
        <div className="NewDiscover__content">
          <div
            className={`NewDiscover__wrap ${discoverUsers ? 'new-discover-content-margin' : ''}`}
          >
            <h3 className="NewDiscover__type">{discoverUsers ? 'Users' : type}</h3>

            {!discoverUsers &&
              parsedTags.map(t => (
                <Tag key={`${category}-${t}`} closable onClose={() => handleDeleteSingleTag(t)}>
                  {`${category}: ${t}`}
                </Tag>
              ))}
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

NewDiscover.fetchData = ({ match, store, query }) => {
  const { type } = match.params;
  const filter = {};

  const search = query?.get('search');

  if (search) {
    filter.searchString = search;
  }

  const queryEntries = [...query.entries()];
  const dynamicEntry = queryEntries.find(([key]) => key !== 'search');

  const category = dynamicEntry?.[0];
  const rawTags = dynamicEntry?.[1];

  if (category && rawTags) {
    const tags = decodeURIComponent(rawTags)
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (tags.length) {
      filter.tagCategory = [
        {
          categoryName: category,
          tags,
        },
      ];
    }
  }

  return Promise.allSettled([
    store.dispatch(getObjectsTypeByTypesName(type, filter, 20, wobjects_count, filter.tagCategory)),
  ]);
};

export default NewDiscover;
