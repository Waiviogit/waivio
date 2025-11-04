export default (localizer, values = { currency: 'HIVE' }) => ({
  cannotCreateRulesMore: localizer(
    'matchBot_cannot_create_rules_more',
    'You cannot create more then 25 rules',
  ),
  successMinVotedChanged: localizer(
    'matchBot_success_min_voted_changed',
    'Minimum voting power changed',
  ),
  manageMatchBot: localizer('matchBot_sponsors_match_bot', 'Sponsors Match Bot'),
  turnOn: localizer('matchBot_turn_on', 'Turn on'),
  turnOff: localizer('matchBot_turn_off', 'Turn off'),
  designedOffsetPortion: localizer(
    'matchBot_designed_offset_portion_of_direct_rewards',
    ' is designed to support sponsored content by using upvotes to cover a portion of direct reward payouts. When an eligible post receives a direct reward, the bot can cast an upvote representing a percentage of that reward value, helping reduce the direct payment required from the sponsor.',
  ),
  contentUserPostedReview: localizer(
    'matchBot_content_user_has_posted_review_eligible_receive_direct_reward',
    'For example, if a post is eligible for a 5.00 {currency} direct reward, the bot may upvote it to match 10% of that amount, assuming sufficient voting power is available. In this case, the author would receive 0.50 WAIV through curation, reducing the remaining direct payment to 4.50 {currency}.',
    values,
  ),
  thirdPartyCampaignSponsors: localizer(
    'matchBot_third_party_campaign_sponsors_must_pre_register_match_bot_sponsor_in_campaign',
    'Important: Third-party campaign sponsors must register the Match Bot within their campaigns to ensure that the value of upvotes is correctly deducted from direct payment obligations.',
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
    "Voting will continue as long as your account's voting mana remains above the defined threshold.",
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
    ' The Sponsors Match Bot service is provided on an as-is and as-available basis.',
  ),
  titleBotsAuthors: localizer('matchBot_title_authors', ' Authors Match Bot'),
  authorsMatchBotsMeaning: localizer(
    'authors_match_bots_meaning',
    'automatically upvotes posts published by specified authors. It does not upvote comments or reblogs.',
  ),
  authorsMatchBotsCommand: localizer(
    'authors_match_bots_command',
    'For each author, you can set an upvote weight ranging from +1% to +100% (maximum vote). The actual vote value will depend on the current voting mana available on your account at the moment the vote is cast.',
  ),
  authorsMatchBotsImportant: localizer(
    'authors_match_bots_important',
    'Important: The Authors Match Bot only casts upvotes estimated to have a combined value of at least 0.01 HBD.',
  ),
  authorsMatchBotsVotes: localizer(
    'authors_match_bots_votes',
    'Voting will continue as long as your account’s voting mana remains above the threshold defined for each author.',
  ),
  matchBotsFee: localizer('match_bots_fee', 'Match bot service fee: '),
  matchBotsSupport: localizer(
    'match_bots_support',
    'To support the community, one 100% vote per day will be used to upvote a qualifying post published via Waivio.com. One daily vote pays for both Authors and Curators match bots.',
  ),
  matchBotsAuthorsAuthText: localizer(
    'match_bots_authors_auth_text',
    'The Authors Match Bot requires authorization to distribute votes on your behalf: ',
  ),
  matchBotsAuthLink: localizer('match_bots_auth_link', 'Authorize now'),
  matchBotsUnAuthLink: localizer('match_bots_unauth_link', 'Remove authorize'),
  matchBotsAuthHiveSigner: localizer(
    'match_bots_auth_hivesigner',
    'Authorization is handled via HiveSigner and can be revoked at any time.',
  ),
  matchBotsAuthorsProvided: localizer(
    'matchBot_authors_provided',
    'The Authors Match Bot service is provided on as-is / as-available basis.',
  ),
  matchBotsAuthorsBtnAdd: localizer('matchBot_authors_btn_add', 'Add author'),
  titleBotsCurators: localizer('matchBot_title_curators', ' Curators Match Bot'),
  curatorsMatchBotsMeaning: localizer(
    'curators_match_bots_meaning',
    'automatically mirrors the upvotes and downvotes of selected users (curators) on both posts and comments. You simply choose which curators you want to follow, and the bot will apply a proportionate version of their voting actions from your account.',
  ),
  curatorsMatchBotsCommand: localizer(
    'curators_match_bots_command',
    "For each curator, you can choose how your vote should be applied. In proportional mode, the voting ratio determines the strength of your vote in relation to the curator's. A ratio of 100% means your vote will mirror the curator's exactly, while a 200% ratio will double their vote strength on your behalf. In absolute mode, you set a fixed voting strength that will always be used, regardless of the curator's vote value. This ensures that every mirrored vote reflects your selected power consistently. In both modes, votes are capped at a maximum of 100%.",
  ),
  curatorsMatchBotsImportant: localizer(
    'curators_match_bots_important',
    'Important: The Curators Match Bot only casts upvotes estimated to have a combined value of at least 0.01 HBD.',
  ),
  curatorsMatchBotsCondition: localizer(
    'curators_match_bots_condition',
    'You may also enable the option to repeat downvotes from selected curators if you wish to align fully with their curation behavior.',
  ),
  curatorsMatchBotsVotes: localizer(
    'curators_match_bots_votes',
    "Voting will continue as long as your account's voting mana remains above the threshold defined for each curator.",
  ),
  matchBotsCuratorsProvided: localizer(
    'matchBot_curators_provided',
    ' The Curators Match Bot service is provided on as-is / as-available basis.',
  ),
  matchBotsCuratorsAuthText: localizer(
    'match_bots_curators_auth_text',
    'The Curators Match Bot requires authorization to distribute votes on your behalf: ',
  ),
});
