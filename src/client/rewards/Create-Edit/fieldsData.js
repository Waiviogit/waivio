export default (messageFactory, validators, userName, currency, campaingType) => ({
  campaignName: {
    name: 'campaignName',
    label: messageFactory('campaign_name', 'campaign name'),
    rules: [
      {
        required: true,
        message: messageFactory('input_campaign_name', 'Please, input your Campaign name!'),
      },
      {
        max: 100,
        message: messageFactory(
          'campaign_name_error_long',
          'The name of the campaign should not exceed 100 symbols',
        ),
      },
      {
        validator: validators.checkNameFieldIsEmpty,
      },
    ],
    caption: messageFactory(
      'campaign_names_used_internal_reports',
      'Campaign names are used only for internal reports',
    ),
  },
  campaignType: {
    name: 'type',
    label: messageFactory('campaign_type', 'campaignType'),
    rules: [
      {
        required: true,
        message: messageFactory('select_campaign_type', 'Please, select your campaign type!'),
      },
    ],
    select: messageFactory('select_campaign_type_option', 'Select campaign type'),
    options: [
      { message: messageFactory('reviews', 'Reviews'), value: 'reviews' },
      { message: messageFactory('mentions', 'Mentions'), value: 'mentions' },
      {
        message: messageFactory('giveaways_object', 'Giveaways'),
        value: 'giveaways_object',
      },
      { message: messageFactory('contests_object', 'Contests'), value: 'contests_object' },
    ],
    caption: messageFactory(
      'specific_campaign_parameters_type',
      'The campaign parameters are specific to the type of campaign',
    ),
  },
  campaignWinners: {
    name: 'winners',
    label: messageFactory('campaign_winners', 'campaignWinners'),
    rules: [
      {
        required: true,
        message: messageFactory('select_campaign_winners', 'Winners are required.'),
      },
      {
        validator: validators.checkWinners
      }
    ],
    // caption: messageFactory(
    //   'specific_campaign_parameters_type',
    //   'The campaign parameters are specific to the type of campaign',
    // ),
  },
  campaignTypeItem: {
    name: 'itemType',
    label: messageFactory('link_primary_item_type', 'Link to the primary (parent) item type'),
    rules: [
      {
        required: true,
        message: messageFactory('select_campaign_reach', 'Please, select your campaign reach!'),
      },
    ],
    select: messageFactory('select_link_primary_item_type', 'Select campaign reach'),
    options: [
      { message: messageFactory('object', 'Object'), value: 'object' },
      { message: messageFactory('user', 'User'), value: 'user' },
      { message: messageFactory('url', 'Url'), value: 'url' },
    ],
    caption: messageFactory(
      'specific_campaign_parameters_reach',
      'If the campaign has a local reach, make sure that the primary object has both longitude and latitude specified.',
    ),
  },
  campaignReach: {
    name: 'reach',
    label: messageFactory('campaign_reach', 'Campaign reach'),
    rules: [
      {
        required: true,
        message: messageFactory('select_campaign_reach', 'Please, select your campaign reach!'),
      },
    ],
    select: messageFactory('select_campaign_reach_option', 'Select campaign reach'),
    options: [
      { message: messageFactory('global', 'Global'), value: 'global' },
      { message: messageFactory('local', 'Local'), value: 'local' },
    ],
    caption: messageFactory(
      'specific_campaign_parameters_reach',
      'If the campaign has a local reach, make sure that the primary object has both longitude and latitude specified.',
    ),
  },
  baseCurrency: {
    name: 'baseCurrency',
    label: messageFactory('display_currency', 'Display currency'),
    rules: [
      {
        required: true,
        message: messageFactory('select_base_currency', 'Please, select your campaign currency!'),
      },
    ],
    options: {
      reviews: messageFactory('reviews', 'Reviews'),
    },
    caption: messageFactory(
      'disclaimer_campaign_currency',
      'Disclaimer: Exchange rates are provided by third parties and may not be accurate.',
    ),
  },
  baseCryptocurrency: {
    name: 'baseCryptocurrency',
    label: messageFactory('payment_currency', 'Payment currency'),
    rules: [
      {
        required: true,
        message: messageFactory('select_base_currency', 'Please, select your campaign currency!'),
      },
    ],
    options: {
      reviews: messageFactory('reviews', 'Reviews'),
    },
    caption: messageFactory(
      'All_payment_obligations_calculated',
      'All payment obligations will be calculated in that currency based on the exchange rates at the time of the transactions.',
    ),
  },
  budget: {
    name: 'budget',
    label: messageFactory('campaign_budget', 'Campaign budget (monthly, {currency})', { currency }),
    rules: [
      {
        required: true,
        message: messageFactory('set_monthly_budget', 'Please, set your monthly budget!'),
      },
      {
        validator: validators.compareBudgetValues,
      },
    ],
    caption: messageFactory(
      'unused_portion_not_accumulate',
      'The unused portion of the budget does not accumulate',
    ),
  },
  reward: {
    name: 'reward',
    label: campaingType === 'giveaways_object' ?
      messageFactory('reward_per_review_giveaways_object', 'Reward (per winner, {currency})', {
      currency,
    }) : messageFactory('reward_per_review_STEEM', 'Reward (per review, {currency})', {
      currency,
    }),
    rules: [
      {
        required: true,
        message: messageFactory('set_reward', 'Please, set a reward!'),
      },
      {
        validator: validators.compareRewardAndBudget,
      },
    ],
    caption: messageFactory(
      'reward_portion_using_upvotes_registered_accounts',
      'Portion of the reward can be paid using upvotes from registered accounts',
    ),
  },
  sponsorsList: {
    name: 'sponsorsList',
    label: messageFactory(
      'registered_upvoting_accounts_text',
      `Registered upvoting accounts besides @${userName} (optional, up to 5)`,
    ),
    placeholder: messageFactory('users_auto_complete_placeholder', 'Find user'),
    caption: messageFactory(
      'value_of_upvotes_can_be_accumulated_on_compensation_account',
      'The value of upvotes can be accumulated on a dedicated compensation account',
    ),
    rules: [
      {
        validator: validators.checkSponsorsList,
      },
    ],
  },
  compensationAccount: {
    name: 'compensationAccount',
    label: messageFactory('compensation_account_optional', 'Compensation account (optional)'),
    placeholder: messageFactory('users_auto_complete_placeholder', 'Find user'),
    caption: messageFactory(
      'accumulates_value_of_upvotes_from_registered_upvoting_accounts',
      'Accumulates the value of upvotes from registered upvoting accounts',
    ),
  },
  primaryObject: {
    name: 'primaryObject',
    label: messageFactory('link_parent_object', 'Link to the primary (parent) object'),
    rules: [
      {
        validator: validators.checkPrimaryObject,
      },
    ],
    placeholder: messageFactory('object_auto_complete_placeholder', 'Find object'),
    caption: messageFactory('example_parent_object', 'Example: business, brand, restaurant, etc.'),
  },
  secondaryObject: {
    name: 'secondaryObject',
    label: messageFactory('link_secondary_objects', 'Link to one of the secondary objects'),
    rules: [
      {
        validator: validators.checkSecondaryObject,
      },
    ],
    caption: messageFactory('example_secondary_object', 'Example: product, service, dish, etc.'),
  },
  reservationPeriod: {
    name: 'reservationPeriod',
    label: messageFactory('reservation_period', 'Maximum reservation period (days)'),
    rules: [
      {
        required: true,
        message: messageFactory('set_period', 'Please, set a period!'),
      },
      {
        validator: validators.checkReservationPeriod,
      },
    ],
    caption: messageFactory(
      'budget_reduced_amount_rewards_reserved',
      'The available budget is reduced by the amount of rewards reserved',
    ),
  },
  targetDays: {
    name: 'targetDays',
    label: messageFactory('target_days_for_reviews', 'Target days for reviews'),
    caption: messageFactory(
      'reservation_period_will_dynamically_adjusted',
      'Reservation period will be dynamically adjusted to match target days',
    ),
  },
  minPhotos: {
    name: 'minPhotos',
    label: messageFactory('min_original_photos', 'Minimum number of original photos (per review)'),
    rules: [
      {
        validator: validators.checkPhotosQuantity,
      },
    ],
  },
  minExpertise: {
    name: 'minExpertise',
    label: messageFactory('minimum_waivio_expertise', 'Minimum Waivio expertise (optional)'),
    rules: [
      {
        validator: validators.checkMinExpertise,
      },
    ],
    caption: messageFactory(
      'users_start_with_zero_expertise',
      'New users on Waivio start with expertise of 0',
    ),
  },
  minFollowers: {
    name: 'minFollowers',
    label: messageFactory('min_followers', 'Minimum number of followers (optional)'),
    rules: [
      {
        validator: validators.checkFollowersQuantity,
      },
    ],
    caption: messageFactory('users_start_with_zero_followers', 'New users start with 0 followers'),
  },
  minPosts: {
    name: 'minPosts',
    label: messageFactory('min_posts', 'Minimum number of posts (optional)'),
    rules: [
      {
        validator: validators.checkPostsQuantity,
      },
    ],
    caption: messageFactory('users_start_with_zero_posts', 'New users start with 0 posts'),
  },
  eligibleDays: {
    name: 'eligibleDays',
    label: messageFactory('eligible_days', 'Eligible period (days)'),
    rules: [
      {
        validator: validators.checkEligibilityPeriod,
      },
    ],
    caption: messageFactory(
      'restrictions_frequency_value_should_zero',
      'If there are no restrictions on the frequency of reviews of the primary object by the same user, the value should be set to zero.',
    ),
  },
  legalInfo: {
    header: messageFactory('legal', 'Legal'),
    p_1: messageFactory(
      'reward_payments_made_directly_waivio_provide_information',
      'All reward payments are made directly to users by the campaign creator. Waivio and other partners provide information and discovery services only. ',
    ),
    p_2: messageFactory(
      'can_add_link_agreement_govern_relationships',
      'Here you can add a link to the agreement, which will govern the relationship between you and participating users.',
    ),
  },
  description: {
    name: 'description',
    label: messageFactory('note_reviewers', 'Additional review requirements (optional)'),
    rules: [
      {
        max: 250,
        message: messageFactory(
          'campaign_description_longer_250_symbols',
          'Campaign description should be no longer then 250 symbols!',
        ),
      },
    ],
    caption: messageFactory(
      'note_shown_to_users_of_reward',
      'This note will be shown to users at the time of reservation of the reward',
    ),
  },
  expiredAt: {
    name: 'expiredAt',
    label: messageFactory('campaign_expiry_date', 'Campaign expiry date'),
    rules: [
      {
        type: 'object',
        required: true,
        message: messageFactory('select_time', 'Please, select time!'),
      },
      {
        validator: validators.checkExpireDate,
      },
    ],
  },
  usersLegalNotice: {
    name: 'usersLegalNotice',
    label: messageFactory('legal_notice_users_user', 'Legal notice to users (optional)'),
    rules: [
      {
        max: 250,
        message: messageFactory(
          'campaign_description_longer_250_symbols',
          'Campaign description should be no longer then 250 symbols!',
        ),
      },
    ],
    caption: messageFactory(
      'note_draw_users_attention_specific_terms',
      'This note may be used to draw users attention to the specific terms and conditions of the agreement',
    ),
  },
  agreement: {
    name: 'agreement',
    label: messageFactory('link_agreement', 'Link to the agreement (page object, optional)'),
    placeholder: messageFactory('page_object_placeholder', 'Find page object'),
  },
  checkboxReceiptPhoto: {
    name: 'receiptPhoto',
    valuePropName: 'checked',
    title: messageFactory(
      'request_receipt_photo',
      'Request a photo of the receipt (without personal details)',
    ),
    caption: messageFactory(
      'number_photos_required_increased',
      'If selected, the number of photos required will be increased by one.',
    ),
  },
  checkboxAgree: {
    name: 'checkboxAgree',
    rules: [
      {
        required: true,
        message: messageFactory(
          'read_agreement',
          'Please, read the agreement and check this field',
        ),
      },
    ],
    valuePropName: 'checked',
    textBeforeLink: messageFactory('agree_to_the', 'I agree to the '),
    link: {
      to: '/object/xrj-terms-and-conditions/page',
      text: messageFactory('terms_and_conditions', 'Terms and Conditions'),
    },
    textAfterLink: messageFactory(
      'service_acknowledge_campaign_not_violate_laws',
      'of the service and acknowledge that this campaign does not violate any laws of British Columbia, Canada.',
    ),
  },
  checkboxOnly: {
    name: 'qualifiedPayoutToken',
    valuePropName: 'checked',
    textBeforeLink: messageFactory(
      'read_agreement_only',
      'Only posts eligible to receive a WAIV token reward will be considered qualified for participation in the campaign',
    ),
  },
  commissionAgreement: {
    name: 'commissionAgreement',
    label: messageFactory(
      'agree_to_pay_following_commissions_waivio',
      'I agree to pay the following commissions to Waivio and partners',
    ),
    rules: [
      {
        validator: validators.checkCommissionValue,
      },
    ],
    caption: messageFactory(
      'commissions_must_paid_within_14_days',
      'Commissions and rewards to users must be paid in full within 14 days from the occurrence of payment obligations',
    ),
  },
  createButton: {
    text: messageFactory('create_button_text', 'Create'),
    spanText: messageFactory(
      'create_button_span_text',
      'Once created, the campaign can be activated in the Campaigns/Manage tab.',
    ),
  },
  editButton: {
    text: messageFactory('edit_button_text', 'Save'),
    spanText: messageFactory(
      'edit_button_span_text',
      'Once saved, the campaign can be activated in the Campaigns/Manage tab.',
    ),
  },
  createDuplicate: {
    text: messageFactory('create_duplicate', 'create a duplicate'),
  },
  addChildrenModalTitle: {
    text: messageFactory('add_children_modal_title', 'Add all child objects'),
  },
  addChildrenModalBodyFirstPart: {
    text: messageFactory('add_children_modal_body_first_part', 'Add all objects that link to'),
  },
  addChildrenModalBodySecondPart: {
    text: messageFactory('add_children_modal_body_second_part', 'add all child objects'),
  },
});
