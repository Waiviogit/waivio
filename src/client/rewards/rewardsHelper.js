export const displayLimit = 10;

export const preparePropositionReqData = props => {
  const { userName, campaignParent } = props;
  const reqData = { limit: displayLimit, campaignParent, currentUserName: userName };
  switch (props.filterKey) {
    case 'active':
      reqData.userName = userName;
      break;
    case 'history':
      reqData.status = ['inactive', 'expired', 'deleted', 'payed'];
      break;
    case 'created':
      reqData.guideName = userName;
      break;
    case 'reserved':
      reqData.userName = userName;
      reqData.approved = true;
      break;
    default:
      break;
  }
  return reqData;
};
