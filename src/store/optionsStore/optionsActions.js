export const SET_ACTIVE_OPTION = 'options/SET_ACTIVE_OPTION';
export const setStoreActiveOption = option => dispatch =>
  dispatch({
    type: SET_ACTIVE_OPTION,
    payload: option,
  });
