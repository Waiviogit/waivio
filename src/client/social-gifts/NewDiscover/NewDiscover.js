import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from 'react-router';
import Helmet from 'react-helmet';
import InfiniteSroll from 'react-infinite-scroller';
import { Tag } from 'antd';
import { isEmpty } from 'lodash';

import { getHelmetIcon, getAppHost, getSiteName } from '../../../store/appStore/appSelectors';
import {
  getObjectsTypeByTypesName,
  getObjectsTypeByTypesNameMore,
  resetObjects,
  getTagCategories,
  setActiveTagsFilters,
} from '../../../store/objectTypeStore/objectTypeActions';
import {
  getWobjectsList,
  getWobjectsHasMore,
  getActiveFilters,
  getActiveFiltersTags,
  getTagCategories as getTagCategoriesSelector,
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
import { createFilterBody, updateActiveTagsFilters } from '../../discoverObjects/helper';
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
  const host = useSelector(getAppHost);
  const query = useQuery();
  const dispatch = useDispatch();
  const objects = useSelector(getWobjectsList);
  const hasMoreObjects = useSelector(getWobjectsHasMore);
  const activeFilters = useSelector(getActiveFilters);
  const activeTagsFilters = useSelector(getActiveFiltersTags);
  const tagCategories = useSelector(getTagCategoriesSelector);
  const [loading, setLoading] = useState(false);
  const [previousTagTitle, setPreviousTagTitle] = useState(null);
  const search = query.get('search')?.replaceAll('%26%', '&');
  const tag = query.get('tag')?.replaceAll('%26%', '&');
  const category = query.get('category')?.replaceAll('%26%', '&');
  const discoverUsers = match.url?.includes('discover-users');
  const desc = 'All objects are located here. Discover new objects!';
  const image =
    'https://images.hive.blog/p/DogN7fF3oJDSFnVMQK19qE7K3somrX2dTE7F3viyR7zVngPPv827QvEAy1h8dJVrY1Pa5KJWZrwXeHPHqzW6dL9AG9fWHRaRVeY8B4YZh4QrcaPRHtAtYLGebHH7zUL9jyKqZ6NyLgCk3FRecMX7daQ96Zpjc86N6DUQrX18jSRqjSKZgaj2wVpnJ82x7nSGm5mmjSih5Xf71?format=match&mode=fit&width=800&height=600';
  const { canonicalUrl } = useSeoInfo();
  const canonical = `https://${host}${canonicalUrl}?${query?.toString() || ''}`;
  const siteName = useSelector(getSiteName);

  const title = 'Discover - Waivio';
  const tagTitle = search || `${category}: ${tag}`;
  const hasTag = (category && tag) || search;

  const displayTagTitle = loading && previousTagTitle && !hasTag ? previousTagTitle : tagTitle;
  const displayHasTag = (loading && previousTagTitle && !hasTag) || hasTag;

  useEffect(() => {
    if (!discoverUsers && type) {
      dispatch(getTagCategories(type));
    }
  }, [type, discoverUsers]);

  // Sync URL tag/category with activeTagsFilters to keep sidebar filters in sync
  useEffect(() => {
    if (!discoverUsers && type && tag && category && tagCategories && tagCategories.length > 0) {
      // Find the exact category name from tagCategories (handles case sensitivity and formatting)
      const matchedCategory = tagCategories.find(cat => {
        const catName = typeof cat === 'object' ? cat.tagCategory : cat;

        return catName === category || catName?.toLowerCase() === category?.toLowerCase();
      });

      if (matchedCategory) {
        const categoryName =
          typeof matchedCategory === 'object' ? matchedCategory.tagCategory : matchedCategory;
        // Convert category name to the format used in activeTagsFilters (spaces become %20)
        const categoryKey = categoryName.replace(' ', '%20');
        const currentTagFilters = activeTagsFilters[categoryKey] || [];

        // Only update if the tag is not already in the filters
        if (!currentTagFilters.includes(tag)) {
          const updatedFilters = updateActiveTagsFilters(
            activeTagsFilters,
            tag,
            categoryName,
            true,
          );

          dispatch(setActiveTagsFilters(updatedFilters));
        }
      }
    }
  }, [tag, category, type, discoverUsers, dispatch, tagCategories]);

  useEffect(() => {
    const ac = new AbortController();

    if (!discoverUsers && type) {
      setLoading(true);
      dispatch(resetObjects());

      const filter = { ...activeFilters };

      if (search) filter.searchString = search;
      if (tag && category) {
        filter.tagCategory = [
          {
            categoryName: category,
            tags: [tag],
          },
        ];
      } else {
        const tagCategoryBody = createFilterBody(activeTagsFilters);

        if (tagCategoryBody && tagCategoryBody.length > 0) {
          filter.tagCategory = tagCategoryBody;
        }
      }

      dispatch(getObjectsTypeByTypesName(type, filter, wobjects_count, ac)).then(() => {
        setLoading(false);
        // Clear previousTagTitle when loading is complete and there's no tag
        if (!hasTag) {
          setPreviousTagTitle(null);
        }
      });
    }

    return () => ac.abort();
  }, [
    search,
    type,
    user,
    tag,
    category,
    activeFilters,
    activeTagsFilters,
    dispatch,
    discoverUsers,
    hasTag,
  ]);

  const loadMore = () => {
    const filter = { ...activeFilters };

    if (search) filter.searchString = search;

    if (tag && category) {
      filter.tagCategory = [
        {
          categoryName: category,
          tags: [tag],
        },
      ];
    } else {
      const tagCategoryBody = createFilterBody(activeTagsFilters);

      if (tagCategoryBody && tagCategoryBody.length > 0) {
        filter.tagCategory = tagCategoryBody;
      }
    }

    const skip = objects?.length || 0;

    dispatch(getObjectsTypeByTypesNameMore(type, filter, wobjects_count, skip, filter.tagCategory));
  };

  const handleDeleteTag = () => {
    if (discoverUsers) {
      history.push(`/discover-users`);
      // setLoading(true);
    } else {
      // Preserve the current tagTitle before deletion
      if (tagTitle) {
        setPreviousTagTitle(tagTitle);
      }
      dispatch(setActiveTagsFilters({}));
      history.push(`/discover-objects/${type}`);
    }
  };
  const fetcher = async (users, authUser, sort, skip) => {
    const response = await searchUsers(user, userName, limit, !isGuest, skip);
    const newUsers = response.users.map(u => ({ ...u, name: u.account }));

    setLoading(false);

    return { users: newUsers, hasMore: response.hasMore };
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (discoverUsers) {
      return (
        <div className=" new-discover-content-margin">
          <UserDynamicList hideSort limit={limit} fetcher={fetcher} searchLine={user} />
        </div>
      );
    }

    if (isEmpty(objects)) {
      return <EmptyCampaing emptyMessage={'No results were found for your filters'} />;
    }

    return (
      <InfiniteSroll hasMore={hasMoreObjects} loader={<Loading />} loadMore={loadMore}>
        <div className="NewDiscover__list" key={'list'}>
          {objects?.map(obj => (
            <ShopObjectCard key={obj?.author_permlink} wObject={obj} />
          ))}{' '}
        </div>
      </InfiniteSroll>
    );
  };

  return (
    <div className="NewDiscover">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonical} />
        <meta name="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={`@${siteName}`} />
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
        <meta property="og:site_name" content={siteName} />
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
            className={`NewDiscover__wrap ${discoverUsers ? ' new-discover-content-margin' : ''}`}
          >
            <h3 className="NewDiscover__type">{discoverUsers ? 'Users' : type}</h3>
            {(discoverUsers ? user : displayHasTag) && (
              <Tag closable onClose={handleDeleteTag}>
                {discoverUsers ? user : displayTagTitle}
              </Tag>
            )}
          </div>
          {renderContent()}
        </div>
      </div>
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
