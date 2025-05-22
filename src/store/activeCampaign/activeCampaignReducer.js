import { GET_ACTIVE_CAMPAIGN, GET_ACTIVE_CAMPAIGN_TYPES } from './activeCampaignActions';

const initialState = {
  activeCampaigns: [],
  activeCampaignTypes: [],
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
    case GET_ACTIVE_CAMPAIGN_TYPES.ERROR:
      return {
        ...state,
        activeCampaignTypes: [],
      };

    case GET_ACTIVE_CAMPAIGN_TYPES.START:
      return {
        ...state,
        activeCampaignTypes: [],
      };
    case GET_ACTIVE_CAMPAIGN_TYPES.SUCCESS:
      return {
        ...state,
        activeCampaignTypes: action.payload,
      };
    default:
      return state;
  }
};

export default activeCampaignReducer;
