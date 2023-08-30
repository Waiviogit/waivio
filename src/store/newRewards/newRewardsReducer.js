import { GET_MORE_REWARDS_LIST, GET_REWARDS_LIST } from './newRewardsActions';

const defaultState = {
  rewards: [],
  hasMore: false,
  loading: false,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_REWARDS_LIST.START:
      return {
        ...state,
        rewards: [],
        loading: true,
      };
    case GET_MORE_REWARDS_LIST.START:
      return {
        ...state,
        loading: true,
      };
    case GET_REWARDS_LIST.ERROR:
    case GET_MORE_REWARDS_LIST.ERROR:
      return {
        ...state,
        loading: false,
      };
    case GET_REWARDS_LIST.SUCCESS:
      return {
        ...state,
        rewards: action.payload.rewards,
        hasMore: action.payload.hasMore,
        loading: false,
      };
    case GET_MORE_REWARDS_LIST.SUCCESS:
      return {
        ...state,
        rewards: [...state.rewards, ...action.payload.rewards],
        hasMore: action.payload.hasMore,
        loading: false,
      };
    default:
      return state;
  }
};
