export const SET_ACTIVE_OPTION = 'options/SET_ACTIVE_OPTION';
export const SET_ACTIVE_CATEGORY = 'options/SET_ACTIVE_CATEGORY';
export const SET_GROUP_ID = 'options/SET_GROUP_ID';
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
export const setStoreGroupId = groupId => dispatch =>
  dispatch({
    type: SET_GROUP_ID,
    payload: groupId,
  });
