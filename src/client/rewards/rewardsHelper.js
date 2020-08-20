import { useSelector } from 'react-redux';
import { isEmpty, map, get, reduce, round } from 'lodash';
import moment from 'moment';
import { getFieldWithMaxWeight } from '../object/wObjectHelper';
import { REWARD, MESSAGES, GUIDE_HISTORY, HISTORY } from '../../common/constants/rewards';
import config from '../../waivioApi/routes';

export const displayLimit = 10;

export const rewardPostContainerData = {
  author: 'monterey',
  permlink: 'test-post',
};
export const preparePropositionReqData = ({
  username,
  match,
  limit = 10,
  sort,
  isRequestWithoutRequiredObject,
  ...args
}) => {
  const reqData = {
    limit,
    userName: username,
    match,
    sort,
  };
  if (!isRequestWithoutRequiredObject)
    reqData.requiredObject = match.params.campaignParent || match.params.name;

  Object.keys(args).forEach(argName => {
    reqData[argName] = args[argName];
  });

  return reqData;
};

export const getUrl = match => {
  let url;
  switch (match.params.filterKey) {
    case 'active':
      url = `${config.campaignApiPrefix}${config.campaigns}${config.eligible}`;
      break;
    case 'all':
      url = `${config.campaignApiPrefix}${config.campaigns}${config.all}`;
      break;
    case 'reserved':
      url = `${config.campaignApiPrefix}${config.campaigns}${config.reserved}`;
      break;
    default:
      url = `${config.campaignApiPrefix}${config.campaigns}${config.all}`;
      break;
  }
  return url;
};

export const getTextByFilterKey = (intl, filterKey) => {
  switch (filterKey) {
    case 'active':
    case HISTORY:
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

export const formatDate = (intl, date) => {
  const dt = new Date(date);
  const day = `0${dt.getDate()}`.slice(-2);
  const month = `0${dt.getMonth() + 1}`.slice(-2);
  const year = dt.getFullYear();

  switch (month) {
    case '01':
      return `${day}-${intl.formatMessage({
        id: 'peyment_jan',
        defaultMessage: 'Jan',
      })}-${year}`;
    case '02':
      return `${day}-${intl.formatMessage({
        id: 'peyment_feb',
        defaultMessage: 'Feb',
      })}-${year}`;
    case '03':
      return `${day}-${intl.formatMessage({
        id: 'peyment_mar',
        defaultMessage: 'Mar',
      })}-${year}`;
    case '04':
      return `${day}-${intl.formatMessage({
        id: 'peyment_apr',
        defaultMessage: 'Apr',
      })}-${year}`;
    case '05':
      return `${day}-${intl.formatMessage({
        id: 'peyment_may',
        defaultMessage: 'May',
      })}-${year}`;
    case '06':
      return `${day}-${intl.formatMessage({
        id: 'peyment_june',
        defaultMessage: 'June',
      })}-${year}`;
    case '07':
      return `${day}-${intl.formatMessage({
        id: 'peyment_july',
        defaultMessage: 'July',
      })}-${year}`;
    case '08':
      return `${day}-${intl.formatMessage({
        id: 'peyment_aug',
        defaultMessage: 'Aug',
      })}-${year}`;
    case '09':
      return `${day}-${intl.formatMessage({
        id: 'peyment_sept',
        defaultMessage: 'Sept',
      })}-${year}`;
    case '10':
      return `${day}-${intl.formatMessage({
        id: 'peyment_oct',
        defaultMessage: 'Oct',
      })}-${year}`;
    case '11':
      return `${day}-${intl.formatMessage({
        id: 'peyment_nov',
        defaultMessage: 'Nov',
      })}-${year}`;
    case '12':
      return `${day}-${intl.formatMessage({
        id: 'peyment_dec',
        defaultMessage: 'Dec',
      })}-${year}`;
    default:
      return ' ';
  }
};

export const convertDigits = (number, isHive) =>
  parseFloat(Math.round(number * 1000) / 1000).toFixed(isHive ? 3 : 2);

export const getCurrentUSDPrice = () => {
  const cryptosPriceHistory = useSelector(state => state.app.cryptosPriceHistory);

  if (isEmpty(cryptosPriceHistory)) return !cryptosPriceHistory;
  const currentUSDPrice =
    cryptosPriceHistory &&
    cryptosPriceHistory.hive &&
    cryptosPriceHistory.hive.usdPriceHistory &&
    cryptosPriceHistory.hive.usdPriceHistory.usd;

  return currentUSDPrice;
};

export const getDaysLeft = (reserveDate, daysCount) => {
  const currentTime = moment(Date.now()).unix();
  const reservationTime = moment(reserveDate).unix() + daysCount * 86400;
  return parseInt((reservationTime - currentTime) / 86400, 10);
};

export const getFrequencyAssign = objectDetails => {
  const requiredObjectName = getFieldWithMaxWeight(objectDetails.requiredObject, 'name');
  return objectDetails.frequency_assign
    ? `<ul><li>User did not receive a reward from <a href="/@${objectDetails.guide.name}">${objectDetails.guide.name}</a> for reviewing <a href="/object/${objectDetails.requiredObject.author_permlink}">${requiredObjectName}</a> in the last ${objectDetails.frequency_assign} days and does not have an active reservation for such a reward at the moment.</li></ul>`
    : '';
};

export const getAgreementObjects = objectDetails =>
  !isEmpty(objectDetails.agreementObjects)
    ? `including the following: Legal highlights: ${reduce(
        objectDetails.agreementObjects,
        (acc, obj) => ` ${acc} <a href='/object/${obj}/page'>${obj}</a> `,
        '',
      )}`
    : '';

export const getMatchBots = objectDetails =>
  !isEmpty(objectDetails.match_bots)
    ? reduce(objectDetails.match_bots, (acc, bot) => `${acc}, <a href='/@${bot}'>${bot}</a>`, '')
    : '';

export const getUsersLegalNotice = objectDetails =>
  objectDetails.usersLegalNotice
    ? `<p><b>Legal notice:</b></p><p>${objectDetails.usersLegalNotice}</p>`
    : '';

export const getReceiptPhoto = objectDetails =>
  objectDetails.requirements.receiptPhoto
    ? `<p>Photo of the receipt (without personal details);</p>`
    : '';

export const getDescription = objectDetails =>
  objectDetails.description
    ? `<p>Additional requirements/notes: ${objectDetails.description}</p>`
    : '';

const getFollowingObjects = objectDetails =>
  !isEmpty(objectDetails.objects)
    ? map(objectDetails.objects, obj => ({
        name: getFieldWithMaxWeight(obj.object || obj, 'name'),
        permlink: obj.author_permlink || obj.object.author_permlink,
      }))
    : '';

const getLinksToAllFollowingObjects = followingObjects =>
  reduce(
    followingObjects,
    (acc, obj) => `${acc}, <a href='/object/${obj.permlink}'>${obj.name}</a>`,
    '',
  ).slice(1);

export const getMinExpertise = ({
  campaignMinExpertise,
  rewardFundRecentClaims,
  rewardFundRewardBalance,
  rate,
}) => {
  if (!isEmpty(rewardFundRecentClaims) && !isEmpty(rewardFundRewardBalance)) {
    return round(
      (campaignMinExpertise / rewardFundRecentClaims) *
        rewardFundRewardBalance.replace(' HIVE', '') *
        rate *
        1000000,
      2,
    );
  }
  return '';
};

export const getMinExpertisePrepared = ({ minExpertise, rewardFund, rate }) =>
  round(
    (minExpertise * rewardFund.recent_claims) /
      rewardFund.reward_balance.replace(' HIVE', '') /
      rate /
      1000000,
    2,
  );

export const getDetailsBody = ({
  proposition,
  proposedWobjName,
  proposedAuthorPermlink,
  primaryObjectName,
  secondaryObjectName,
  rate,
  recentClaims,
  rewardBalance,
}) => {
  const followingObjects = getFollowingObjects(proposition);
  const links = getLinksToAllFollowingObjects(followingObjects);
  const propositionMinExpertise = proposition.userRequirements.minExpertise;
  const minExpertise = getMinExpertise({
    campaignMinExpertise: propositionMinExpertise,
    rewardFundRecentClaims: recentClaims,
    rewardFundRewardBalance: rewardBalance,
    rate,
  });

  const eligibilityRequirements = `
    <p><b>User eligibility requirements:</b></p>
<p>Only users who meet all eligibility criteria can participate in this rewards campaign.</p>
<ul>
    <li>Minimum Waivio expertise: ${minExpertise}</li>
    <li>Minimum number of followers: ${proposition.userRequirements.minFollowers}</li>
    <li>Minimum number of posts: ${proposition.userRequirements.minPosts}</li>
</ul>`;
  const frequencyAssign = getFrequencyAssign(proposition);
  const blacklist = `<ul><li>User account is not blacklisted by <a href='/@${proposition.guide.name}'>${proposition.guide.name}</a> or referenced accounts.</li></ul>`;
  const receiptPhoto = getReceiptPhoto(proposition);
  const linkToFollowingObjects = secondaryObjectName
    ? `<li>Link to <a href='/object/${proposedAuthorPermlink}'>${proposedWobjName}</a></li>`
    : `<li>Link to one of the following objects: ${links}</li>`;
  const proposedWobj = secondaryObjectName
    ? `of <a href="/object/${proposedAuthorPermlink}">${proposedWobjName}</a>`
    : '';
  const postRequirements = `<p><b>Post requirements:</b></p>
<p>For the review to be eligible for the award, all the following requirements must be met:</p>
<ul><li>Minimum ${
    proposition.requirements.minPhotos
  } original photos ${proposedWobj}</li> ${receiptPhoto} ${linkToFollowingObjects}
<li>Link to <a href="/object/${proposition.requiredObject.author_permlink ||
    proposition.requiredObject}">${primaryObjectName}</a></li></ul> `;
  const description = getDescription(proposition);
  const sponsor = `<p>Sponsor reserves the right to refuse the payment if review is suspected to be fraudulent, spam, poorly written or for other reasons as stated in the agreement.</p>`;
  const agreementObjects = getAgreementObjects(proposition);
  const matchBots = getMatchBots(proposition);
  const rewards = `<p><b>Reward:</b></p>
<p>The amount of the reward is determined in HIVE at the time of reservation. The reward will be paid in the form of a combination of upvotes (Hive Power) and direct payments (liquid HIVE). Only upvotes from registered accounts (<a href='/@${proposition.guide.name}'>${proposition.guide.name}</a> ${matchBots} ) count towards the payment of rewards. The value of all other upvotes is not subtracted from the specified amount of the reward.</p>`;
  const legal = `<p><b>Legal:</b></p>
<p>By making the reservation, you confirm that you have read and agree to the <a href="/object/xrj-terms-and-conditions/page">Terms and Conditions of the Service Agreement</a> ${agreementObjects}</p>`;
  const usersLegalNotice = getUsersLegalNotice(proposition);

  return `${eligibilityRequirements} ${frequencyAssign} ${blacklist} ${postRequirements} ${description} ${sponsor} ${rewards} ${legal} ${usersLegalNotice}`;
};

export const sortDebtObjsData = (items, sortBy) => {
  if (!items || !items.length) return [];
  if (!sortBy) return items;
  let comparator;
  switch (sortBy) {
    case 'time':
      comparator = (a, b) => (a.lastCreatedAt < b.lastCreatedAt ? 1 : -1);
      break;
    default:
      comparator = (a, b) => (b.payable > a.payable ? 1 : -1);
      break;
  }
  const sorted = items.sort(comparator);

  return sorted;
};

export const getProcessingFee = data => {
  if (!data || isEmpty(data)) return null;

  const amounts = {
    share: get(data, ['details', 'commissionWeight']) || '',
    hive: get(data, ['amount']) || '',
    usd: get(data, ['details', 'payableInDollars']) || '',
  };

  switch (data.type) {
    case 'index_fee':
      return {
        name: 'Rewards indexing',
        account: 'waivio.index',
        ...amounts,
      };
    case 'referral_server_fee':
      return {
        name: 'Referral',
        account: 'waivio.referrals',
        ...amounts,
      };
    case 'campaign_server_fee':
      return {
        name: 'Campaign management',
        account: 'waivio.campaigns',
        ...amounts,
      };
    default:
      return null;
  }
};

export const payablesFilterData = location => {
  if (location.pathname === '/rewards/payables') {
    return [
      {
        filterName: 'days',
        value: 7,
        defaultMessage: `Over {value} days`,
      },
      {
        filterName: 'moreDays',
        value: 15,
        defaultMessage: `Over {value} days`,
      },
      {
        filterName: 'otherDays',
        value: 30,
        defaultMessage: `Over {value} days`,
      },
      {
        filterName: 'payable',
        value: 10,
        defaultMessage: `Over {value} HIVE`,
      },
    ];
  }
  return [
    {
      filterName: 'days',
      value: 15,
      defaultMessage: `Over {value} days`,
    },
    {
      filterName: 'moreDays',
      value: 30,
      defaultMessage: `Over {value} days`,
    },
    {
      filterName: 'payable',
      value: 20,
      defaultMessage: `Over {value} HIVE`,
    },
  ];
};

export const getMemo = (isReceiverGuest, pathRecivables, isOverpayment) => {
  if (pathRecivables && isOverpayment) {
    return REWARD.overpayment_refund;
  }
  if (isReceiverGuest) {
    return REWARD.guestReward;
  }
  return REWARD.userReward;
};

export const getContent = listType => {
  if (listType === 'references') {
    return {
      title: {
        id: 'recognize_other_users_blacklists',
        defaultMessage: "Recognize other users' blacklists",
      },
      caption: {
        id: 'when_you_reference_another_users_blacklist',
        defaultMessage:
          "When you reference another user's blacklist, you also recognize all other blacklists referred to by that user",
      },
    };
  }

  if (listType === 'whitelist') {
    return {
      title: {
        id: 'add_user_to_whitelist',
        defaultMessage: 'Add user to the whitelist',
      },
      caption: {
        id: 'whitelisted_users_can_participate',
        defaultMessage:
          'Whitelisted users can participate in any campaign (subject to campaign eligibility criteria) sponsored by',
      },
    };
  }

  return {
    title: {
      id: 'add_user_to_blacklist',
      defaultMessage: 'Add user to the blacklist',
    },
    caption: {
      id: 'blacklisted_users_cannot_participate',
      defaultMessage: 'Blacklisted users cannot participate in any campaign sponsored by',
    },
  };
};

export const getSuccessAddMessage = (userNames, listType) => {
  if (listType === 'references') {
    return {
      id: 'you_subscribed_to_other_users_blacklists',
      defaultMessage: "You subscribed to other users' blacklists",
    };
  }
  if (listType === 'whitelist') {
    if (userNames.length > 1) {
      return {
        id: 'users_were_added_to_whitelist',
        defaultMessage: 'Users were added to the whitelist',
      };
    }
    return {
      id: 'user_was_added_to_whitelist',
      defaultMessage: 'User was added to the whitelist',
    };
  }

  if (userNames.length > 1) {
    return {
      id: 'users_were_added_to_blacklist',
      defaultMessage: 'Users were added to blacklist',
    };
  }
  return {
    id: 'user_was_added_to_blacklist',
    defaultMessage: 'User was added to the blacklist',
  };
};

export const getSuccessDeleteMessage = (userNames, listType) => {
  if (listType === 'references') {
    return {
      id: 'you_unsubscribed_from_other_users_blacklists',
      defaultMessage: "You unsubscribed from other users' blacklists",
    };
  }
  if (listType === 'whitelist') {
    if (userNames.length > 1) {
      return {
        id: 'users_were_deleted_from_whitelist',
        defaultMessage: 'Users were deleted from the whitelist',
      };
    }
    return {
      id: 'user_was_deleted_from_whitelist',
      defaultMessage: 'User was deleted from the whitelist',
    };
  }
  if (userNames.length > 1) {
    return {
      id: 'users_were_deleted_from_blacklist',
      defaultMessage: 'Users were deleted from the blacklist',
    };
  }
  return {
    id: 'user_was_deleted_from_blacklist',
    defaultMessage: 'User was deleted from the blacklist',
  };
};

export const getNoBlacklistMessage = userNames => {
  if (userNames.length > 1) {
    return {
      id: 'these_users_do_not_have_blacklists',
      defaultMessage: 'These users do not have blacklists',
    };
  }
  return {
    id: 'this_user_does_not_have_blacklists',
    defaultMessage: 'This user does not have blacklists',
  };
};

export const getSort = (
  match,
  sortAll,
  sortEligible,
  sortReserved,
  sortHistory,
  sortGuideHistory,
  sortMessages,
) => {
  const key = get(match, ['params', 'filterKey']) || get(match, ['params', '0']);
  switch (key) {
    case 'active':
      return sortEligible;
    case 'reserved':
      return sortReserved;
    case HISTORY:
      return sortHistory;
    case MESSAGES:
      return sortMessages;
    case GUIDE_HISTORY:
      return sortGuideHistory;
    default:
      return sortAll;
  }
};

export const popoverDataHistory = {
  assigned: [
    {
      key: 'reserved',
      id: 'view_reservation',
      defaultMessage: 'View reservation',
    },
    {
      key: 'release',
      id: 'campaign_buttons_release',
      defaultMessage: 'Release reservation',
    },
    {
      key: 'decrease',
      id: 'decrease_reward',
      defaultMessage: 'Decrease reward',
    },
  ],
  completed: [
    {
      key: 'reserved',
      id: 'view_reservation',
      defaultMessage: 'View reservation',
    },
    {
      key: 'completed',
      id: 'open_review',
      defaultMessage: 'Open review',
    },
    {
      key: 'show',
      id: 'show_report',
      defaultMessage: 'Show report',
    },
    {
      key: 'decrease',
      id: 'decrease_reward',
      defaultMessage: 'Decrease reward',
    },
  ],
  rejected: [
    {
      key: 'rejected',
      id: 'view_reservation',
      defaultMessage: 'View reservation',
    },
    {
      key: 'rejected',
      id: 'open_review',
      defaultMessage: 'Open review',
    },
    {
      key: 'rejected',
      id: 'rejection_note',
      defaultMessage: 'Rejection note',
    },
  ],
  expired: [
    {
      key: 'reserved',
      id: 'view_reservation',
      defaultMessage: 'View reservation',
    },
  ],
  unassigned: [
    {
      key: 'reserved',
      id: 'view_reservation',
      defaultMessage: 'View reservation',
    },
  ],
};

export const getPopoverDataMessages = ({ propositionStatus, isUserInBlacklist }) => {
  switch (propositionStatus) {
    case 'assigned':
      return [
        {
          key: 'reserved',
          id: 'view_reservation',
          defaultMessage: 'View reservation',
        },
        {
          key: 'release',
          id: 'campaign_buttons_release',
          defaultMessage: 'Release reservation',
        },
        {
          key: isUserInBlacklist ? 'delete' : 'add',
          id: isUserInBlacklist ? 'delete_from_blacklist' : 'add_to_blacklist',
          defaultMessage: isUserInBlacklist ? 'Delete from blacklist' : 'Add to blacklist',
        },
        {
          key: 'add',
          id: 'increase_reward',
          defaultMessage: 'Increase reward',
        },
      ];
    case 'completed':
      return [
        {
          key: 'reserved',
          id: 'view_reservation',
          defaultMessage: 'View reservation',
        },
        {
          key: 'completed',
          id: 'open_review',
          defaultMessage: 'Open review',
        },
        {
          key: 'completed',
          id: 'show_report',
          defaultMessage: 'Show report',
        },
        {
          key: 'reject',
          id: 'reject_review',
          defaultMessage: 'Reject review',
        },
        {
          key: isUserInBlacklist ? 'delete' : 'add',
          id: isUserInBlacklist ? 'delete_from_blacklist' : 'add_to_blacklist',
          defaultMessage: isUserInBlacklist ? 'Delete from blacklist' : 'Add to blacklist',
        },
      ];
    case 'rejected':
      return [
        {
          key: 'reserved',
          id: 'view_reservation',
          defaultMessage: 'View reservation',
        },
        {
          key: 'rejected',
          id: 'open_review',
          defaultMessage: 'Open review',
        },
        {
          key: 'rejected',
          id: 'rejection_note',
          defaultMessage: 'Rejection note',
        },
        {
          key: 'reinstate',
          id: 'reinstate_reward',
          defaultMessage: 'Reinstate reward',
        },
        {
          key: isUserInBlacklist ? 'delete' : 'add',
          id: isUserInBlacklist ? 'delete_from_blacklist' : 'add_to_blacklist',
          defaultMessage: isUserInBlacklist ? 'Delete from blacklist' : 'Add to blacklist',
        },
      ];
    case 'expired':
      return [
        {
          key: 'reserved',
          id: 'view_reservation',
          defaultMessage: 'View reservation',
        },
        {
          key: isUserInBlacklist ? 'delete' : 'add',
          id: isUserInBlacklist ? 'delete_from_blacklist' : 'add_to_blacklist',
          defaultMessage: isUserInBlacklist ? 'Delete from blacklist' : 'Add to blacklist',
        },
      ];
    case 'unassigned':
      return [
        {
          key: 'reserved',
          id: 'view_reservation',
          defaultMessage: 'View reservation',
        },
        {
          key: isUserInBlacklist ? 'delete' : 'add',
          id: isUserInBlacklist ? 'delete_from_blacklist' : 'add_to_blacklist',
          defaultMessage: isUserInBlacklist ? 'Delete from blacklist' : 'Add to blacklist',
        },
      ];
    default:
      return {};
  }
};

export const buttonsTitle = {
  expired: {
    id: 'expired',
    defaultMessage: 'Expired',
  },
  unassigned: {
    id: 'released',
    defaultMessage: 'Released',
  },
  completed: {
    id: 'completed',
    defaultMessage: 'Completed',
  },
  rejected: {
    id: 'rejected',
    defaultMessage: 'Rejected',
  },
  assigned: {
    id: 'campaign_buttons_reserved',
    defaultMessage: 'Reserved',
  },
  default: {
    id: 'campaign_buttons_reserved',
    defaultMessage: 'Reserved',
  },
};

export const getBreadCrumbText = (intl, location, filterKey, rewardText) => {
  if (location === '/rewards/messages') {
    return intl.formatMessage({
      id: MESSAGES,
      defaultMessage: 'Messages',
    });
  } else if (location === '/rewards/history') {
    return intl.formatMessage({
      id: 'history_and_sponsor_communications',
      defaultMessage: 'History and sponsor communications',
    });
  } else if (location === '/rewards/guideHistory') {
    return intl.formatMessage({
      id: 'history_of_reservations',
      defaultMessage: 'History of reservations',
    });
  }
  return intl.formatMessage(rewardText[filterKey]);
};

export const getActiveFilters = ({
  path,
  activeHistoryFilters,
  activeMessagesFilters,
  activeGuideHistoryFilters,
}) => {
  switch (path) {
    case HISTORY:
      return activeHistoryFilters;
    case MESSAGES:
      return activeMessagesFilters;
    case GUIDE_HISTORY:
      return activeGuideHistoryFilters;
    default:
      return '';
  }
};

export const getSortChanged = ({ path, sortHistory, sortMessages, sortGuideHistory }) => {
  switch (path) {
    case HISTORY:
      return sortHistory;
    case MESSAGES:
      return sortMessages;
    case GUIDE_HISTORY:
      return sortGuideHistory;
    default:
      return '';
  }
};
