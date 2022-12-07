import { useSelector } from 'react-redux';
import { isEmpty, map, get, reduce, round } from 'lodash';
import moment from 'moment';
import { MESSAGES, GUIDE_HISTORY, HISTORY } from '../../common/constants/rewards';
import { getObjectName } from '../../common/helpers/wObjectHelper';
import { getCryptosPriceHistory } from '../../store/appStore/appSelectors';
import { getObjectsByIds } from '../../waivioApi/ApiClient';

const isLocation = typeof location !== 'undefined';
const isSessionStorage = typeof sessionStorage !== 'undefined';

export const displayLimit = 10;

export const rewardPostContainerData = {
  author: 'monterey',
  permlink: 'test-post',
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

export const convertDigits = number => {
  if (number) {
    return parseFloat(Math.round(number * 1000) / 1000).toFixed(3);
  }

  return 0;
};

export const getCurrentUSDPrice = () => {
  const cryptosPriceHistory = useSelector(getCryptosPriceHistory);

  if (isEmpty(cryptosPriceHistory)) return !cryptosPriceHistory;

  return get(cryptosPriceHistory, ['hive', 'usdPriceHistory', 'usd']);
};

export const getDaysLeftForNew = (reserveDate, daysCount) => {
  const currentTime = moment();
  const reservationTime = moment(reserveDate).add(daysCount + 1, 'days');

  return reservationTime.diff(currentTime, 'days');
};

export const getFrequencyAssign = objectDetails => {
  const requiredObjectName = getObjectName(objectDetails.required_object);
  const requiredObjectAuthorPermlink = get(objectDetails, ['requiredObject', 'author_permlink']);

  return objectDetails.frequency_assign
    ? `<ul><li>User did not receive a reward from <a href="/@${objectDetails.guide.name}">${objectDetails.guide.name}</a> for reviewing <a href="/object/${requiredObjectAuthorPermlink}">${requiredObjectName}</a> in the last ${objectDetails.frequency_assign} days and does not have an active reservation for such a reward at the moment.</li></ul>`
    : '';
};

export const getAgreementObjects = objectDetails =>
  !isEmpty(objectDetails.agreementObjects)
    ? ` including the following: Legal highlights: ${reduce(
        objectDetails.agreementObjects,
        (acc, obj) => ` ${acc} <a href='/object/${obj}/page'>${obj}</a> `,
        '',
      )}`
    : '';

export const getAgreementObjectsLink = agreementObjects =>
  !isEmpty(agreementObjects)
    ? `${reduce(
        agreementObjects,
        (acc, obj, i, arr) =>
          `${acc} <a href="${obj.defaultShowLink}">${getObjectName(obj)}</a>${
            arr.length > 1 && arr.length - 1 !== i ? ', ' : ''
          }`,
        '',
      )}`
    : '';

export const getMatchBots = objectDetails => {
  const matchBots = objectDetails.match_bots || objectDetails.matchBots;

  return !isEmpty(matchBots)
    ? reduce(matchBots, (acc, bot) => `${acc}, <a href='/@${bot}'>${bot}</a>`, ' ')
    : '';
};

export const getUsersLegalNotice = objectDetails =>
  objectDetails.usersLegalNotice
    ? `including following: <b>${objectDetails.usersLegalNotice}</b>.`
    : '.';

export const getReceiptPhoto = objectDetails =>
  objectDetails?.requirements?.receiptPhoto
    ? `<li>Photo of the receipt (without personal details);</li>`
    : '';

export const getDescription = objectDetails =>
  objectDetails.description
    ? `<p>Additional requirements/notes: ${objectDetails.description}</p>`
    : '';

const getFollowingObjects = objectDetails =>
  !isEmpty(objectDetails.objects)
    ? map(objectDetails.objects, obj => ({
        name: getObjectName(obj.object || obj),
        permlink: obj?.author_permlink || obj?.object?.author_permlink,
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

  return 0;
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
    <li>Minimum Waivio expertise: ${minExpertise};</li>
    <li>Minimum number of followers: ${proposition.userRequirements.minFollowers};</li>
    <li>Minimum number of posts: ${proposition.userRequirements.minPosts};</li>
</ul>`;
  const frequencyAssign = getFrequencyAssign(proposition);
  const guideName = proposition?.guide?.name || proposition?.guideName;
  const blacklist = `<ul><li>User account is not blacklisted by <a href='/@${guideName}'>${guideName}</a> or referenced accounts.</li></ul>`;
  const receiptPhoto = getReceiptPhoto(proposition);
  const linkToFollowingObjects = proposedWobjName
    ? `<li>Link to <a href='/object/${proposedAuthorPermlink}'>${proposedWobjName}</a></li>`
    : `<li>Link to one of the following objects: ${links}</li>`;
  const proposedWobj = proposedWobjName
    ? `of <a href="/object/${proposedAuthorPermlink}">${proposedWobjName}</a>`
    : '';
  const postRequirements = `<p><b>Post requirements:</b></p>
<p>For the review to be eligible for the award, all the following requirements must be met:</p>
<ul><li>Minimum ${
    proposition.requirements.minPhotos
  } original photos ${proposedWobj}</li> ${receiptPhoto} ${linkToFollowingObjects};
<li>Link to <a href="/object/${proposition?.requiredObject?.author_permlink ||
    proposition?.requiredObject ||
    proposition?.parent?.author_permlink}">${primaryObjectName}</a>;</li></ul> `;
  const description = getDescription(proposition);
  const sponsor = `<p>Sponsor reserves the right to refuse the payment if review is suspected to be fraudulent, spam, poorly written or for other reasons as stated in the agreement.</p>`;
  const agreementObjects = getAgreementObjects(proposition);
  const matchBots = getMatchBots(proposition);

  const rewards = `<p><b>Reward:</b></p>
<p>The amount of the reward is determined in HIVE at the time of reservation. The reward will be paid in the form of a combination of upvotes (Hive Power) and direct payments (liquid HIVE). Only upvotes from registered accounts (<a href='/@${guideName}'>${guideName}</a> ${matchBots}) count towards the payment of rewards. The value of all other upvotes is not subtracted from the specified amount of the reward.</p>`;
  const legal = `<p><b>Legal:</b></p>
<p>By making the reservation, you confirm that you have read and agree to the ${agreementObjects}.</p>`;
  const usersLegalNotice = getUsersLegalNotice(proposition);

  return `${eligibilityRequirements} ${frequencyAssign} ${blacklist} ${postRequirements} ${description} ${sponsor} ${rewards} ${legal} ${usersLegalNotice}`;
};

export const getNewDetailsBody = async (propos, parentObj) => {
  const proposition = propos?.propositions
    ? { ...propos?.propositions[0], object: propos }
    : propos;
  const parent = parentObj || proposition.requiredObject;
  const proposedWobjName = getObjectName(proposition.object);
  const frequencyAssign = getFrequencyAssign(proposition);
  const receiptPhoto = getReceiptPhoto(proposition);

  const eligibilityRequirements = `
    <p><b>User eligibility requirements:</b></p>
<p>Only users who meet all eligibility criteria can participate in this rewards campaign.</p>
<ul><li>Minimum Waivio expertise: ${proposition?.userRequirements?.minExpertise};</li><li>Minimum number of followers: ${proposition.userRequirements.minFollowers};</li><li>Minimum number of posts: ${proposition.userRequirements.minPosts};</li></ul>`;
  const blacklist = `<ul><li>User account is not blacklisted by <a href='/@${proposition?.guideName}'>${proposition?.guideName}</a> or referenced accounts.</li></ul>`;
  const linkToFollowingObjects = `<li>Link to <a href="${proposition.object.defaultShowLink}">${proposedWobjName}</a>;</li>`;
  const proposedWobj = proposedWobjName
    ? `of <a href='${proposition.object.defaultShowLink}'>${proposedWobjName}</a>`
    : '';
  const postRequirements = `<p><b>Post requirements:</b></p>
<p>For the review to be eligible for the award, all the following requirements must be met:</p>
<ul><li>Minimum ${
    proposition.requirements.minPhotos
  } original photos ${proposedWobj};</li>${receiptPhoto} ${linkToFollowingObjects}<li>Link to <a href='${
    parent?.defaultShowLink
  }'>${getObjectName(parent)}</a>;</li></ul> `;
  const sponsor = `<p>Sponsor reserves the right to refuse the payment if review is suspected to be fraudulent, spam, poorly written or for other reasons as stated in the agreement.</p>`;
  const agreementObjects = isEmpty(proposition?.agreementObjects)
    ? null
    : await getObjectsByIds({ authorPermlinks: proposition?.agreementObjects });
  const agreementObjectsLink = getAgreementObjectsLink(agreementObjects?.wobjects);

  const matchBots = getMatchBots(proposition);
  const rewards = `<p><b>Reward:</b></p>
<p>The amount of the reward is determined in ${proposition.payoutToken} at the time of reservation. The reward will be paid in the form of a combination of upvotes (${proposition.payoutToken} Power) and direct payments (liquid ${proposition.payoutToken}). Only upvotes from registered accounts (<a href='/@${proposition.guideName}'>${proposition.guideName}</a>${matchBots}) count towards the payment of rewards. The value of all other upvotes is not subtracted from the specified amount of the reward.</p>`;
  const legal =
    agreementObjects || proposition?.usersLegalNotice
      ? `<p><b>Legal:</b></p><p>By making the reservation, you confirm that you have read and agree to the ${agreementObjectsLink}${getUsersLegalNotice(
          proposition,
        )}</p>`
      : '';

  return `${eligibilityRequirements} ${frequencyAssign} ${blacklist} ${postRequirements} ${sponsor} ${rewards} ${legal}`;
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
    share: get(data, ['details', 'commissionWeight']) || get(data, 'commission'),
    hive: get(data, ['amount']) || '',
    usd: get(data, ['details', 'payableInDollars']) || get(data, 'payableInUSD') || '',
  };

  switch (data.type) {
    case 'index_fee':
    case 'indexFee':
      return {
        name: 'Rewards indexing',
        account: 'waivio.index',
        ...amounts,
      };
    case 'referral_server_fee':
    case 'referralServerFee':
      return {
        name: 'Referral',
        account: data.userName,
        ...amounts,
      };
    case 'campaign_server_fee':
    case 'campaignServerFee':
      return {
        name: 'Campaign management',
        account: 'waivio.campaigns',
        ...amounts,
      };
    default:
      return null;
  }
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

export const openNewTab = url => {
  const newWindow = window.open();

  newWindow.opener = null;
  newWindow.location = url;
  newWindow.target = '_blank';
};

export const getProposOrWobjId = item => get(item, ['_id'], '');

export const setSessionData = (key, value) =>
  isSessionStorage && sessionStorage.setItem(key, value);

export const getSessionData = key => isSessionStorage && sessionStorage.getItem(key);

export const removeSessionData = (item1, item2) => {
  if (isSessionStorage) {
    if (item1 && item2) {
      sessionStorage.removeItem(`${item1}`);
      sessionStorage.removeItem(`${item2}`);
    } else {
      sessionStorage.removeItem(`${item1}`);
    }
  }
};

export const widgetUrlConstructor = (widgetLink, userName, ref, pathname) => {
  let currUrl = '';

  if (pathname) {
    currUrl += pathname;
  }

  if (widgetLink) {
    currUrl += `?display=${widgetLink}`;
  }
  if (userName) {
    currUrl += `&userName=${userName}`;
  }
  if (ref) {
    currUrl += `&ref=${ref}`;
  }

  return currUrl;
};

export const clearAllSessionProposition = () => {
  removeSessionData('currentProposId', 'currentWobjId');
  removeSessionData('currentProposIdReserved', 'currentWobjIdReserved');
};

export const handleAddMapCoordinates = coordinates => {
  const searchParams = isLocation && new URLSearchParams(location.search);

  if (!searchParams.get('mapX') && !searchParams.get('mapY')) {
    searchParams.append('mapX', coordinates[0]);
    searchParams.append('mapY', coordinates[1]);
  } else {
    searchParams.delete('mapX');
    searchParams.delete('mapY');
    searchParams.append('mapX', coordinates[0]);
    searchParams.append('mapY', coordinates[1]);
  }
  if (isLocation) {
    history.pushState('', '', `/?${searchParams.toString()}`);
  }
};
