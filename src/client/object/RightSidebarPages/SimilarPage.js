import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector } from 'react-redux';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getSimilarObjectsFromDepartments } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';
import { getUsedLocale } from '../../../store/appStore/appSelectors';

const limit = 10;

const SimilarPage = () => {
  const [similarObjects, setSimilarObjects] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const wobject = useSelector(getObject);
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);

  useEffect(() => {
    getSimilarObjectsFromDepartments(wobject.author_permlink, userName, locale, 0, limit).then(
      res => {
        setLoading(false);
        setSimilarObjects(res.wobjects);
        setHasMore(res.hasMore);
      },
    );
  }, [wobject.author_permlink]);

  const loadMoreAddOnObjects = () => {
    getSimilarObjectsFromDepartments(
      wobject.author_permlink,
      userName,
      locale,
      similarObjects.length,
      limit,
    ).then(res => {
      setSimilarObjects([...similarObjects, ...res.wobjects]);
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
        {similarObjects?.map(obj => (
          <ObjectCardSwitcher key={obj._id} wObj={obj} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default SimilarPage;
