import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isNil } from 'lodash';
import { useRouteMatch } from 'react-router';
import { FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../../components/Icon/Loading';
import { getObjectsByDepartment } from '../../../waivioApi/ApiClient';
import { getActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsSelectors';
import { setActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsActions';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getAppHost } from '../../../store/appStore/appSelectors';

const limit = 10;

const DepartmentsPage = () => {
  const [hasMore, setHasMore] = useState(false);
  const [optionsList, setOptionsList] = useState([]);
  const activeDepartment = useSelector(getActiveDepartment);
  const userName = useSelector(getAuthenticatedUserName);
  const wobject = useSelector(getObject);
  const host = useSelector(getAppHost);
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const departmentName = match.params.department;
  const isRecipe = wobject.object_type === 'recipe';
  const schema = isRecipe ? 'recipe' : undefined;

  useEffect(() => {
    setOptionsList([]);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);

    if (!isEmpty(activeDepartment)) {
      getObjectsByDepartment(userName, [activeDepartment.name], schema, host, 0, limit).then(r => {
        setHasMore(r.hasMore);
        setOptionsList(r.wobjects);
      });
    } else if (!isNil(departmentName)) {
      dispatch(setActiveDepartment({ name: departmentName, id: departmentName }));
      getObjectsByDepartment(userName, [departmentName], schema, host, 0, limit).then(r => {
        setHasMore(r.hasMore);
        setOptionsList(r.wobjects);
      });
    }
  }, [activeDepartment]);

  const loadMoreRelatedObjects = () => {
    getObjectsByDepartment(
      userName,
      [activeDepartment.name],
      schema,
      host,
      optionsList.length,
      limit,
    ).then(r => {
      setHasMore(r.hasMore);
      setOptionsList([...optionsList, ...r.wobjects]);
    });
  };

  return (
    <>
      <div className="ObjectCardView__prefix">
        <div className="ObjectCardView__prefix-content">
          <FormattedMessage
            id={isRecipe ? 'category' : 'department'}
            defaultMessage={isRecipe ? 'Category' : 'Department'}
          />
          : {activeDepartment.name}
        </div>
      </div>
      <InfiniteScroll
        className="Feed"
        loadMore={loadMoreRelatedObjects}
        loader={<Loading />}
        initialLoad={false}
        hasMore={hasMore}
      >
        {optionsList?.map(wObj => (
          <ObjectCardSwitcher key={wObj._id} wObj={wObj} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default DepartmentsPage;
