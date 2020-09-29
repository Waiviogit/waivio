import { FormattedMessage } from 'react-intl';
import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const referralDetailContent = () => ({
  detailTitle: (
    <FormattedMessage id="referrals_details_title" defaultMessage="Referral program details:" />
  ),
  detailDescription: (
    <FormattedMessage
      id="referrals_details_description"
      defaultMessage="Waivio offers 40% of its combined processing fees to referral parties for brining new users to Waivio.com. These commissions will be paid on all the sponsored rewards for these users for a period of 90 days from their initial visit."
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
        firstPercent: '50%',
        secondPercent: '80%',
      }}
    />
  ),
});
