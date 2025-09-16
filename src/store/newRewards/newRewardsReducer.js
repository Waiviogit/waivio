import {
  GET_MORE_REWARDS_LIST,
  GET_REWARDS_LIST,
  SET_REQUIRED_OBJECT,
  SET_ACTIVATION_PERMLINK,
} from './newRewardsActions';

const defaultState = {
  rewards: [],
  hasMore: false,
  loading: false,
  requiredObject: null,
  activationPermlink: null,
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
    case SET_REQUIRED_OBJECT:
      return {
        ...state,
        requiredObject: action.payload,
      };
    case SET_ACTIVATION_PERMLINK:
      return {
        ...state,
        activationPermlink: action.payload,
      };
    default:
      return state;
  }
};
