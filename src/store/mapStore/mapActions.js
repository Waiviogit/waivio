export const CHANGE_MAP_MODAL_MODE = '@map/CHANGE_MAP_MODAL_MODE';
export const RESET_UPDATED_STATE = '@map/RESET_UPDATED_STATE';
export const SET_UPDATED_STATE = '@map/SET_UPDATED_STATE';
export const GET_PROPOSITIONS_FOR_MAP = '@map/GET_PROPOSITIONS_FOR_MAP';

export const setMapFullscreenMode = mode => dispatch =>
  dispatch({
    type: CHANGE_MAP_MODAL_MODE,
    payload: mode,
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
