export default localizer => ({
  seekHonestReviews: localizer('rewards_details_seek_honest_reviews', 'We seek honest reviews'),
  rewardReviews: localizer('rewards_details_reward_for_reviews', 'Reward for reviews'),
  earn: localizer('rewards_details_earn', 'Earn'),
  sponsor: localizer('sponsor', 'Sponsor'),
  totalPaid: localizer('paid', 'Total paid'),
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
  postRequirements: localizer('rewards_details_post_requirements', 'Post requirements'),
  reviewEligibleAward: localizer(
    'rewards_details_review_eligible_award',
    'For the review to be eligible for the award, all the following requirements must be met:',
  ),
  minimumOriginalPhotos: localizer(
    'rewards_details_minimum_original_photos',
    'Minimum [min. number of photos] original photos of [name of the secondary object];',
  ),
  photoReceipt: localizer(
    'rewards_details_photo_the_receipt',
    'Photo of the receipt (without personal details);',
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
  reward: localizer('rewards_details_reward', 'Reward'),
  amountRewardDetermined: localizer(
    'rewards_details_amount_reward_determined',
    'The amount of the reward is determined in STEEM at the time of reservation. The reward will be paid in the form of a combination of upvotes (Steem Power) and direct payments (liquid STEEM). Only upvotes from registered accounts (@[sponsor], @[registered match bots]) count towards the payment of rewards. The value of all other upvotes is not subtracted from the specified amount of the reward.',
  ),
  legalAgreementHighlights: localizer(
    'rewards_details_legal_agreement_highlights',
    'By making the reservation, you confirm that you have read and agree to the Terms and Conditions of the Service Agreement, including the following: Legal highlights: legal agreement highlights.',
  ),
  cancel: localizer('cancel', 'Cancel'),
  reserve: localizer('reserve', 'Reserve'),
  forDays: localizer('for_days', 'for'),
  days: localizer('days', 'days'),
});
