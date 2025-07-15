import React, { useEffect, useState } from 'react';
import { isEmpty, take } from 'lodash';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router';
import { Icon } from 'antd';
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
import ObjCardListViewSwitcherForShop from '../../social-gifts/ShopObjectCard/ObjCardViewSwitcherForShop';
import { isMobile } from '../../../common/helpers/apiHelpers';
import GoogleAds from '../../adsenseAds/GoogleAds';

import './ShopList.less';
import useAdLevelData from '../../../hooks/useAdsense';

const ShopList = ({ userName, path, getShopFeed, isSocial, intl, isRecipe }) => {
  const query = useQuery();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const match = useRouteMatch();
  const authUser = useSelector(getAuthenticatedUserName);
  const excluded = useSelector(getExcludedDepartment);
  const activeCrumb = useSelector(getActiveBreadCrumb);
  const departments = useSelector(getShopList);
  const hasMore = useSelector(getShopListHasMore);
  const { intensive, moderate } = useAdLevelData();
  const emptySocialMessage = isRecipe
    ? 'There are no recipes.'
    : 'This shop does not have any products.';

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

  if (loading) return <Loading />;

  return (
    <div className="ShopList">
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
            className={classNames('ShopList__departments', {
              'ShopList__departments--isSocial': isSocial,
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
                <div key={dep.department} className="ShopList__departments">
                  <Link to={getPath(dep.department)} className="ShopList__departments-title">
                    {dep.department} <Icon size={12} type="right" />
                  </Link>
                  <ObjCardListViewSwitcherForShop isSocial={isSocial} wobjects={wobjectsWithAd} />
                  {dep.hasMore && (
                    <Link className="ShopList__showMore" to={getPath(dep.department)}>
                      {intl.formatMessage({ id: 'show_more', defaultMessage: 'Show more' })}{' '}
                      {dep.department}
                    </Link>
                  )}
                </div>
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
