export const displayLimit = 10;

export const rewardPostContainerData = {
  author: 'monterey',
  permlink: 'test-post',
};
export const preparePropositionReqData = ({
  username,
  match,
  coordinates,
  radius,
  sort,
  types,
  guideNames,
}) => {
  const reqData = {
    limit: displayLimit,
    requiredObject: match.params.campaignParent,
    currentUserName: username,
    sort,
  };
  if (coordinates && coordinates.length > 0 && radius) {
    reqData.coordinates = coordinates;
    reqData.radius = radius;
  }
  if (types && guideNames) {
    reqData.types = types;
    reqData.guideNames = guideNames;
  }
  switch (match.params.filterKey) {
    case 'active':
      reqData.userName = username;
      break;
    case 'history':
      reqData.status = ['inactive', 'expired', 'deleted', 'payed'];
      break;
    case 'created':
      reqData.guideName = username;
      break;
    case 'reserved':
      reqData.userName = username;
      reqData.approved = true;
      break;
    default:
      break;
  }
  return reqData;
};

export const getTextByFilterKey = (intl, filterKey) => {
  switch (filterKey) {
    case 'active':
    case 'history':
    case 'reserved':
      return `${intl.formatMessage({
        id: 'rewards',
        defaultMessage: 'Rewards',
      })} for`;
    case 'created':
      return `${intl.formatMessage({
        id: 'rewards',
        defaultMessage: 'Rewards',
      })} created by`;
    default:
      return intl.formatMessage({
        id: 'rewards',
        defaultMessage: 'Rewards',
      });
  }
};
