import { isEmpty } from 'lodash';

export const validatorMessagesCreator = messageFactory => ({
  budgetToZero: messageFactory('budget_more_than_zero', 'Budget should be more than zero'),
  budgetToUSBDbalance: messageFactory(
    'budget_overprices_wallet_balance',
    'Budget should not exceed your SBD wallet balance',
  ),
  rewardToZero: messageFactory('reward_more_than_zero', 'Reward should be more than zero'),
  rewardToBudget: messageFactory(
    'reward_not_exceed_budget',
    'The reward should not exceed the budget',
  ),
  reservationPeriod: messageFactory(
    'reserve_period_one_day',
    'The reservation period must be at least one day',
  ),
  photosQuality: messageFactory('not_less_zero_photos', 'Should not be less than zero photos'),
  commission: messageFactory(
    'not_less_five_commission_value',
    'Commissions must not be less than 5%',
  ),
  minExpertise: messageFactory(
    'reputation_cannot_be_negative',
    'The Waivio reputation cannot be negative',
  ),
  steemReputation: messageFactory(
    'steem_reputation_from_100_to_100',
    'The Steem reputation must be from -100 to 100',
  ),
  followersQuality: messageFactory(
    'not_less_zero_followers',
    'Number of followers cannot be negative',
  ),
  expiredDate: messageFactory(
    'expiry_date_after_current',
    'The expiry date must be after the current date',
  ),
  postsQuantity: messageFactory('not_less_zero_posts', 'Number of posts cannot be negative'),
  eligibleQuantity: messageFactory(
    'not_less_zero_eligibility_period',
    'Eligibility period cannot be negative',
  ),
  nameField: messageFactory(
    'not_valid_campaign_name',
    'Invalid campaign name. Only alphanumeric characters, hyphens, underscores and dots are allowed',
  ),
  checkPrimaryObject: messageFactory('select_prim_object', 'Add the primary object'),
  checkSecondaryObject: messageFactory('add_secondary_object', 'Add the secondary object'),
});

export const validatorsCreator = (
  user,
  currentSteemDollarPrice,
  messages,
  getFieldValue,
  requiredObject,
  objectsToAction,
) => ({
  checkPrimaryObject: (rule, value, callback) => {
    // eslint-disable-next-line no-unused-expressions
    isEmpty(requiredObject) ? callback(messages.checkPrimaryObject) : callback();
  },

  checkSecondaryObject: (rule, value, callback) => {
    // eslint-disable-next-line no-unused-expressions
    isEmpty(objectsToAction) ? callback(messages.checkSecondaryObject) : callback();
  },

  checkReservationPeriod: (rule, value, callback) => {
    // eslint-disable-next-line no-unused-expressions
    value < 1 && value !== '' ? callback(messages.reservationPeriod) : callback();
  },

  checkPhotosQuantity: (rule, value, callback) => {
    // eslint-disable-next-line no-unused-expressions
    value < 0 && value !== '' ? callback(messages.photosQuality) : callback();
  },

  checkCommissionValue: (rule, value, callback) => {
    // eslint-disable-next-line no-unused-expressions
    value < 5 && value !== '' ? callback(messages.commission) : callback();
  },

  checkMinExpertise: (rule, value, callback) => {
    // eslint-disable-next-line no-unused-expressions
    value < 0 && value !== '' ? callback(messages.minExpertise) : callback();
  },

  checkSteemReputation: (rule, value, callback) => {
    // eslint-disable-next-line no-unused-expressions
    (value < -100 || value > 100) && value !== '' ? callback(messages.steemReputation) : callback();
  },

  checkFollowersQuantity: (rule, value, callback) => {
    // eslint-disable-next-line no-unused-expressions
    value < 0 ? callback(messages.followersQuality) : callback();
  },

  checkExpireDate: (rule, value, callback) => {
    const currentDay = new Date().getDate();
    if ((value && value.unix() * 1000 < Date.now()) || (value && value.date() === currentDay)) {
      callback(messages.expiredDate);
    } else {
      callback();
    }
  },

  checkPostsQuantity: (rule, value, callback) => {
    // eslint-disable-next-line no-unused-expressions
    value < 0 ? callback(messages.postsQuantity) : callback();
  },

  checkEligibilityPeriod: (rule, value, callback) => {
    // eslint-disable-next-line no-unused-expressions
    value < 0 ? callback(messages.eligibleQuantity) : callback();
  },

  checkNameFieldIsEmpty: (rule, value, callback) => {
    // eslint-disable-next-line no-unused-expressions
    value && value.match(/^ *$/) !== null ? callback(messages.nameField) : callback();
  },

  compareBudgetValues: (rule, value, callback) => {
    const userUSDBalance = parseFloat(user.sbd_balance) * currentSteemDollarPrice;
    if (value <= 0 && value !== '') callback(messages.budgetToZero);
    else if (userUSDBalance < value) callback(messages.budgetToUSBDbalance);
    else callback();
  },

  compareRewardAndBudget: (rule, value, callback) => {
    const budgetValue = getFieldValue('budget');

    if (value <= 0 && value !== '') callback(messages.rewardToZero);
    else if (budgetValue < value) callback(messages.rewardToBudget);
    else callback();
  },
});
