import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router';
import { Icon } from 'antd';
import InfiniteSroll from 'react-infinite-scroller';
import Helmet from 'react-helmet';
import { getHelmetIcon, getSiteName } from '../../../store/appStore/appSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import EmptyCampaing from '../../statics/EmptyCampaing';
import Loading from '../../components/Icon/Loading';
import useQuery from '../../../hooks/useQuery';
import { parseQueryForFilters } from '../../../waivioApi/helpers';
import { getActiveBreadCrumb, getExcludedDepartment } from '../../../store/shopStore/shopSelectors';
import {
  getLastPermlinksFromHash,
  getPermlinksFromHash,
} from '../../../common/helpers/wObjectHelper';
import ObjCardListViewSwitcherForShop from '../../social-gifts/ShopObjectCard/ObjCardViewSwitcherForShop';

import './ShopList.less';

const ShopList = ({ userName, path, getShopFeed, isSocial }) => {
  const [departments, setDepartments] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const location = useLocation();
  const match = useRouteMatch();
  const authUser = useSelector(getAuthenticatedUserName);
  const excluded = useSelector(getExcludedDepartment);
  const activeCrumb = useSelector(getActiveBreadCrumb);
  const siteName = useSelector(getSiteName);
  const favicon = useSelector(getHelmetIcon);
  const image = favicon;
  const title = department || 'Shop';
  const canonicalUrl = typeof location !== 'undefined' && location?.origin;
  const pathList = match.params.department
    ? [match.params.department, ...getPermlinksFromHash(location.hash)]
    : [];
  const department = location.hash
    ? getLastPermlinksFromHash(location.hash)
    : match.params.department;

  useEffect(() => {
    if (department === activeCrumb?.name || !department) {
      setLoading(true);
      getShopFeed(
        userName,
        authUser,
        parseQueryForFilters(query),
        match.params.department ? excluded : [],
        match.params.department ? activeCrumb.name : undefined,
        0,
        pathList,
      ).then(res => {
        if (res.message) {
          setLoading(false);
          setDepartments([]);
          setHasMore(false);

          return;
        }

        setDepartments(res.result);
        setHasMore(res.hasMore);
        setLoading(false);
      });
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
      ).then(res => {
        setDepartments([...departments, ...res.result]);
        setHasMore(res.hasMore);
        setLoading(false);
      });
    }
  };

  return (
    <div className="ShopList">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="description" content={title} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@waivio'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={title} />
        <meta name="twitter:image" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={title} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={image} />
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
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
          <div>
            {departments?.map(dep => {
              if (isEmpty(dep.wobjects)) return null;

              return (
                <div key={dep.department} className="ShopList__departments">
                  <Link to={getPath(dep.department)} className="ShopList__departments-title">
                    {dep.department} <Icon size={12} type="right" />
                  </Link>
                  <ObjCardListViewSwitcherForShop isSocial={isSocial} wobjects={dep.wobjects} />
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
