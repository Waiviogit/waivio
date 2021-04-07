import * as galleryActions from './galleryActions';

const defaultState = {
  albumsLoading: true,
  error: null,
  albums: [],
  relatedAlbum: {},
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
    case galleryActions.GET_RELATED_PHOTOS.START:
      return {
        ...state,
        error: null,
      };
    case galleryActions.GET_RELATED_PHOTOS.ERROR:
      return {
        ...state,
        error: action.message,
        albumsLoading: false,
      };
    case galleryActions.GET_RELATED_PHOTOS.SUCCESS: {
      return {
        ...state,
        relatedAlbum: action.payload,
      };
    }
    case galleryActions.GET_MORE_RELATED_PHOTOS.START: {
      return {
        ...state,
        isFetching: true,
        isLoaded: false,
        failed: false,
      };
    }
    case galleryActions.GET_MORE_RELATED_PHOTOS.SUCCESS: {
      return {
        ...state,
        relatedAlbum: {
          ...state.relatedAlbum,
          hasMore: Boolean(action.payload.items.length === action.meta.limit),
          items: [...state.relatedAlbum.items, ...action.payload.items],
        },
      };
    }
    case galleryActions.ADD_ALBUM: {
      return {
        ...state,
        albums: [...state.albums, action.payload],
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

    case galleryActions.CLEAR_RELATED_PHOTO: {
      return {
        ...state,
        relatedAlbum: {},
      };
    }
    default:
      return state;
  }
};
