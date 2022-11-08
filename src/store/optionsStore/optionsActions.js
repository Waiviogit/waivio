export const SET_ACTIVE_OPTION = 'options/SET_ACTIVE_OPTION';
export const SET_ACTIVE_CATEGORY = 'options/SET_ACTIVE_CATEGORY';
export const setStoreActiveOption = option => dispatch =>
  dispatch({
    type: SET_ACTIVE_OPTION,
    payload: option,
  });
export const setStoreActiveCategory = category => dispatch =>
  dispatch({
    type: SET_ACTIVE_CATEGORY,
    payload: category,
  });
