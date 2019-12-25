import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';

export const displayLimit = 10;

export const rewardPostContainerData = {
  author: 'monterey',
  permlink: 'test-post',
};
export const preparePropositionReqData = ({
  username,
  match,
  coordinates,
  area,
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
  if (username) reqData.currentUserName = username;
  if (coordinates && coordinates.length > 0) {
    reqData.coordinates = coordinates;
  }
  if (area && area.length > 0 && radius) {
    reqData.area = area;
    reqData.radius = radius;
  }
  if (types && guideNames) {
    reqData.types = types;
    reqData.guideNames = guideNames;
  }
  switch (match.params.filterKey) {
    case 'active':
      reqData.userName = username;
      reqData.approved = false;
      break;
    case 'history':
      reqData.status = ['inactive', 'expired', 'deleted', 'payed'];
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

export const convertDigits = number => parseFloat((Math.round(number * 1000) / 1000).toFixed(3));

export const getCurrentUSDPrice = () => {
  const cryptosPriceHistory = useSelector(state => state.app.cryptosPriceHistory);
  if (isEmpty(cryptosPriceHistory)) return !cryptosPriceHistory;
  const currentUSDPrice =
    cryptosPriceHistory &&
    cryptosPriceHistory.STEEM &&
    cryptosPriceHistory.STEEM.priceDetails.currentUSDPrice;
  return currentUSDPrice;
};

export const getDaysLeft = (reserveDate, daysCount) => {
  const currentTime = moment(Date.now()).unix();
  const reservationTime = moment(reserveDate).unix() + daysCount * 86400;
  return parseInt((reservationTime - currentTime) / 86400, 10);
};
