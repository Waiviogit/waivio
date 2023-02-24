import React, { useEffect, useRef, useState } from 'react';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import InfiniteSroll from 'react-infinite-scroller';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import ObjectCardView from '../../objectCard/ObjectCardView';
import EmptyCampaing from '../../statics/EmptyCampaing';
import useQuery from '../../../hooks/useQuery';
import { parseQuery } from '../../../waivioApi/helpers';
import ShopFilters from '../ShopFilters/ShopFilters';
import FiltersForMobile from '../../newRewards/Filters/FiltersForMobile';
import DepartmentsMobile from '../DepartmentsUser/DepartmentsMobile';
import DepartmentsUser from '../DepartmentsUser/DepartmentsUser';
import { isMobile } from '../../../common/helpers/apiHelpers';
import Loading from '../../components/Icon/Loading';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import './DepartmentsWobjList.less';

const DepartmentsWobjList = ({ getDepartmentsFeed, user }) => {
  const [departmentInfo, setDepartmentInfo] = useState();
  const [visible, setVisible] = useState(false);
  const [visibleNavig, setVisibleNavig] = useState(false);
  const [loading, setLoading] = useState(true);
  const authUser = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const departments = match.params.departments;

  const query = useQuery();
  const list = useRef();
  const parseQueryForFilters = () => {
    const parsedQuery = parseQuery(query.toString());

    return Object.keys(parsedQuery).reduce(
      (acc, curr) => {
        if (curr === 'rating') return { ...acc, rating: +parsedQuery.rating };

        return {
          ...acc,
          tagCategory: [
            ...acc.tagCategory,
            {
              categoryName: curr,
              tags: parsedQuery[curr],
            },
          ],
        };
      },
      { tagCategory: [] },
    );
  };

  useEffect(() => {
    setLoading(true);

    getDepartmentsFeed(user, authUser, departments, parseQueryForFilters()).then(res => {
      setDepartmentInfo(res);
      setLoading(false);
    });
  }, [departments, query.toString()]);

  useEffect(() => {
    if (list.current && isMobile() && !loading) {
      const listRef = document.querySelector('.UserHeader');

      window.scrollTo({ top: listRef?.offsetHeight || 0, behavior: 'smooth' });
    }

    if (!isMobile()) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [list.current, loading, departments]);

  if (loading) return <Loading />;

  const loadMore = () => {
    getDepartmentsFeed(
      user,
      authUser,
      departments,
      parseQueryForFilters(),
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
      <DepartmentsMobile setVisible={() => setVisibleNavig(true)} />
      <FiltersForMobile setVisible={() => setVisible(true)} />
      <h3 className="DepartmentsWobjList__title">{departmentInfo?.department}</h3>
      {isEmpty(departmentInfo?.wobjects) ? (
        <EmptyCampaing emptyMessage={'There are no objects for this department.'} />
      ) : (
        <InfiniteSroll loadMore={loadMore} hasMore={departmentInfo.hasMore}>
          {departmentInfo?.wobjects?.map(wobj => (
            <ObjectCardView key={wobj.author_permlink} wObject={wobj} />
          ))}
        </InfiniteSroll>
      )}
      {visible && <ShopFilters visible={visible} onClose={() => setVisible(false)} />}
      {visibleNavig && (
        <DepartmentsUser visible={visibleNavig} onClose={() => setVisibleNavig(false)} />
      )}
    </div>
  );
};

DepartmentsWobjList.propTypes = {
  getDepartmentsFeed: PropTypes.func,
  user: PropTypes.string,
};

export default DepartmentsWobjList;
