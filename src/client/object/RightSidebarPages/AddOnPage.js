import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectsByIds } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { sortByFieldPermlinksList } from '../../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const limit = 10;

const AddOnPage = () => {
  const [addOnObjects, setAddOnObjects] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const wobject = useSelector(getObject);
  const authUserName = useSelector(getAuthenticatedUserName);
  const addOnPermlinks = wobject?.addOn?.map(obj => obj.body);
  const sortedAddOnObjects = sortByFieldPermlinksList(addOnPermlinks, addOnObjects);

  useEffect(() => {
    getObjectsByIds({
      authorPermlinks: addOnPermlinks,
      authUserName,
      limit,
      skip: 0,
    }).then(res => {
      setAddOnObjects(res.wobjects);
      setHasMore(res.hasMore);
    });
  }, [wobject.author_permlink]);

  const loadMoreAddOnObjects = () => {
    getObjectsByIds({
      authorPermlinks: addOnPermlinks,
      authUserName,
      limit,
      skip: addOnObjects.length,
    }).then(res => {
      setAddOnObjects([...addOnObjects, ...res.wobjects]);
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
        {sortedAddOnObjects?.map(obj => (
          <ObjectCardView key={obj._id} wObject={obj} showHeart />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default AddOnPage;
