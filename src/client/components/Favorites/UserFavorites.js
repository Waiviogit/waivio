import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
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
  setFavoriteObjectTypes,
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
    if ((isEmpty(favoriteObjects?.[objectType]) && !isEmpty(objectTypes)) || isNil(objectTypes))
      dispatch(setFavoriteObjects(name, objectType));
  }, [objectType, name]);

  const loadMoreObjects = () => {
    if (hasMore && !isLoading) dispatch(setMoreFavoriteObjects(name, objectType));
  };

  const description = `Discover the curated collection of favorites handpicked by ${name}. Explore a personalized selection of must-have items tailored to your interests. Find inspiration and elevate your experience with ${name}'s top picks on our Favorites page.`;

  return (
    <React.Fragment>
      <Helmet>
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={description} />
      </Helmet>
      {(isNil(favoriteObjects?.[objectType]) && isLoading) ||
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
      )}
    </React.Fragment>
  );
};

UserFavorites.fetchData = ({ match, store }) =>
  store
    .dispatch(setFavoriteObjectTypes(match.params.name))
    .then(types => store.dispatch(setFavoriteObjects(match.params.name, types.value[0])));

export default UserFavorites;
