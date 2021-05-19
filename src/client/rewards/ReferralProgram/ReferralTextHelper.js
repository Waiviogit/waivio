import { size } from 'lodash';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  handleFeesValue,
  handleOffersPercent,
  handleOffersReward,
  handleProcessingFees,
} from './ReferralHelper';
import { openNewTab } from '../rewardsHelper';

// eslint-disable-next-line import/prefer-default-export
export const referralDetailContent = data => {
  const {
    username,
    firstPercent,
    secondPercent,
    campaignPercent,
    indexPercent,
    referralsPercent,
    referralDuration,
    additionData,
    suspendedTimer,
  } = data;

  const { offersReward, offersPercent, feesValue } = additionData;

  return {
    detailTitle: (
      <FormattedMessage id="referrals_details_title" defaultMessage="Referral program details:" />
    ),
    detailDescription: (
      <FormattedMessage
        id="referrals_details_description"
        defaultMessage="Waivio offers {countOffers} of its combined processing fees to referral parties for brining new users to Waivio.com. These commissions will be paid on all the sponsored rewards for these users for a period of {referralDuration} days from their initial visit."
        values={{
          countOffers: <span className="ReferralDetail__offer-percent">{referralsPercent}%</span>,
          referralDuration,
        }}
      />
    ),
    detailsAdditionTextOffers: (
      <FormattedMessage
        id="referral_details_addition_text_offers"
        defaultMessage="Waivio offers the same commissions to referral partners for brining existing customers to Waivio.com. The referral account will be listed as a beneficiary for referral portion of processing fees for these users for a period of 5 days from the moment of their association with the referral partner."
      />
    ),
    detailsAdditionTextUsers: (
      <FormattedMessage
        id="referral_details_addition_text_users"
        defaultMessage="Users will remain locked to the referral partner for the specified period and will not be re-assigned until the expiration of the set period."
      />
    ),
    detailsAdditionTextSessions: (
      <FormattedMessage
        id="referral_details_addition_text_sessions"
        defaultMessage="Waivio is using web sessions to track referrals."
      />
    ),
    detailsCommissionsTitle: (
      <FormattedMessage
        id="referrals_details_commissions_title"
        defaultMessage="Referral commissions:"
      />
    ),
    detailsCommissionsDescription: (
      <FormattedMessage
        id="referrals_details_commissions_descriptions"
        defaultMessage="When sponsors post attention bids on the Hive blockchain, in addition to user rewards, they allocate 5% or more as Processing Fees for all the parties involved in posting, indexing, and presenting bids to eligible users. Waivio Campaign server offers {firstPercent} of these commissions to Index Servers. And Waivio’s Index Server offers {secondPercent} of its commissions to Referral partners. These terms can be changed by Waivio from time to time."
        values={{
          firstPercent,
          secondPercent,
        }}
      />
    ),
    detailsCommissionsExample: (
      <FormattedMessage id="referrals_details_commissions_example" defaultMessage="Example:" />
    ),
    detailsCommissionsSponsor: (
      <FormattedMessage
        id="referrals_details_commissions_sponsor"
        defaultMessage="Sponsor offers a reward of {offersReward} to eligible users and agrees to pay {offersPercent} as processing fees."
        values={{
          offersReward: handleOffersReward(offersReward),
          offersPercent: handleOffersPercent(offersPercent),
        }}
      />
    ),
    detailsCommissionsProcessing: (
      <FormattedMessage
        id="referrals_details_commissions_processing"
        defaultMessage="Processing fees ({feesValue}) will be distributed in the following way:"
        values={{
          feesValue: handleFeesValue(feesValue),
        }}
      />
    ),
    detailsCommissionsWaivioCampaign: (
      <FormattedMessage
        id="referrals_details_commissions_waivio_campaigns"
        defaultMessage="Waivio.campaigns ({percent}): {sum}"
        values={{
          percent: handleOffersPercent(campaignPercent),
          sum: handleProcessingFees(offersReward, campaignPercent),
        }}
      />
    ),
    detailsCommissionsWaivioIndex: (
      <FormattedMessage
        id="referrals_details_commissions_waivio_index"
        defaultMessage="Waivio.index ({percent}): {sum}"
        values={{
          percent: handleOffersPercent(indexPercent),
          sum: handleProcessingFees(offersReward, indexPercent),
        }}
      />
    ),
    detailsCommissionsReferrals: (
      <FormattedMessage
        id="referrals_details_commissions_referrals"
        defaultMessage="Referrals ({percent}): {sum}"
        values={{
          percent: handleOffersPercent(referralsPercent),
          sum: handleProcessingFees(offersReward, referralsPercent),
        }}
      />
    ),
    detailsCommissionsPayments: (
      <FormattedMessage
        id="referrals_details_commissions_payments"
        defaultMessage="All payments are processed directly by the sponsors and the status of all payments can be checked on the {receivablesPage} page in the Rewards section. Please note that Waivio is not involved in the processing of payments and we only handle information relating to payment obligations between the parties. To ensure that sponsors pay rewards and processing fees on time, Waivio stops processing sponsor campaigns if they are overdue by {suspendedTimer} days or more."
        values={{
          receivablesPage: (
            <Link to={`/rewards/receivables`}>
              <span className="commissions-payments__receivables">
                <FormattedMessage
                  id="referrals_details_commissions_payments_receivables"
                  defaultMessage="Receivables"
                />
              </span>
            </Link>
          ),
          suspendedTimer,
        }}
      />
    ),
    detailsReferralPartners: (
      <FormattedMessage
        id="referrals_details_referral_partners"
        defaultMessage="Referral partners can check the list of users currently attributed to them on the {statusPage} page."
        values={{
          statusPage: (
            <Link to={`/rewards/referral-status/${username}`}>
              <span className="referral-partners__status">
                <FormattedMessage id="referrals_status" defaultMessage="Status" />
              </span>
            </Link>
          ),
        }}
      />
    ),
  };
};

export const referralInstructionsContent = username => ({
  instructionsTitle: (
    <FormattedMessage id="referrals_instructions_title" defaultMessage="Referral instructions:" />
  ),
  instructionsBlackListContent: (
    <FormattedMessage
      id="referrals_instructions_is_blacklist"
      defaultMessage="Your account {username} is listed in the Waivio’s blacklist or in other blacklists trusted by Waivio and you are not eligible to participate in the Referral program."
      values={{
        username: (
          <Link to={`/@${username}`}>
            <span className="is-blacklist__referral-username">{username}</span>
          </Link>
        ),
      }}
    />
  ),
  instructionsDescription: (
    <FormattedMessage
      id="referrals_instructions_description"
      defaultMessage="To reveal the instructions and to participate in the Referral program you must agree to the terms on conditions of the service."
    />
  ),
  instructionsConditions: (
    <FormattedMessage
      id="referrals_instructions_conditions"
      defaultMessage="I have read and agree to the {termsAndConditions} of the service. I also acknowledge that I am not operating any online or offline service in violation of the laws of British Columbia, Canada."
      values={{
        termsAndConditions: (
          <Link to={`/object/xrj-terms-and-conditions/page`}>
            <span className="is-blacklist__referral-username">
              <FormattedMessage
                id="referral_terms_conditions"
                defaultMessage="Terms and Conditions"
              />
            </span>
          </Link>
        ),
      }}
    />
  ),
  acceptedConditionsTitleDirect: (
    <FormattedMessage
      id="referrals_instructions_accepted_title_links"
      defaultMessage="Direct links:"
    />
  ),
  acceptedConditionsExamplesLinks: (
    <FormattedMessage
      id="referrals_instructions_accepted_title_example_links"
      defaultMessage="Simply add {link} to any Waivio page URL"
      values={{
        link: <span style={{ fontWeight: 600 }}>{`?ref=${username}`}</span>,
      }}
    />
  ),
  acceptedConditionsForExample: (
    <FormattedMessage
      id="referrals_instructions_accepted_for_example"
      defaultMessage="For example:"
    />
  ),
  acceptedConditionsFirstExampleLink: <span>{`https://www.waivio.com?ref=${username}`}</span>,
  acceptedConditionsSecondExampleLink: (
    <span>{`https://www.waivio.com/rewards/all?ref=${username}`}</span>
  ),
  acceptedConditionsTitleWidget: (
    <FormattedMessage
      id="referrals_instructions_accepted_title_widget"
      defaultMessage="Waivio widget:"
    />
  ),
  acceptedConditionsWidgetInfo: (
    <FormattedMessage
      id="referrals_instructions_accepted__widget_info"
      defaultMessage="This page-size widget is designed to show relevant active rewards. Paste the following code into your webpage:"
    />
  ),
  acceptedConditionsWidgetExample: (
    <FormattedMessage
      id="referrals_instructions_accepted__widget_example"
      defaultMessage="See {text}"
      values={{
        text: (
          <span
            role="presentation"
            className="ReferralInstructions__an-example__text-link"
            onClick={() => openNewTab(`/rewards/all/?display=widget!ref=${username}`)}
          >
            <FormattedMessage id="widget_addition_text" defaultMessage="an example." />
          </span>
        ),
      }}
    />
  ),
  acceptedConditionsAlert: (
    <FormattedMessage
      id="referrals_instructions_accepted__alert"
      defaultMessage="Please note that any misleading promotions are not allowed in accordance with the Referral Program. Waivio reserves the right to terminate the referral program at any time for any reason."
    />
  ),
  terminateReferralTitle: (
    <FormattedMessage
      id="referrals_instructions_terminate_referral_title"
      defaultMessage="Terminate the Referral program"
    />
  ),
  terminateReferralInfo: (
    <FormattedMessage
      id="referrals_instructions_terminate_referral_info"
      defaultMessage="If you no longer accept the terms and conditions of the Waivio service agreement, you can no longer participate in the referral program. All future referrals will be suspended."
    />
  ),
  copyButtonText: <FormattedMessage id="copy_button" defaultMessage="Copy" />,
  copyButtonCopiedText: <FormattedMessage id="copy_button_copied" defaultMessage="Copied" />,
});

export const referralStatusContent = data => {
  const { username, currentUserCards } = data;

  return {
    statusTitle: <FormattedMessage id="referral_status_title" defaultMessage="Referral status:" />,
    statusDescription: (
      <FormattedMessage
        id="referral_status_description"
        defaultMessage="The following users are currently assigned by the Waivio index server to the referral partner {username}:"
        values={{
          username: (
            <Link to={`/@${username}`}>
              <span className="text-link">{username}</span>
            </Link>
          ),
        }}
      />
    ),
    statusCount: (
      <FormattedMessage
        id="referral_status_count"
        defaultMessage="Total count: {count}"
        values={{
          count: <span className="status-count">{size(currentUserCards)}</span>,
        }}
      />
    ),
    statusPaymentText: (
      <FormattedMessage
        id="referral_status_payments_text"
        defaultMessage="The status of all outstanding and completed payments can be checked on the {receivablesPage} page in the Rewards section."
        values={{
          receivablesPage: (
            <Link to={`/rewards/receivables`}>
              <FormattedMessage id="debts_receivables" defaultMessage="Receivables" />
            </Link>
          ),
        }}
      />
    ),
  };
};

export const sponsoredRewardsMainContent = data => {
  const { username } = data;

  return {
    sponsoredRewardsTitle: (
      <FormattedMessage
        id="sponsored_rewards_title"
        defaultMessage="Sponsored rewards: {username}"
        values={{
          username: (
            <Link to={`/@${username}`}>
              <span className="title-link">{username}</span>
            </Link>
          ),
        }}
      />
    ),
  };
};

export const sponsoredRewardsTableContent = data => {
  const {
    username,
    sponsorName,
    prymaryObjectName,
    prymaryObjectLink,
    reviewObjectName,
    reviewObjectLink,
    reservationPermlink,
    toggleModalReport,
  } = data;

  return {
    sponsoredActionReviewRequested: (
      <FormattedMessage
        id="sponsored_rewards_requested_text"
        defaultMessage="Review by {userName} (requested by {sponsorName})"
        values={{
          userName: (
            <Link to={`/@${username}`}>
              <span className="text-link">@{username}</span>
            </Link>
          ),
          sponsorName: (
            <Link to={`/@${sponsorName}`}>
              <span className="text-link">@{sponsorName}</span>
            </Link>
          ),
        }}
      />
    ),
    sponsoredActionReview: (
      <FormattedMessage
        id="sponsored_rewards_review_text"
        defaultMessage="Review: {prymaryObjectName}, {reviewObjectName}"
        values={{
          prymaryObjectName: (
            <Link to={`/object/${prymaryObjectLink}`}>
              <span className="text-link">{prymaryObjectName}</span>
            </Link>
          ),
          reviewObjectName: (
            <Link to={`/object/${reviewObjectLink}`}>
              <span className="text-link">{reviewObjectName}</span>
            </Link>
          ),
        }}
      />
    ),
    sponsoredActionBeneficiaries: (
      <FormattedMessage id="sponsored_rewards_beneficiaries" defaultMessage="Beneficiaries: " />
    ),
    sponsoredActionBeneficiariesName: <Link to={`/@${username}`}>{username}</Link>,
    sponsoredDetailsReservation: (
      <React.Fragment>
        <Link to={`/@${username}/${reservationPermlink}`}>
          <FormattedMessage
            id="sponsored_rewards_details_reservation"
            defaultMessage="Reservation"
          />
        </Link>
        <div className="text-link" onClick={() => toggleModalReport()} role="presentation">
          <FormattedMessage id="sponsored_rewards_details_report" defaultMessage="Report" />
        </div>
      </React.Fragment>
    ),
  };
};
