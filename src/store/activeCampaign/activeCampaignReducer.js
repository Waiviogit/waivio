import { GET_ACTIVE_CAMPAIGN } from './activeCampaignActions';

const initialState = {
  activeCampaigns: [],
  hasMore: false,
  isLoading: false,
  error: null,
};

const activeCampaignReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACTIVE_CAMPAIGN.START:
      return {
        ...state,
        isLoading: true,
        ...(action.meta.isMore ? {} : { activeCampaigns: [] }),
      };
    case GET_ACTIVE_CAMPAIGN.SUCCESS:
      return {
        ...state,
        activeCampaigns: action.meta.isMore
          ? [...state.activeCampaigns, ...action.payload.wobjects]
          : action.payload.wobjects,
        hasMore: action.payload.hasMore,
        isLoading: false,
      };
    case GET_ACTIVE_CAMPAIGN.ERROR:
      return {
        ...state,
        activeCampaigns: [],
        isLoading: false,
        hasMore: false,
      };
    default:
      return state;
  }
};

export default activeCampaignReducer;
