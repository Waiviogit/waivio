export const CHANGE_MAP_MODAL_MODE = '@map/CHANGE_MAP_MODAL_MODE';

export const setMapFullscreenMode = mode => dispatch =>
  dispatch({
    type: CHANGE_MAP_MODAL_MODE,
    payload: mode,
  });
