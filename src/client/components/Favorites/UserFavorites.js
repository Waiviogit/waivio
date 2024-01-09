import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Loading from '../Icon/Loading';
import ObjectCardView from '../../objectCard/ObjectCardView';
import {
  getFavoriteObjects,
  getFavoriteObjectTypes,
  getLoadingFavoriteObjects,
  hasMoreFavoriteObjects,
} from '../../../store/favoritesStore/favoritesSelectors';
import {
  setFavoriteObjects,
  setMoreFavoriteObjects,
} from '../../../store/favoritesStore/favoritesActions';

const UserFavorites = () => {
  const favoriteObjects = useSelector(getFavoriteObjects);
  const isLoading = useSelector(getLoadingFavoriteObjects);
  const hasMore = useSelector(hasMoreFavoriteObjects);
  const objectTypes = useSelector(getFavoriteObjectTypes);

  const { objectType = objectTypes?.[0], name } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(favoriteObjects[objectType])) dispatch(setFavoriteObjects(name, objectType));
  }, [objectType, name]);

  const loadMoreObjects = () => {
    dispatch(setMoreFavoriteObjects(name, objectType));
  };

  return isLoading && favoriteObjects[objectType]?.length < 10 ? (
    <Loading />
  ) : (
    <>
      {isEmpty(favoriteObjects[objectType]) && !isLoading ? (
        <div className="feed_empty">
          <h3>
            <FormattedMessage
              id="empty_favorites"
              defaultMessage="This user doesn't have any favorites."
            />
          </h3>
        </div>
      ) : (
        <InfiniteScroll
          className="Feed"
          loadMore={loadMoreObjects}
          loader={<Loading />}
          initialLoad={false}
          hasMore={hasMore}
        >
          {favoriteObjects[objectType]?.map(wObj => (
            <ObjectCardView key={wObj._id} wObject={wObj} passedParent={wObj.parent} />
          ))}
        </InfiniteScroll>
      )}{' '}
    </>
  );
};

export default UserFavorites;
