import { SET_TOTAL_PAYABLE } from './rewardsAction';

const initialState = {
  totalPayable: 0,
};

const rewards = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOTAL_PAYABLE:
      return {
        ...state,
        totalPayable: action.payload,
      };
    default:
      return state;
  }
};

export default rewards;
export const getTotalPayable = state => state.totalPayable;
