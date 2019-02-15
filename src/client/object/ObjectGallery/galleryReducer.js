import * as galleryActions from './galleryActions';

const defaultState = {
  albumsLoading: true,
  error: null,
  albums: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case galleryActions.GET_ALBUMS.START:
      return {
        ...state,
        error: null,
      };
    case galleryActions.GET_ALBUMS.ERROR:
      return {
        ...state,
        error: action.message,
        albumsLoading: false,
      };
    case galleryActions.GET_ALBUMS.SUCCESS:
      return {
        ...state,
        albums: action.payload,
        error: null,
        albumsLoading: false,
      };
    case galleryActions.ADD_ALBUM: {
      return {
        ...state,
        albums: [action.payload, ...state.albums],
      };
    }
    case galleryActions.ADD_IMAGE: {
      const albums = state.albums.map(album =>
        album.id === action.payload.id
          ? {
              ...album,
              items: [...album.items, action.payload],
            }
          : album,
      );
      return { ...state, albums };
    }
    case galleryActions.RESET_GALLERY: {
      return defaultState;
    }
    default:
      return state;
  }
};

export const getObjectAlbums = state => state.albums;
export const getIsObjectAlbumsLoading = state => state.albumsLoading;
