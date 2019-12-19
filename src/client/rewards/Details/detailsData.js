export default localizer => ({
  eligibilityRequirements: localizer(
    'rewards_details_eligibility_requirements',
    'User eligibility requirements',
  ),
  eligibilityCriteriaParticipate: localizer(
    'rewards_details_eligibility_criteria_can_participate',
    'Only users who meet all eligibility criteria can participate in this rewards campaign.',
  ),
  minimumSteemReputation: localizer(
    'rewards_details_minimum_steem_reputation',
    'Minimum Steem reputation',
  ),
  minimumWaivioExpertise: localizer(
    'rewards_details_minimum_waivio_expertise',
    'Minimum Waivio expertise',
  ),
  minimumNumberFollowers: localizer(
    'rewards_details_minimum_number_followers',
    'Minimum number of followers',
  ),
  minimumNumberPosts: localizer('rewards_details_minimum_number_posts', 'Minimum number of posts'),
  receivedRewardReviewing: localizer(
    'rewards_details_received_reward_reviewing',
    'Have not received a reward from @[campaign sponsor] for reviewing [primary object] in the last [frequency days] days and does not have an active reservation for such a reward at the moment.',
  ),
  accountNotBlacklisted: localizer(
    'rewards_details_account_not_blacklisted',
    'User account is not blacklisted by @[sponsor] or referenced accounts.',
  ),
  postRequirements: localizer('rewards_details_post_requirementss', 'Post requirements'),
  reviewEligibleAward: localizer(
    'rewards_details_review_eligible_award',
    'For the review to be eligible for the award, all the following requirements must be met',
  ),
  minimumOriginalPhotos: localizer(
    'rewards_details_minimum_original_photos',
    'Minimum [min. number of photos] original photos of [name of the secondary object];',
  ),
  photoReceipt: localizer(
    'rewards_details_photo_the_receipt',
    'Photo of the receipt (without personal details)',
  ),
  linkSecondaryObject: localizer(
    'rewards_details_link_secondary_object',
    'Link to [name of the secondary object]: [URL of the secondary object]',
  ),
  linkPrimaryObject: localizer(
    'rewards_details_link_primary_object',
    'Link to [name of primary object]: [URL of the primary object]',
  ),
  additionalRequirements: localizer(
    'rewards_details_additional_requirements',
    'Additional requirements/notes',
  ),
  sponsorReservesPayment: localizer(
    'rewards_details_sponsor_reserves_payment',
    'Sponsor reserves the right to refuse the payment if review is suspected to be fraudulent, spam, poorly written or for other reasons as stated in the agreement.',
  ),
});
