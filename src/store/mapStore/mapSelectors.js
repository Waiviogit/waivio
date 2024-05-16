import { createSelector } from 'reselect';

// selector
export const mapState = state => state.map;

// reselect function
export const getMapData = createSelector([mapState], state => state.mapData);
export const getMapHeight = createSelector([mapState], state => state.height);
export const getBoundsParams = createSelector([mapState], state => state.boundsParams);
export const getInfoboxData = createSelector([mapState], state => state.infoboxData);
export const getMapLoading = createSelector([mapState], state => state.loading);
export const getShowLocation = createSelector([mapState], state => state.showLocation);
export const getArea = createSelector([mapState], state => state.area);
export const getUpdatedMap = createSelector([mapState], state => state.updated);
export const getObjectsMap = createSelector([mapState], state => state.mapWobjects);
export const getIsMapModalOpen = createSelector([mapState], state => state.isFullscreenMode);
