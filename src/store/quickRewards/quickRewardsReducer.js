import {
  GET_ELIGIBLE_REWARDS,
  GET_ELIGIBLE_REWARDS_WITH_RESTAURANT,
  RESET_DISH,
  RESET_RESTAURANT,
  SELECT_DISH,
  SELECT_RESTAURANT,
} from './quickRewardsActions';

const defaultState = {
  eligibleRestList: [],
  eligibleDishFromRest: [],
  selectedRest: null,
  selectedDish: null,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_ELIGIBLE_REWARDS.SUCCESS:
      return {
        ...state,
        eligibleRestList: action.payload.wobjects,
      };
    case GET_ELIGIBLE_REWARDS_WITH_RESTAURANT.SUCCESS:
      return {
        ...state,
        eligibleDishFromRest: action.payload,
      };
    case SELECT_RESTAURANT:
      return {
        ...state,
        selectedRest: action.payload,
      };
    case SELECT_DISH:
      return {
        ...state,
        selectedDish: action.payload,
      };
    case RESET_RESTAURANT:
      return {
        ...state,
        selectedRest: null,
        selectedDish: null,
      };
    case RESET_DISH:
      return {
        ...state,
        selectedDish: null,
      };
    default:
      return state;
  }
};
