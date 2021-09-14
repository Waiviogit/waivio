import {
  GET_ELIGIBLE_REWARDS,
  GET_ELIGIBLE_REWARDS_WITH_RESTAURANT, SELECT_DISH,
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
        eligibleRestList: action.payload.campaigns,
      };
    case GET_ELIGIBLE_REWARDS_WITH_RESTAURANT.SUCCESS:
      return {
        ...state,
        eligibleRestList: action.payload.campaigns,
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
    default:
      return state;
  }
};
