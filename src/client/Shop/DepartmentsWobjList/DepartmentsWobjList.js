import React, { useEffect, useRef, useState } from 'react';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import InfiniteSroll from 'react-infinite-scroller';
import { useLocation, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import ObjectCardView from '../../objectCard/ObjectCardView';
import EmptyCampaing from '../../statics/EmptyCampaing';
import useQuery from '../../../hooks/useQuery';
import { parseQueryForFilters } from '../../../waivioApi/helpers';
import { isMobile } from '../../../common/helpers/apiHelpers';
import Loading from '../../components/Icon/Loading';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import {
  getLastPermlinksFromHash,
  getPermlinksFromHash,
} from '../../../common/helpers/wObjectHelper';

import './DepartmentsWobjList.less';

const DepartmentsWobjList = ({ getDepartmentsFeed, user }) => {
  const [departmentInfo, setDepartmentInfo] = useState();
  const [loading, setLoading] = useState(true);
  const authUser = useSelector(getAuthenticatedUserName);

  const match = useRouteMatch();
  const location = useLocation();
  const query = useQuery();
  const list = useRef();
  const path = match.params.department
    ? [match.params.department, ...getPermlinksFromHash(location.hash)]
    : [];

  const department = location.hash
    ? getLastPermlinksFromHash(location.hash).replaceAll('%20', ' ')
    : match.params.department;

  useEffect(() => {
    getDepartmentsFeed(user, authUser, department, parseQueryForFilters(query), path, 0).then(
      res => {
        setDepartmentInfo(res);
        setLoading(false);
      },
    );

    if (!isMobile()) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [match.params.department, match.params.name, query.toString(), location.hash]);

  useEffect(() => {
    if (list.current && isMobile() && !loading) {
      const listRef = document.querySelector('.UserHeader');

      window.scrollTo({ top: listRef?.offsetHeight || 0, behavior: 'smooth' });
    }
  }, [list.current, loading, department]);

  if (loading) return <Loading />;

  const loadMore = () => {
    getDepartmentsFeed(
      user,
      authUser,
      department,
      parseQueryForFilters(query),
      path,
      departmentInfo.wobjects.length,
      10,
    ).then(res => {
      setDepartmentInfo({
        wobjects: [...departmentInfo.wobjects, ...res?.wobjects],
        hasMore: res?.hasMore,
      });
      setLoading(false);
    });
  };

  return (
    <div className="DepartmentsWobjList" ref={list} id={'DepartmentsWobjList'}>
      {isEmpty(departmentInfo?.wobjects) ? (
        <EmptyCampaing emptyMessage={'There are no products available in this department.'} />
      ) : (
        <InfiniteSroll loadMore={loadMore} hasMore={departmentInfo.hasMore}>
          {departmentInfo?.wobjects?.map(wobj => (
            <ObjectCardView key={wobj.author_permlink} wObject={wobj} />
          ))}
        </InfiniteSroll>
      )}
    </div>
  );
};

DepartmentsWobjList.propTypes = {
  getDepartmentsFeed: PropTypes.func,
  user: PropTypes.string,
};

export default DepartmentsWobjList;
