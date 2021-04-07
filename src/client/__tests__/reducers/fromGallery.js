import { getObjectAlbums, getIsObjectAlbumsLoading } from '../../store/reducers';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromAppend', () => {
  const state = {
    gallery: {
      albums: 'albums',
      albumsLoading: 'albumsLoading',
    },
  };

  it('Should return albums', () => {
    expect(getObjectAlbums(state)).toBe('albums');
  });

  it('Should return albumsLoading', () => {
    expect(getIsObjectAlbumsLoading(state)).toBe('albumsLoading');
  });
});
