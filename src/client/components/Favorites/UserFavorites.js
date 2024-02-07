import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty, isNil } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Loading from '../Icon/Loading';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';
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
import FavoritesMobileSidenav from './FavoritesMobileSidenav/FavoritesMobileSidenav';

const UserFavorites = () => {
  const [visible, setVisible] = useState(false);
  const favoriteObjects = useSelector(getFavoriteObjects);
  const isLoading = useSelector(getLoadingFavoriteObjects);
  const hasMore = useSelector(hasMoreFavoriteObjects);
  const objectTypes = useSelector(getFavoriteObjectTypes);
  const emptyFavorites =
    (isEmpty(favoriteObjects?.[objectType]) &&
      !isNil(favoriteObjects?.[objectType]) &&
      !isLoading) ||
    (isEmpty(objectTypes) && !isNil(objectTypes) && !isLoading);

  const { objectType = objectTypes?.[0], name } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(favoriteObjects?.[objectType]) && !isEmpty(objectTypes))
      dispatch(setFavoriteObjects(name, objectType));
  }, [objectType, name]);

  const loadMoreObjects = () => {
    if (hasMore && !isLoading) dispatch(setMoreFavoriteObjects(name, objectType));
  };

  return (isNil(favoriteObjects?.[objectType]) && isLoading) ||
    (isLoading && favoriteObjects?.[objectType]?.length < 10) ? (
    <Loading />
  ) : (
    <>
      <div className={'ListSwitcher__navInfo'}>
        <FavoritesMobileSidenav
          objectTypes={objectTypes}
          visible={visible}
          setVisible={setVisible}
        />
      </div>
      {emptyFavorites ? (
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
          {favoriteObjects?.[objectType]?.map(wObj => (
            <ObjectCardSwitcher key={wObj._id} wObj={wObj} />
          ))}
        </InfiniteScroll>
      )}{' '}
    </>
  );
};

export default UserFavorites;
