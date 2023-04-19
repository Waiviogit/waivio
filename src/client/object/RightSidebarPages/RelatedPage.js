import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../../components/Icon/Loading';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getObject, getRelatedObjectsArray } from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectsByIds } from '../../../waivioApi/ApiClient';
import { sortByFieldPermlinksList } from '../../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const limit = 10;

const RelatedPage = () => {
  const [relatedObjects, setRelatedObjects] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const objects = useSelector(getRelatedObjectsArray);
  const authUserName = useSelector(getAuthenticatedUserName);
  const wobject = useSelector(getObject);
  const objectsPermlinks = objects?.map(obj => obj.author_permlink);
  const relatedPermlinks = !isEmpty(wobject.related)
    ? [...wobject?.related?.map(obj => obj.body), ...objectsPermlinks]
    : objectsPermlinks;
  const sortedRelatedObjects = sortByFieldPermlinksList(relatedPermlinks, relatedObjects);

  useEffect(() => {
    if (!isEmpty(relatedPermlinks)) {
      getObjectsByIds({
        authorPermlinks: relatedPermlinks,
        authUserName,
        limit,
        skip: 0,
      }).then(res => {
        setRelatedObjects(res.wobjects);
        setHasMore(res.hasMore);
      });
    }
  }, [wobject.author_permlink]);

  const loadMoreRelatedObjects = () => {
    getObjectsByIds({
      authorPermlinks: relatedPermlinks,
      authUserName,
      limit,
      skip: relatedObjects.length,
    }).then(res => {
      setRelatedObjects([...relatedObjects, ...res.wobjects]);
      setHasMore(res.hasMore);
    });
  };

  return (
    <>
      <InfiniteScroll
        className="Feed"
        loadMore={loadMoreRelatedObjects}
        loader={<Loading />}
        initialLoad={false}
        hasMore={hasMore}
      >
        {sortedRelatedObjects?.map(obj => (
          <ObjectCardView key={obj._id} wObject={obj} showHeart />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default RelatedPage;
