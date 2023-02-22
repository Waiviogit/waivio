import React, { useEffect, useState, useRef } from 'react';
import { useRouteMatch } from 'react-router';
import { isEmpty } from 'lodash';

import { getDepartmentsFeed } from '../../../waivioApi/ApiClient';
import ObjectCardView from '../../objectCard/ObjectCardView';
import EmptyCampaing from '../../statics/EmptyCampaing';
import useQuery from '../../../hooks/useQuery';
import { parseQuery } from '../../../waivioApi/helpers';

import './DepartmentsWobjList.less';

const DepartmentsWobjList = () => {
  const [departmentInfo, setDepartmentInfo] = useState();
  const match = useRouteMatch();
  const query = useQuery();
  const listRef = useRef();

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
    getDepartmentsFeed(match.params.name, match.params.departments, parseQueryForFilters()).then(
      res => {
        setDepartmentInfo(res);
      },
    );
  }, [match.params.departments, query.toString()]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollIntoView();
    }
  }, [listRef.current]);

  return (
    <div className="DepartmentsWobjList">
      <h3>{departmentInfo?.department}</h3>
      {isEmpty(departmentInfo?.wobjects) ? (
        <EmptyCampaing emptyMessage={'There are no objects for this department.'} />
      ) : (
        departmentInfo?.wobjects?.map(wobj => (
          <ObjectCardView key={wobj.author_permlink} wObject={wobj} />
        ))
      )}
    </div>
  );
};

export default DepartmentsWobjList;
