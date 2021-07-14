import { createSelector } from 'reselect';

// selector
export const galleryState = state => state.gallery;

// reselect function
export const getObjectAlbums = createSelector([galleryState], state => state.albums);
export const getIsObjectAlbumsLoading = createSelector(
  [galleryState],
  state => state.albumsLoading,
);
export const getRelatedPhotos = createSelector([galleryState], state => state.relatedAlbum);
