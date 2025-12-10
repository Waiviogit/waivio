import React, { useEffect, useState } from 'react';
import { isEmpty, take } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { Tag } from 'antd';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';

import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import EmptyCampaing from '../../statics/EmptyCampaign';
import Loading from '../../components/Icon/Loading';
import useQuery from '../../../hooks/useQuery';
import { parseQueryForFilters } from '../../../waivioApi/helpers';
import {
  getActiveBreadCrumb,
  getExcludedDepartment,
  getShopList,
  getShopListHasMore,
} from '../../../store/shopStore/shopSelectors';
import {
  getLastPermlinksFromHash,
  getPermlinksFromHash,
} from '../../../common/helpers/wObjectHelper';
import { isMobile } from '../../../common/helpers/apiHelpers';
import GoogleAds from '../../adsenseAds/GoogleAds';
import useTemplateProvider, { useTemplateId } from '../../../designTemplates/TemplateProvider';

import './ShopList.less';
import useAdLevelData from '../../../hooks/useAdsense';

const ShopList = ({ userName, path, getShopFeed, isSocial, intl, isRecipe }) => {
  const query = useQuery();
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const match = useRouteMatch();
  const authUser = useSelector(getAuthenticatedUserName);
  const templateComponents = useTemplateProvider();
  const templateId = useTemplateId();
  const ShopListView = templateComponents?.ShopListView;
  const excluded = useSelector(getExcludedDepartment);
  const activeCrumb = useSelector(getActiveBreadCrumb);
  const departments = useSelector(getShopList);
  const hasMore = useSelector(getShopListHasMore);
  const { intensive, moderate } = useAdLevelData();
  const emptySocialMessage = isRecipe
    ? 'There are no recipes.'
    : 'This shop does not have any products.';

  const activeFilters = parseQueryForFilters(query);

  const pathList = match.params.department
    ? [match.params.department, ...getPermlinksFromHash(location.hash)]
    : [];

  const department = location.hash
    ? getLastPermlinksFromHash(location.hash)
    : match.params.department;

  useEffect(() => {
    setLoading(true);
    if (department === activeCrumb?.name || !department) {
      getShopFeed(
        userName,
        authUser,
        parseQueryForFilters(query),
        match.params.department ? excluded : [],
        match.params.department ? activeCrumb.name : undefined,
        0,
        pathList,
        10,
        isSocial ? 5 : 3,
      ).then(() => setLoading(false));
    }
  }, [query.toString(), activeCrumb, match.params.name, match.params.department]);

  const getPath = name => {
    if (match.params.department && match.params.department !== name) {
      return location.hash ? `${location.hash}/${name}` : `#${name}`;
    }

    return `${path}/${name}`;
  };

  const loadMore = () => {
    if (department === activeCrumb?.name || !department) {
      getShopFeed(
        userName,
        authUser,
        parseQueryForFilters(query),
        match.params.department ? excluded : [],
        match.params.department ? activeCrumb?.name : undefined,
        departments.length,
        pathList,
        10,
        isSocial ? 5 : 3,
        true,
      );
    }
  };

  const handleRemoveTag = (categoryName, tag) => {
    const currentTags = query.get(categoryName)?.split(',') || [];
    const filteredTags = currentTags.filter(t => t !== tag);

    if (isEmpty(filteredTags)) {
      query.delete(categoryName);
    } else {
      query.set(categoryName, filteredTags.join(','));
    }

    history.push(`?${query.toString()}${location.hash}`);
  };

  if (loading) return <Loading />;

  const hasActiveTags = query.toString().length > 0;

  if (!ShopListView) {
    return null;
  }

  const isCleanTemplate = templateId === 'clean';
  const containerClassName = isCleanTemplate ? 'ShopListClean' : 'ShopList';

  return (
    <div className={containerClassName}>
      {hasActiveTags && !isMobile() && (
        <div className="ShopList__tags">
          {activeFilters.tagCategory.map(category =>
            category.tags.map(tag => (
              <Tag
                key={`${category.categoryName}-${tag}`}
                closable
                onClose={() => handleRemoveTag(category.categoryName, tag)}
              >
                {tag}
              </Tag>
            )),
          )}
        </div>
      )}
      {isEmpty(departments) || departments?.every(dep => isEmpty(dep.wobjects)) ? (
        <EmptyCampaing
          emptyMessage={
            match.params.department
              ? 'There are no products available in this department.'
              : emptySocialMessage
          }
        />
      ) : (
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMore}
          loader={<Loading />}
          initialLoad={false}
          useWindow={!isMobile()}
        >
          <div
            className={classNames('ShopList__departments-wrapper', {
              'ShopList__departments--isSocial': isSocial,
              'ShopList__departments--hasQuery': hasActiveTags,
            })}
          >
            {departments?.map((dep, index) => {
              if (isEmpty(dep.wobjects)) return null;

              const injectAd = intensive || (moderate && index % 2 === 0);
              const originalWobjects = isMobile() ? take(dep.wobjects, 4) : dep.wobjects;

              const wobjectsWithAd = (() => {
                if (!injectAd || isEmpty(originalWobjects)) return originalWobjects;

                const alreadyHasAd = originalWobjects.some(
                  item => React.isValidElement(item) && item.type === GoogleAds,
                );

                if (alreadyHasAd) return originalWobjects;

                const copy = [...originalWobjects];
                const adIndex = Math.floor(Math.random() * Math.min(5, copy.length + 1));

                copy.splice(
                  adIndex,
                  0,
                  <GoogleAds key={`ad-${dep.department}-${adIndex}`} inShop />,
                );

                return copy;
              })();

              return (
                <ShopListView
                  key={dep.department}
                  dep={dep}
                  getPath={getPath}
                  isSocial={isSocial}
                  wobjectsWithAd={wobjectsWithAd}
                  intl={intl}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

ShopList.propTypes = {
  userName: PropTypes.string,
  path: PropTypes.string,
  getShopFeed: PropTypes.func,
  isSocial: PropTypes.bool,
  isRecipe: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ShopList);
