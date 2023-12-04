import React, { useEffect, useState } from 'react';
import { isEmpty, take } from 'lodash';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router';
import { Icon } from 'antd';
import classNames from 'classnames';
import InfiniteSroll from 'react-infinite-scroller';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import EmptyCampaing from '../../statics/EmptyCampaing';
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

import './ShopList.less';

const ShopList = ({ userName, path, getShopFeed, isSocial }) => {
  const query = useQuery();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const match = useRouteMatch();
  const authUser = useSelector(getAuthenticatedUserName);
  const excluded = useSelector(getExcludedDepartment);
  const activeCrumb = useSelector(getActiveBreadCrumb);
  const departments = useSelector(getShopList);
  const hasMore = useSelector(getShopListHasMore);
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

  if (loading) return <Loading />;

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

  return (
    <div className="ShopList">
      {isEmpty(departments) || departments?.every(dep => isEmpty(dep.wobjects)) ? (
        <EmptyCampaing
          emptyMessage={
            match.params.department
              ? 'There are no products available in this department.'
              : 'This shop does not have any products.'
          }
        />
      ) : (
        <InfiniteSroll loadMore={loadMore} hasMore={hasMore} loader={<Loading />}>
          <div
            className={classNames('ShopList__departments', {
              'ShopList__departments--isSocial': isSocial,
            })}
          >
            {departments?.map(dep => {
              if (isEmpty(dep.wobjects)) return null;

              return (
                <div key={dep.department} className="ShopList__departments">
                  <Link to={getPath(dep.department)} className="ShopList__departments-title">
                    {dep.department} <Icon size={12} type="right" />
                  </Link>
                  <ObjCardListViewSwitcherForShop
                    isSocial={isSocial}
                    wobjects={isMobile() ? take(dep.wobjects, 3) : dep.wobjects}
                  />
                  {dep.hasMore && (
                    <Link className="ShopList__showMore" to={getPath(dep.department)}>
                      Show more {dep.department}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </InfiniteSroll>
      )}
    </div>
  );
};

ShopList.propTypes = {
  userName: PropTypes.string,
  path: PropTypes.string,
  getShopFeed: PropTypes.func,
  isSocial: PropTypes.bool,
};

export default ShopList;
