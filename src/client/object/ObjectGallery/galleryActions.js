import { createAction } from 'redux-actions';
import { createAsyncActionType } from '../../helpers/stateHelpers';

import { getWobjectGallery } from '../../../waivioApi/ApiClient';

export const GET_ALBUMS = createAsyncActionType('@gallery/GET_ALBUMS');
export const ADD_ALBUM = '@gallery/ADD_ALBUM';
export const ADD_IMAGE = '@gallery/ADD_IMAGE';
export const RESET_GALLERY = '@gallery/RESET_GALLERY';

export const getAlbums = wObject => dispatch =>
  dispatch({
    type: GET_ALBUMS.ACTION,
    payload: {
      promise: getWobjectGallery(wObject).then(res => res),
    },
  }).catch(() => {});

export const addAlbumToStore = createAction(ADD_ALBUM);
export const addImageToAlbumStore = createAction(ADD_IMAGE);
export const resetGallery = createAction(RESET_GALLERY);
