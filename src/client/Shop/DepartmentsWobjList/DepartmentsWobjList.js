import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { isEmpty } from 'lodash';

import { getDepartmentsFeed } from '../../../waivioApi/ApiClient';
import ObjectCardView from '../../objectCard/ObjectCardView';
import EmptyCampaing from '../../statics/EmptyCampaing';
import useQuery from '../../../hooks/useQuery';
import { parseQuery } from '../../../waivioApi/helpers';

const DepartmentsWobjList = () => {
  const [departmentInfo, setDepartmentInfo] = useState();
  const match = useRouteMatch();
  const query = useQuery();

  const parseQueryForFilters = () => {
    const parsedQuery = parseQuery(query.toString());

    return Object.keys(parsedQuery).reduce(
      (acc, curr) => {
        if (curr === 'rating') return acc;

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
      { tagCategory: [], rating: parsedQuery.rating },
    );
  };

  useEffect(() => {
    getDepartmentsFeed(match.params.name, match.params.departments, parseQueryForFilters()).then(
      res => {
        setDepartmentInfo(res);
      },
    );
  }, [match.params.departments, query.toString()]);

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
