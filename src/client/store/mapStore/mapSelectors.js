import { createSelector } from 'reselect';

// selector
export const mapState = state => state.map;

// reselect function
export const getUpdatedMap = createSelector([mapState], state => state.updated);
export const getObjectsMap = createSelector([mapState], state => state.mapWobjects);
export const getIsMapModalOpen = createSelector([mapState], state => state.isFullscreenMode);
