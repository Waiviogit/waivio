import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getObjectsByDepartment } from '../../../waivioApi/ApiClient';
import { getActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsSelectors';

const DepartmentsPage = () => {
  const [hasMore, setHasMore] = useState(false);
  const [loadingStarted, setLoadingStarted] = useState(false);
  const [filteredObjects, setFilteredObjects] = useState([]);
  let skip = 0;
  const limit = 10;
  const activeDepartment = useSelector(getActiveDepartment);

  useEffect(() => {
    setFilteredObjects([]);
    if (!isEmpty(activeDepartment))
      getObjectsByDepartment({ departments: [activeDepartment], skip, limit }).then(r => {
        setLoadingStarted(true);
        setHasMore(r.hasMore);
        setFilteredObjects(r.wobjects);
      });
    setLoadingStarted(false);
  }, [activeDepartment]);

  const loadMoreRelatedObjects = () => {
    if (hasMore) {
      if (filteredObjects.length >= limit) {
        skip += filteredObjects.length;
      }
      getObjectsByDepartment({ departments: [activeDepartment], skip, limit }).then(r => {
        setLoadingStarted(true);
        setHasMore(r.hasMore);
        setFilteredObjects([...filteredObjects, ...r.wobjects]);
      });
      setLoadingStarted(false);
      if (filteredObjects.length >= limit) {
        skip += filteredObjects.length;
      }
    }
  };

  useEffect(() => {
    if (hasMore) loadMoreRelatedObjects();
  }, [filteredObjects]);

  return (
    <>
      <div className="Department__prefix">
        <div className="Department__prefix-content">
          <FormattedMessage id="department" defaultMessage="Department" />: {activeDepartment}
        </div>
      </div>
      <ReduxInfiniteScroll
        className="Feed"
        loadMore={loadMoreRelatedObjects}
        loader={<Loading />}
        loadingMore={loadingStarted}
        hasMore={hasMore}
        // elementIsScrollable={false}
        threshold={1000}
      >
        {filteredObjects?.map(wObj => (
          <ObjectCardView key={wObj.id} wObject={wObj} passedParent={wObj.parent} />
        ))}
      </ReduxInfiniteScroll>
    </>
  );
};

export default DepartmentsPage;
