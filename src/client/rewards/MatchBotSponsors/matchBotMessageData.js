export default localizer => ({
  cannotCreateRulesMore: localizer(
    'matchBot_cannot_create_rules_more',
    'You cannot create more then 25 rules',
  ),
  successMinVotedChanged: localizer(
    'matchBot_success_min_voted_changed',
    'Minimum voting power changed',
  ),
  manageMatchBot: localizer('matchBot_sponsors_match_bot', ' Sponsors match bot'),
  turnOn: localizer('matchBot_turn_on', 'Turn on'),
  turnOff: localizer('matchBot_turn_off', 'Turn off'),
  designedOffsetPortion: localizer(
    'matchBot_designed_offset_portion_of_direct_rewards',
    ' is designed to offset portion of direct rewards with upvotes.',
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
  disclaimer: localizer('matchBot_sponsors_disclaimer', 'Disclaimer:'),
  matchBotsProvided: localizer(
    'matchBot_sponsors_provided',
    ' The Sponsors match bot service is provided on as-is / as-available basis.',
  ),
  titleBotsAuthors: localizer('matchBot_title_authors', ' Authors match bot'),
  authorsMatchBotsMeaning: localizer(
    'authors_match_bots_meaning',
    'automatically upvotes posts published by the specified authors. It does not upvote comments or re-blogs.',
  ),
  authorsMatchBotsCommand: localizer(
    'authors_match_bots_command',
    'For each author, please specify the upvoting power in the range from +1% to +100% (maximum upvote). Actual value of the upvote depends on the current upvoting mana on the account at the time of the action.',
  ),
  authorsMatchBotsImportant: localizer(
    'authors_match_bots_important',
    'Important: The Authors match bot only publishes upvotes with estimated combine value of 0.01 HBD or more.',
  ),
  authorsMatchBotsVotes: localizer(
    'authors_match_bots_votes',
    'Votes will be processed as long as the mana (voting power) on the account remains above the threshold as specified for each author.',
  ),
  matchBotsFee: localizer('match_bots_fee', 'Match bot service fee: '),
  matchBotsSupport: localizer(
    'match_bots_support',
    'To support the community, one 100% vote per day will be used to upvote a qualifying post published via Waivio.com. One daily vote pays for both Authors and Curators match bots.',
  ),
  matchBotsAuthorsAuthText: localizer(
    'match_bots_authors_auth_text',
    'The Authors match bot requires authorization to distribute votes on your behalf: ',
  ),
  matchBotsAuthLink: localizer('match_bots_auth_link', 'Authorize now'),
  matchBotsUnAuthLink: localizer('match_bots_unauth_link', 'Remove authorize'),
  matchBotsAuthHiveSigner: localizer(
    'match_bots_auth_hivesigner',
    'The authorization is completed via HiveSigner and can be revoked at any time.',
  ),
  matchBotsAuthorsProvided: localizer(
    'matchBot_authors_provided',
    ' The Authors match bot service is provided on as-is / as-available basis.',
  ),
  matchBotsAuthorsBtnAdd: localizer('matchBot_authors_btn_add', 'Add author'),
  titleBotsCurators: localizer('matchBot_title_curators', ' Curators match bot'),
  curatorsMatchBotsMeaning: localizer(
    'curators_match_bots_meaning',
    'automatically repeats the upvotes and downvotes of specified users (curators) on posts and comments.',
  ),
  curatorsMatchBotsCommand: localizer(
    'curators_match_bots_command',
    "For each curator, please specify the voting ratio - the proportion of your vote to the curator's vote. For example, 100% means that you want the same vote as the curator. Sometimes, if your vote value is less than the curator's, you can amplify your vote. If you specified a 200% vote ratio and the curator voted 10%, your vote would be 20%. Please note that all votes are capped at a maximum of 100%.",
  ),
  curatorsMatchBotsImportant: localizer(
    'curators_match_bots_important',
    'Important: If the estimated combine value of the vote is less than 0.01 HBD, the Curator match bot will skip this vote.',
  ),
  curatorsMatchBotsCondition: localizer(
    'curators_match_bots_condition',
    'If you also want to repeat curator’s downvotes, please check the corresponding box.',
  ),
  curatorsMatchBotsVotes: localizer(
    'curators_match_bots_votes',
    'Votes will be processed as long as the mana (voting power) on the account remains above the threshold specified for each curator.',
  ),
  matchBotsCuratorsProvided: localizer(
    'matchBot_curators_provided',
    ' The Curators match bot service is provided on as-is / as-available basis.',
  ),
  matchBotsCuratorsAuthText: localizer(
    'match_bots_curators_auth_text',
    'The Curators match bot requires authorization to distribute votes on your behalf: ',
  ),
});
