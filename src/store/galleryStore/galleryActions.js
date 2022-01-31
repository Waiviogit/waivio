import _ from 'lodash';
import { createAction } from 'redux-actions';

import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getWobjectGallery, getRelatedPhotos } from '../../waivioApi/ApiClient';
import { getLocale } from '../settingsStore/settingsSelectors';
import { getRelatedPhotos as relatedPhotos } from './gallerySelectors';

export const GET_ALBUMS = createAsyncActionType('@gallery/GET_ALBUMS');
export const GET_RELATED_PHOTOS = createAsyncActionType('@gallery/GET_RELATED_PHOTOS');
export const GET_MORE_RELATED_PHOTOS = createAsyncActionType('@gallery/GET_MORE_RELATED_PHOTOS');
export const ADD_ALBUM = '@gallery/ADD_ALBUM';
export const ADD_IMAGE = '@gallery/ADD_IMAGE';
export const RESET_GALLERY = '@gallery/RESET_GALLERY';
export const CLEAR_RELATED_PHOTO = '@gallery/CLEAR_RELATED_PHOTO';

export const getAlbums = authorPermlink => (dispatch, getState) => {
  const locale = getLocale(getState());

  return dispatch({
    type: GET_ALBUMS.ACTION,
    payload: {
      promise: getWobjectGallery(authorPermlink, locale).then(albums => {
        const defaultAlbum = _.remove(albums, alb => alb.id === authorPermlink);

        const sortedAlbums = _.orderBy(albums, ['weight'], ['desc']);

        return [...defaultAlbum, ...sortedAlbums];
      }),
    },
  }).catch(() => {});
};

export const getRelatedAlbum = (authorPermlink, limit = 30, skip = 0) => dispatch =>
  dispatch({
    type: GET_RELATED_PHOTOS.ACTION,
    payload: {
      promise: getRelatedPhotos(authorPermlink, limit, skip),
    },
  });

export const getMoreRelatedAlbum = (authorPermlink, limit = 30) => (dispatch, getState) => {
  const state = getState();
  const relatedPhotoContent = relatedPhotos(state);
  const skip = relatedPhotoContent.items.length;

  return dispatch({
    type: GET_MORE_RELATED_PHOTOS.ACTION,
    payload: {
      promise: getRelatedPhotos(authorPermlink, limit, skip),
    },
    meta: {
      limit,
    },
  });
};

export const clearRelatedPhoto = () => dispatch =>
  dispatch({
    type: CLEAR_RELATED_PHOTO,
  });

export const addAlbumToStore = createAction(ADD_ALBUM);
export const addImageToAlbumStore = createAction(ADD_IMAGE);
export const resetGallery = createAction(RESET_GALLERY);
