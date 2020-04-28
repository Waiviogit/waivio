import { SET_DATA_FOR_SINGLE_REPORT } from './rewardsActions';

const initialState = {
  singleReportData: {},
};

const rewardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA_FOR_SINGLE_REPORT.ACTION:
      return {
        ...state,
        singleReportData: action.payload,
      };
    default:
      return state;
  }
};

export default rewardsReducer;

// export const getIsMapModalOpen = state => state.isFullscreenMode;
export const getSingleReportData = state => state.singleReportData;
export const getCreateCampaignDate = state => state.singleReportData.createCampaignDate;
export const getReservationDate = state => state.reservationDate;
export const getReviewDate = state => state.reviewDate;
export const getTitle = state => state.title;
export const getRewardHive = state => state.rewardHive;
export const getRewardUsd = state => state.rewardUsd;
