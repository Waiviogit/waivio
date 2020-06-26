import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { map } from 'lodash';
import CampaignRewardsHistoryTableBodyRow from './CampaignRewardsHistoryTableBodyRow';
import './CampaignsRewardsHistoryTable.less';

const CampaignRewardsHistoryTable = ({ intl, campaigns }) => (
  <div>
    <table className="Campaign-rewards-history">
      <thead>
        <tr>
          <th className="Campaign-rewards-history basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'from',
              defaultMessage: `From`,
            })}
          </th>
          <th className="Campaign-rewards-history basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'till',
              defaultMessage: `Till`,
            })}
          </th>
          <th className="Campaign-rewards-history maxWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'campaign',
              defaultMessage: `Campaign`,
            })}
          </th>
          <th className="Campaign-rewards-history basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'status',
              defaultMessage: `Status`,
            })}
          </th>
          <th className="Campaign-rewards-history hide-element basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'type',
              defaultMessage: `Type`,
            })}
          </th>
          <th className="Campaign-rewards-history hide-element basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'reward',
              defaultMessage: `Reward`,
            })}
          </th>
          <th className="Campaign-rewards hide-element basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'currency',
              defaultMessage: `Currency`,
            })}
          </th>
          <th className="Campaign-rewards-history hide-element basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'reviews',
              defaultMessage: `Reviews`,
            })}
          </th>
          <th className="Campaign-rewards-history hide-element basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'paid_hive',
              defaultMessage: `Paid (HIVE)`,
            })}
          </th>
        </tr>
      </thead>
      <tbody>
        {map(campaigns, campaign => (
          <CampaignRewardsHistoryTableBodyRow currentItem={campaign} />
        ))}
      </tbody>
    </table>
  </div>
);

CampaignRewardsHistoryTable.propTypes = {
  campaigns: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
};

CampaignRewardsHistoryTable.defaultProps = {
  campaigns: [],
};

export default injectIntl(CampaignRewardsHistoryTable);
