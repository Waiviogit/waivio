import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../../components/Icon/Loading';
import { getObject, getRelatedObjectsArray } from '../../../store/wObjectStore/wObjectSelectors';
import { getRelatedObjectsFromDepartments } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';
import { getUsedLocale } from '../../../store/appStore/appSelectors';

const limit = 10;

const RelatedPage = () => {
  const [relatedObjects, setRelatedObjects] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const objects = useSelector(getRelatedObjectsArray);
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const wobject = useSelector(getObject);
  const objs = !hasMore ? objects : [];
  const sortedRelatedObjects = [...relatedObjects, ...objs];

  useEffect(() => {
    if (!isEmpty(wobject.author_permlink)) {
      getRelatedObjectsFromDepartments(wobject.author_permlink, userName, locale, 0, limit).then(
        res => {
          setLoading(false);
          setRelatedObjects(res.wobjects);
          setHasMore(res.hasMore);
        },
      );
    }
  }, [wobject.author_permlink]);

  const loadMoreRelatedObjects = () => {
    getRelatedObjectsFromDepartments(
      wobject.author_permlink,
      userName,
      locale,
      relatedObjects.length,
      limit,
    ).then(res => {
      setRelatedObjects([...relatedObjects, ...res.wobjects]);
      setHasMore(res.hasMore);
    });
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <InfiniteScroll
        className="Feed"
        loadMore={loadMoreRelatedObjects}
        loader={<Loading />}
        initialLoad={false}
        hasMore={hasMore}
      >
        {sortedRelatedObjects?.map(obj => (
          <ObjectCardSwitcher key={obj._id} wObj={obj} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default RelatedPage;
