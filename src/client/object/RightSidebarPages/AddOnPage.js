import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getAddOnObjectsFromDepartments } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';
import { getUsedLocale } from '../../../store/appStore/appSelectors';

const limit = 10;

const AddOnPage = () => {
  const [addOnObjects, setAddOnObjects] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const wobject = useSelector(getObject);
  const locale = useSelector(getUsedLocale);
  const authUserName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    getAddOnObjectsFromDepartments(wobject.author_permlink, authUserName, locale, 0, limit).then(
      res => {
        setLoading(false);
        setAddOnObjects(res.wobjects);
        setHasMore(res.hasMore);
      },
    );
  }, [wobject.author_permlink]);

  const loadMoreAddOnObjects = () => {
    hasMore &&
      getAddOnObjectsFromDepartments(
        wobject.author_permlink,
        authUserName,
        locale,
        addOnObjects.length,
        limit,
      ).then(res => {
        setAddOnObjects([...addOnObjects, ...res.wobjects]);
        setHasMore(res.hasMore);
      });
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <InfiniteScroll
        className="Feed"
        loadMore={loadMoreAddOnObjects}
        loader={<Loading />}
        initialLoad={false}
        hasMore={hasMore}
      >
        {addOnObjects?.map(obj => (
          <ObjectCardSwitcher key={obj._id} wObj={obj} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default AddOnPage;
