import { isEmpty } from 'lodash';
import moment from 'moment';
import { getCurrentCurrencyRate } from '../../../waivioApi/ApiClient';

export const validatorMessagesCreator = (messageFactory, currency) => ({
  budgetLess: messageFactory(
    'budget_more_than_thousandth',
    'Budget should be more or equal 0,001 {currency}',
    { currency },
  ),
  budgetWaivLess: messageFactory(
    'waiv_budget_more_than',
    'Budget should be more or equal 0,00000001 {currency}',
    { currency },
  ),
  budgetToZero: messageFactory('budget_more_than_zero', 'Budget should be more than zero'),
  budgetToSteemBalance: messageFactory(
    'budget_overprices_wallet_balance',
    'Budget should not exceed your {currency} wallet balance',
    { currency },
  ),
  rewardsLess: messageFactory(
    'reward_more_than_thousandth',
    'Reward should be more or equal 0,001 HIVE',
  ),
  rewardsWaivLess: messageFactory(
    'waiv_reward_more_than',
    'Reward should be more or equal 0,00000001 {currency}',
    { currency },
  ),
  rewardsNumberAfterDots: messageFactory(
    'reward_cant_be_longer_than_3_characters_after_dot',
    "Reward can't be longer than 3 characters after dot",
    { currency },
  ),
  rewardsNumberAfterDotsWaiv: messageFactory(
    'reward_cant_be_longer_than_8_characters_after_dot',
    "Reward can't be longer than 8 characters after dot",
    { currency },
  ),
  campaingNumberAfterDots: messageFactory(
    'campaing_cant_be_longer_than_3_characters_after_dot',
    "Сampaign budget can't be longer than 3 characters after dot",
    { currency },
  ),
  campaingNumberAfterDotsWaiv: messageFactory(
    'campaing_cant_be_longer_than_8_characters_after_dot',
    "Сampaign budget can't be longer than 8 characters after dot",
    { currency },
  ),
  rewardToZero: messageFactory('reward_more_than_zero', 'Reward should be more than zero'),
  rewardToBudget: messageFactory(
    'reward_not_exceed_budget',
    'The reward should not exceed the budget',
  ),
  minReservationPeriod: messageFactory(
    'reserve_period_one_day',
    'The reservation period must be at least one day',
  ),
  maxReservationPeriod: messageFactory(
    'reserve_period_thirty_days',
    'The reservation period must not exceed thirty days',
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
  minExpertiseValue: messageFactory(
    'minimum_expertise_cannot_have_more_then_two_decimals',
    'The Waivio reputation cannot have more then two digits after the decimal point',
  ),
  steemReputation: messageFactory(
    'steem_reputation_from_100_to_100',
    'The Hive reputation must be from -100 to 100',
  ),
  followersQuality: messageFactory(
    'not_less_zero_followers',
    'Number of followers cannot be negative',
  ),
  expiredDate: messageFactory(
    'expiry_date_after_current',
    'The expiration date must be later than the next day from the current date',
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
  checkPrimaryObject: messageFactory('add_primary_object', 'Add primary object'),
  checkSecondaryObject: messageFactory('add_secondary_object', 'Add secondary object'),
  checkCompensationAccount: messageFactory('add_compensation_account', 'Add compensation account'),
});

export const validatorsCreator = (
  payoutToken,
  user,
  messages,
  getFieldValue,
  requiredObject,
  objectsToAction,
  currency,
  currencyInfo,
  rates,
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
    if (value < 1 && value !== '') {
      callback(messages.minReservationPeriod);
    } else if (value > 30) {
      callback(messages.maxReservationPeriod);
    } else {
      callback();
    }
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
    const dec = String(value).indexOf('.');

    if (dec >= 0 && value.length > dec + 3) {
      callback(messages.minExpertiseValue);
    } else if (value < 0 && value !== '') {
      callback(messages.minExpertise);
    }
    callback();
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
    if (
      moment()
        .add(1, 'days')
        .unix() > value?.unix()
    ) {
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

  compareBudgetValues: async (rule, value, callback) => {
    const rate = await getCurrentCurrencyRate(currency);
    const isHive = payoutToken === 'HIVE';
    const dotIndex = value.indexOf('.');
    const userUSDBalance = isHive
      ? parseFloat(user.balance) * rate[currency]
      : currencyInfo.balance * rates * rate[currency];

    if (isHive) {
      if (value > 0 && value < 0.001) callback(messages.budgetLess);
      if (dotIndex > 0 && value.length - dotIndex + 1 > 3)
        callback(messages.campaingNumberAfterDots);
    } else {
      if (value > 0 && value < 0.00000001) callback(messages.budgetWaivLess);
      if (dotIndex > 0 && value.length - (dotIndex + 1) > 8)
        callback(messages.campaingNumberAfterDotsWaiv);
    }

    if (value <= 0 && value !== '') callback(messages.budgetToZero);
    else if (userUSDBalance < value) callback(messages.budgetToSteemBalance);
    else callback();
  },

  compareRewardAndBudget: (rule, value, callback) => {
    const isHive = payoutToken === 'HIVE';
    const dotIndex = value.indexOf('.');

    if (isHive) {
      if (value > 0 && value < 0.001) callback(messages.rewardsLess);
      if (dotIndex > 0 && value.length - dotIndex + 1 > 3)
        callback(messages.rewardsNumberAfterDots);
    } else {
      if (value > 0 && value < 0.00000001) callback(messages.rewardsWaivLess);
      if (dotIndex > 0 && value.length - (dotIndex + 1) > 8)
        callback(messages.rewardsNumberAfterDotsWaiv);
    }

    if (value <= 0 && value !== '') callback(messages.rewardToZero);
    else callback();
  },
});
