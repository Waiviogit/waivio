import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router';
import Helmet from 'react-helmet';
import InfiniteScroll from 'react-infinite-scroller';
import { Modal, Tag } from 'antd';
import { isEmpty } from 'lodash';
import { isMobile } from '../../../common/helpers/apiHelpers';

import { getHelmetIcon, getAppHost, getSiteName } from '../../../store/appStore/appSelectors';
import {
  getObjectsTypeByTypesName,
  getObjectsTypeByTypesNameMore,
  resetObjects,
  getTagCategories,
  setTagsFiltersAndLoad,
} from '../../../store/objectTypeStore/objectTypeActions';
import {
  getWobjectsList,
  getWobjectsHasMore,
  getActiveFilters,
  getTagCategories as getTagCategoriesSelector,
} from '../../../store/objectTypeStore/objectTypeSelectors';
import { parseDiscoverQuery, buildCanonicalSearch } from '../../discoverObjects/helper';
import EmptyCampaing from '../../statics/EmptyCampaign';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import Loading from '../../components/Icon/Loading';

import { useSeoInfo } from '../../../hooks/useSeoInfo';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import UserDynamicList from '../../user/UserDynamicList';
import NewDiscoverFilters from './NewDiscoverFilters';
import { searchUsers } from '../../../waivioApi/ApiClient';
import './NewDiscover.less';

const wobjects_count = 20;
const limit = 30;

const NewDiscover = () => {
  const { type, user } = useParams();
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const activeObjectTypeName = match.params.type || match.params.typeName;
  const favicon = useSelector(getHelmetIcon);
  const host = useSelector(getAppHost);
  const siteName = useSelector(getSiteName);
  const isGuest = useSelector(isGuestUser);
  const userName = useSelector(getAuthenticatedUserName);

  const activeFilters = useSelector(getActiveFilters);
  const objects = useSelector(getWobjectsList);
  const hasMoreObjects = useSelector(getWobjectsHasMore);
  const tagCategories = useSelector(getTagCategoriesSelector);

  const [loading, setLoading] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const discoverUsers = match.url?.includes('discover-users');

  const { search, category, tagsByCategory } = useMemo(() => parseDiscoverQuery(location.search), [
    location.search,
  ]);

  const buildFilter = () => {
    const filter = { ...activeFilters };

    if (search) {
      filter.searchString = search;
    }

    const tagCategory = Object.entries(tagsByCategory || {})
      .map(([categoryName, tags]) => ({
        categoryName,
        tags,
      }))
      .filter(item => item.tags?.length);

    if (tagCategory.length) {
      filter.tagCategory = tagCategory;
    }

    return filter;
  };

  useEffect(() => {
    if (!discoverUsers && type) {
      dispatch(getTagCategories(type));
    }
  }, [type, discoverUsers]);

  useEffect(() => {
    if (discoverUsers || !type) return;

    const ac = new AbortController();

    setLoading(true);
    dispatch(resetObjects());

    dispatch(getObjectsTypeByTypesName(type, buildFilter(), wobjects_count, ac)).finally(() =>
      setLoading(false),
    );

    // eslint-disable-next-line consistent-return
    return () => ac.abort();
  }, [location.search, type, discoverUsers]);

  const loadMore = () => {
    const skip = objects?.length || 0;

    dispatch(getObjectsTypeByTypesNameMore(type, buildFilter(), wobjects_count, skip));
  };

  const removeSearch = () => {
    const canonical = buildCanonicalSearch({
      search: '',
      category,
      tagsByCategory,
    });

    dispatch(setTagsFiltersAndLoad(tagsByCategory));
    history.push(`${location.pathname}?${canonical}`);
    // dispatch(getTagCategories(activeObjectTypeName))
  };

  const removeTag = (cat, tag) => {
    const updated = {
      ...tagsByCategory,
      [cat]: tagsByCategory[cat].filter(t => t !== tag),
    };

    if (!updated[cat].length) delete updated[cat];

    const canonical = buildCanonicalSearch({
      search,
      tagsByCategory: updated,
    });

    dispatch(setTagsFiltersAndLoad(updated));
    history.push(`${location.pathname}?${canonical}`);
    // dispatch(getTagCategories(activeObjectTypeName))
  };

  useEffect(() => {
    dispatch(getTagCategories(activeObjectTypeName));
  }, [location.search]);

  const fetcher = async (users, authUser, sort, skip) => {
    const response = await searchUsers(user, userName, limit, !isGuest, skip);

    return {
      users: response.users.map(u => ({ ...u, name: u.account })),
      hasMore: response.hasMore,
    };
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
      <InfiniteScroll hasMore={hasMoreObjects} loadMore={loadMore} loader={<Loading />}>
        <div className="NewDiscover__list">
          {objects.map(obj => (
            <ShopObjectCard key={obj.author_permlink} wObject={obj} />
          ))}
        </div>
      </InfiniteScroll>
    );
  };

  const desc = 'All objects are located here. Discover new objects!';
  const image =
    'https://images.hive.blog/p/DogN7fF3oJDSFnVMQK19qE7K3somrX2dTE7F3viyR7zVngPPv827QvEAy1h8dJVrY1Pa5KJWZrwXeHPHqzW6dL9AG9fWHRaRVeY8B4YZh4QrcaPRHtAtYLGebHH7zUL9jyKqZ6NyLgCk3FRecMX7daQ96Zpjc86N6DUQrX18jSRqjSKZgaj2wVpnJ82x7nSGm5mmjSih5Xf71';
  const { canonicalUrl } = useSeoInfo();
  const canonical = `https://${host}${canonicalUrl}?${location.search.replace('?', '')}`;
  const title = 'Discover - Waivio';

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
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>

      <div className="NewDiscover__container">
        {!discoverUsers && !isMobile() && !isEmpty(tagCategories) && (
          <div className="NewDiscover__sidebar">
            <NewDiscoverFilters />
          </div>
        )}

        <div className="NewDiscover__content">
          {!discoverUsers && isMobile() && (
            <div
              className="NewDiscover__filters-inline"
              role="presentation"
              onClick={() => setIsFiltersModalOpen(true)}
            >
              <span className="NewDiscover__filters-inline-label">Filters:</span>
              <span className="NewDiscover__filters-inline-link">add</span>
            </div>
          )}
          <div className="NewDiscover__wrap">
            <h3 className="NewDiscover__type">{discoverUsers ? 'Users' : type}</h3>

            {search && (
              <Tag closable onClose={removeSearch}>
                Search: {search}
              </Tag>
            )}

            {Object.entries(tagsByCategory).map(([cat, tags]) =>
              tags.map(tag => (
                <Tag key={`${cat}-${tag}`} closable onClose={() => removeTag(cat, tag)}>
                  {`${cat}: ${tag}`}
                </Tag>
              )),
            )}
          </div>

          {renderContent()}
        </div>
      </div>
      <Modal
        className="NewDiscoverFiltersModal"
        title={null}
        footer={null}
        visible={isFiltersModalOpen}
        onCancel={() => setIsFiltersModalOpen(false)}
        destroyOnClose
      >
        <NewDiscoverFilters />
      </Modal>
    </div>
  );
};

export default NewDiscover;
