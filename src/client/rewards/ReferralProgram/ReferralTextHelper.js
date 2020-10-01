import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  handleFeesValue,
  handleOffersPercent,
  handleOffersReward,
  handleProcessingFees,
} from './ReferralHelper';

// eslint-disable-next-line import/prefer-default-export
export const referralDetailContent = data => {
  const {
    firstPercent,
    secondPercent,
    campaignPercent,
    indexPercent,
    referralsPercent,
    referralDuration,
    waivioOffers,
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
          countOffers: <span className="ReferralDetail__offer-percent">{waivioOffers}%</span>,
          referralDuration,
        }}
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
    detailsReferralPeriod: (
      <FormattedMessage id="referrals_details_referral_period" defaultMessage="Referral period:" />
    ),
    detailsReferralSessions: (
      <FormattedMessage
        id="referrals_details_referral_sessions"
        defaultMessage="Waivio is using web sessions to attribute new users to referral parties. When users log in on Waivio for the first time (using Hive credentials or as a guest), the referral party is recorded and saved for a period of 90 days. During this period, the referral party will be recorded on all the rewards reserved and received by the user."
      />
    ),
    detailsReferralPartners: (
      <FormattedMessage
        id="referrals_details_referral_partners"
        defaultMessage="Referral partners can check the list of users currently attributed to them on the {statusPage} page."
        values={{
          statusPage: (
            <Link to={`/rewards/referral-status`}>
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

export const referralInstructionsContent = data => {
  const { username } = data;

  return {
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
        defaultMessage="I have read and agree to the terms and conditions of the {ReferralAgreement} and the {ServiceAgreement}. I also acknowledge that I am not operating any online or offline services in violation of laws of the British Columbia, Canada."
        values={{
          ReferralAgreement: (
            <Link to={`/object/ylr-waivio/menu#oxa-legal/xrj-terms-and-conditions`}>
              <span className="is-blacklist__referral-username">Referral Agreement</span>
            </Link>
          ),
          ServiceAgreement: (
            <Link to={`/object/ylr-waivio/menu#oxa-legal/xrj-terms-and-conditions`}>
              <span className="is-blacklist__referral-username">Service Agreement</span>
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
          link: <span style={{ fontWeight: 600 }}>?ref=[username]</span>,
        }}
      />
    ),
    acceptedConditionsForExample: (
      <FormattedMessage
        id="referrals_instructions_accepted_for_example"
        defaultMessage="For example:"
      />
    ),
    acceptedConditionsFirstExampleLink: <span>http://www.waivio.com?ref=[username]</span>,
    acceptedConditionsSecondExampleLink: (
      <span>https://www.waivio.com/rewards/all?ref=[username]</span>
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
            <Link to={`/rewards/all`}>
              <span className="an-example__text-link">
                <FormattedMessage id="widget_addition_text" defaultMessage="an example." />
              </span>
            </Link>
          ),
        }}
      />
    ),
    acceptedConditionsAlert: (
      <FormattedMessage
        id="referrals_instructions_accepted__alert"
        defaultMessage="Please note that any misleading promotions are not allowed in accordance with the Referral agreement. Waivio reserves the right to terminate the referral program at any time for any reason."
      />
    ),
  };
};
