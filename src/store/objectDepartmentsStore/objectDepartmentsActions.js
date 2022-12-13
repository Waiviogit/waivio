export const SET_DEPARTMENT = 'departments/SET_DEPARTMENT';
export const setActiveDepartment = department => dispatch =>
  dispatch({
    type: SET_DEPARTMENT,
    payload: department,
  });
