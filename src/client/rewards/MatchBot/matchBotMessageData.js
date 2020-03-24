export default localizer => ({
  cannotCreateRulesMore: localizer(
    'matchBot_cannot_create_rules_more',
    'You cannot create more then 25 rules',
  ),
  successMinVotedChanged: localizer(
    'matchBot_success_min_voted_changed',
    'Minimum voting power changed',
  ),
  manageMatchBot: localizer('matchBot_manage_match_bot', 'Manage match bot'),
  turnOn: localizer('matchBot_turn_on', 'Turn on'),
  turnOff: localizer('matchBot_turn_off', 'Turn off'),
  designedOffsetPortion: localizer(
    'matchBot_designed_offset_portion_of_direct_rewards',
    'Match bot is designed to offset portion of direct rewards with upvotes.',
  ),
  contentUserPostedReview: localizer(
    'matchBot_content_user_has_posted_review_eligible_receive_direct_reward',
    "For example, the user has posted a review that is eligible to receive a direct reward of 5.00 HIVE. Match bot can upvote that post for a specified value of, say, 10% of the reward (assuming Match bot has enough voting value). This way, the user will receive 0.50 HIVE in author's rewards and the direct payment can be reduced to 4.50 HIVE.",
  ),
  thirdPartyCampaignSponsors: localizer(
    'matchBot_third_party_campaign_sponsors_must_pre_register_match_bot_sponsor_in_campaign',
    'Important: Third party campaign sponsors must register the match bot in their campaigns for the value of bot upvotes to be subtracted from the direct obligations.',
  ),
  matchBotRequiresAuthorization: localizer(
    'matchBot_match_bot_requires_authorization_distribute_votes_behalf',
    'The match bot requires authorization to distribute votes on your behalf',
  ),
  authorizeNow: localizer('matchBot_authorize_now', 'Authorize now'),
  removeAuthorization: localizer('matchBot_remove_authorization', 'Remove authorization'),
  authorizationCompletedSteemconnect: localizer(
    'matchBot_authorization_completed_steemconnect_can_revoked_any_time',
    'The authorization is completed via Hive and can be revoked at any time.',
  ),
  minimumVotingPower: localizer('matchBot_minimum_voting_power', 'Minimum voting power'),
  change: localizer('matchBot_minimum_voting_power_change', 'change'),
  upvoteEligiblePosts: localizer(
    'matchBot_will_upvote_eligible_posts_only_if_VP',
    'Match bot will upvote eligible posts only if VP on the account exceeds the set value.',
  ),
  addSponsor: localizer('matchBot_add_mb_sponsor', 'Add sponsor'),
  changeMinVotingPower: localizer(
    'matchBot_change_min_voting_power',
    'Change minimum voting power',
  ),
  active: localizer('matchBot_active', 'Active'),
  sponsor: localizer('matchBot_sponsor', 'Sponsor'),
  upvote: localizer('matchBot_upvote', 'Upvote'),
  action: localizer('matchBot_action', 'Action'),
  notes: localizer('matchBot_notes', 'Notes'),
  expiryDate: localizer('matchBot_expiry_date', 'Expiry date'),
  authorizationRequired: localizer('matchBot_authorization_required', 'Authorization is required'),
  successRuleActivation: localizer('matchBot_success_rule_activation', 'Confirm rule activation'),
  successRuleInactivation: localizer(
    'matchBot_success_rule_inactivation',
    'Confirm rule inactivation',
  ),
  matchBotRequiresAuthorizationDistribute: localizer(
    'matchBot_match_bot_requires_authorization_distribute_votes_behalf',
    'The match bot requires authorization to distribute upvotes on your behalf',
  ),
  successIntentionRuleActivation: localizer(
    'matchBot_success_intention_rule_activation',
    'Do you want to activate match bot rule for sponsor',
  ),
  successIntentionRuleInactivation: localizer(
    'matchBot_success_intention_rule_inactivation',
    'Do you want to inactivate match bot rule for sponsor',
  ),
  ruleActivatedSuccessfully: localizer('matchBot_success_activated', 'Rule activated successfully'),
  ruleInactivatedSuccessfully: localizer(
    'matchBot_success_inactivated',
    'Rule inactivated successfully',
  ),
  termless: localizer('matchBot_termless', 'termless'),
  confirm: localizer('matchBot_confirm', 'Confirm'),
  cancel: localizer('matchBot_cancel', 'Cancel'),
  edit: localizer('matchBot_table_edit', 'Edit'),
  addNewSponsor: localizer('matchBot_title_add_new_sponsor', 'Add new sponsor'),
  titleEditRule: localizer('matchBot_title_edit_rule', 'Edit match bot rules for'),
});
