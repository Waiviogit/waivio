import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector } from 'react-redux';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectsByIds } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import { sortByFieldPermlinksList } from '../../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';

const limit = 10;

const SimilarPage = () => {
  const [similarObjects, setSimilarObjects] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const wobject = useSelector(getObject);
  const authUserName = useSelector(getAuthenticatedUserName);
  const similarPermlinks = wobject?.similar?.map(obj => obj.body);
  const sortedSimilarObjects = sortByFieldPermlinksList(similarPermlinks, similarObjects);

  useEffect(() => {
    getObjectsByIds({
      authorPermlinks: similarPermlinks,
      authUserName,
      limit,
      skip: 0,
    }).then(res => {
      setSimilarObjects(res.wobjects);
      setHasMore(res.hasMore);
    });
  }, [wobject.author_permlink]);

  const loadMoreAddOnObjects = () => {
    getObjectsByIds({
      authorPermlinks: similarPermlinks,
      authUserName,
      limit,
      skip: similarObjects.length,
    }).then(res => {
      setSimilarObjects([...similarObjects, ...res.wobjects]);
      setHasMore(res.hasMore);
    });
  };

  return (
    <>
      <InfiniteScroll
        className="Feed"
        loadMore={loadMoreAddOnObjects}
        loader={<Loading />}
        initialLoad={false}
        hasMore={hasMore}
      >
        {sortedSimilarObjects?.map(obj => (
          <ObjectCardSwitcher key={obj._id} wObj={obj} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default SimilarPage;
