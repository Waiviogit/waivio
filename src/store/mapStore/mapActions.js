export const CHANGE_MAP_MODAL_MODE = '@map/CHANGE_MAP_MODAL_MODE';
export const RESET_UPDATED_STATE = '@map/RESET_UPDATED_STATE';
export const SET_UPDATED_STATE = '@map/SET_UPDATED_STATE';
export const GET_PROPOSITIONS_FOR_MAP = '@map/GET_PROPOSITIONS_FOR_MAP';
export const SET_MAP_DATA = '@map/SET_MAP_DATA';
export const SET_HEIGHT = '@map/SET_HEIGHT';
export const SET_BOUNDS_PARAMS = '@map/SET_BOUNDS_PARAMS';
export const SET_INFOBOX_DATA = '@map/SET_INFOBOX_DATA';
export const SET_SHOW_LOCATION = '@map/SET_SHOW_LOCATION';
export const SET_AREA = '@map/SET_AREA';

export const setMapFullscreenMode = mode => dispatch =>
  dispatch({
    type: CHANGE_MAP_MODAL_MODE,
    payload: mode,
  });

export const setMapData = data => dispatch =>
  dispatch({
    type: SET_MAP_DATA,
    payload: data,
  });
export const setHeight = height => dispatch =>
  dispatch({
    type: SET_HEIGHT,
    payload: height,
  });
export const setBoundsParams = params => dispatch =>
  dispatch({
    type: SET_BOUNDS_PARAMS,
    payload: params,
  });
export const setInfoboxData = params => dispatch =>
  dispatch({
    type: SET_INFOBOX_DATA,
    payload: params,
  });
export const setShowLocation = location => dispatch =>
  dispatch({
    type: SET_SHOW_LOCATION,
    payload: location,
  });
export const setArea = area => dispatch =>
  dispatch({
    type: SET_AREA,
    payload: area,
  });

export const setUpdatedFlag = () => dispatch => {
  dispatch({
    type: SET_UPDATED_STATE,
  });
};

export const resetUpdatedFlag = () => dispatch => {
  dispatch({
    type: RESET_UPDATED_STATE,
  });
};

export const getPropositionsForMap = campaigns => dispatch => {
  dispatch({
    type: GET_PROPOSITIONS_FOR_MAP,
    payload: campaigns,
  });
};
