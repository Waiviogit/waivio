import { getIsMapModalOpen } from '../../reducers';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromAppend', () => {
  const state = {
    map: {
      isFullscreenMode: 'isFullscreenMode',
    },
  };

  it('Should return isFullscreenMode', () => {
    expect(getIsMapModalOpen(state)).toBe('isFullscreenMode');
  });
});
