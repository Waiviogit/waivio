import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
// import PropTypes from "prop-types";
import { FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../../components/Icon/Loading';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getObjectsByDepartment } from '../../../waivioApi/ApiClient';
import { getActiveDepartment } from '../../../store/objectDepartmentsStore/objectDepartmentsSelectors';

const DepartmentsPage = () => {
  const [hasMore, setHasMore] = useState(false);
  const [filteredObjects, setFilteredObjects] = useState([]);
  let skip = 0;
  const limit = 10;
  const activeDepartment = useSelector(getActiveDepartment);

  useEffect(() => {
    setFilteredObjects([]);
    if (!isEmpty(activeDepartment))
      getObjectsByDepartment([activeDepartment.name], skip, limit).then(r => {
        setHasMore(r.hasMore);
        setFilteredObjects(r.wobjects);
      });
  }, [activeDepartment]);

  useEffect(() => {
    if (filteredObjects.length >= limit) {
      skip += filteredObjects.length;
    }
  }, [filteredObjects]);

  const loadMoreRelatedObjects = () => {
    getObjectsByDepartment([activeDepartment.name], skip, limit).then(r => {
      setHasMore(r.hasMore);
      setFilteredObjects([...filteredObjects, ...r.wobjects]);
    });
  };

  return (
    <>
      <div className="Department__prefix">
        <div className="Department__prefix-content">
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
        {filteredObjects?.map(wObj => (
          <ObjectCardView key={wObj.id} wObject={wObj} passedParent={wObj.parent} />
        ))}
      </InfiniteScroll>
    </>
  );
};

DepartmentsPage.propTypes = {
  // wobject: PropTypes.shape().isRequired
};

export default DepartmentsPage;
