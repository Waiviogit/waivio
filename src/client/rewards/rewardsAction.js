export const SET_TOTAL_PAYABLE = '@rewards/SET_TOTAL_PAYABLE';

export const setTotalPayable = payable => dispatch => {
  dispatch({
    type: SET_TOTAL_PAYABLE,
    payload: payable,
  });
};
