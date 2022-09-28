import {
  CREATE_QUICK_POST,
  GET_ELIGIBLE_REWARDS,
  GET_ELIGIBLE_REWARDS_WITH_RESTAURANT,
  GET_MORE_ELIGIBLE_REWARDS_WITH_RESTAURANT,
  RESET_DISH,
  RESET_RESTAURANT,
  SELECT_DISH,
  SELECT_RESTAURANT,
  TOGGLE_MODAL,
} from './quickRewardsActions';

const defaultState = {
  eligibleRestList: [],
  eligibleDishFromRest: [],
  selectedRest: null,
  selectedDish: null,
  isOpen: false,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_ELIGIBLE_REWARDS.SUCCESS:
      return {
        ...state,
        eligibleRestList: action.payload.wobjects,
      };
    case TOGGLE_MODAL: {
      if (action.payload.open) {
        return {
          ...state,
          isOpen: action.payload.open,
          isNew: action.payload.isNew,
        };
      }

      return defaultState;
    }

    case GET_ELIGIBLE_REWARDS_WITH_RESTAURANT.SUCCESS:
      return {
        ...state,
        eligibleDishFromRest: action.payload,
      };

    case GET_MORE_ELIGIBLE_REWARDS_WITH_RESTAURANT.SUCCESS:
      return {
        ...state,
        eligibleDishFromRest: [...state.eligibleDishFromRest, ...action.payload],
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
    case CREATE_QUICK_POST:
      return defaultState;
    default:
      return state;
  }
};
