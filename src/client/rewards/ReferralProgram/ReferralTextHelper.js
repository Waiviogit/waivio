import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line import/prefer-default-export
export const referralDetailContent = data => {
  const {
    firstPercent,
    secondPercent,
    campaignPercent,
    campaignSum,
    indexPercent,
    indexSum,
    referralsPercent,
    referralsSum,
  } = data;
  return {
    detailTitle: (
      <FormattedMessage id="referrals_details_title" defaultMessage="Referral program details:" />
    ),
    detailDescription: (
      <FormattedMessage
        id="referrals_details_description"
        defaultMessage="Waivio offers {countOffers} of its combined processing fees to referral parties for brining new users to Waivio.com. These commissions will be paid on all the sponsored rewards for these users for a period of 90 days from their initial visit."
        values={{
          countOffers: <span className="ReferralDetail__offer-percent">40%</span>,
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
        defaultMessage="Sponsor offers a reward of $5.00 to eligible users and agrees to pay 5% as processing fees."
      />
    ),
    detailsCommissionsProcessing: (
      <FormattedMessage
        id="referrals_details_commissions_processing"
        defaultMessage="Processing fees ($0.25) will be distributed in the following way:"
      />
    ),
    detailsCommissionsWaivioCampaign: (
      <FormattedMessage
        id="referrals_details_commissions_waivio_campaigns"
        defaultMessage="Waivio.campaigns ({percent}): {sum}"
        values={{
          percent: campaignPercent,
          sum: campaignSum,
        }}
      />
    ),
    detailsCommissionsWaivioIndex: (
      <FormattedMessage
        id="referrals_details_commissions_waivio_index"
        defaultMessage="Waivio.index ({percent}): {sum}"
        values={{
          percent: indexPercent,
          sum: indexSum,
        }}
      />
    ),
    detailsCommissionsReferrals: (
      <FormattedMessage
        id="referrals_details_commissions_referrals"
        defaultMessage="Referrals ({percent}): {sum}"
        values={{
          percent: referralsPercent,
          sum: referralsSum,
        }}
      />
    ),
    detailsCommissionsPayments: (
      <FormattedMessage
        id="referrals_details_commissions_payments"
        defaultMessage="All payments are processed directly by the sponsors and the status of all payments can be checked on the {receivablesPage} page in the Rewards section. Please note that Waivio is not involved in the processing of payments and we only handle information relating to payment obligations between the parties. To ensure that sponsors pay rewards and processing fees on time, Waivio stops processing sponsor campaigns if they are overdue by 30 days or more."
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
