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

const limit = 10;

const DepartmentsPage = () => {
  const [hasMore, setHasMore] = useState(false);
  const [optionsList, setOptionsList] = useState([]);
  const activeDepartment = useSelector(getActiveDepartment);
  const userName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const departmentName = match.params.department;

  useEffect(() => {
    setOptionsList([]);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);

    if (!isEmpty(activeDepartment)) {
      getObjectsByDepartment(userName, [activeDepartment.name], 0, limit).then(r => {
        setHasMore(r.hasMore);
        setOptionsList(r.wobjects);
      });
    } else if (!isNil(departmentName)) {
      dispatch(setActiveDepartment({ name: departmentName, id: departmentName }));
      getObjectsByDepartment(userName, [departmentName], 0, limit).then(r => {
        setHasMore(r.hasMore);
        setOptionsList(r.wobjects);
      });
    }
  }, [activeDepartment]);

  const loadMoreRelatedObjects = () => {
    getObjectsByDepartment(userName, [activeDepartment.name], optionsList.length, limit).then(r => {
      setHasMore(r.hasMore);
      setOptionsList([...optionsList, ...r.wobjects]);
    });
  };

  return (
    <>
      <div className="ObjectCardView__prefix">
        <div className="ObjectCardView__prefix-content">
          <FormattedMessage id="department" defaultMessage="Department" />: {activeDepartment.name}
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
