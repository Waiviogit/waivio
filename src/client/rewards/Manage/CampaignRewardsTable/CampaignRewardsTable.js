import { map } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import CampaignRewardsTableRow from './CampaignRewardsTableBodyRow';

import '../Manage.less';
import './CampaignRewardsTable.less';

const CampaignRewardsTable = ({
  intl,
  campaigns,
  activateCampaign,
  inactivateCampaign,
  userName,
  setHistoryFilters,
}) => (
  <div>
    <table className="Campaign-rewards">
      <thead>
        <tr>
          <th className="Campaign-rewards basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'active',
              defaultMessage: `Active`,
            })}
          </th>
          <th className="Campaign-rewards maxWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'campaign',
              defaultMessage: `Campaign`,
            })}
          </th>
          <th className="Campaign-rewards mediumWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'status',
              defaultMessage: `Status`,
            })}
            **
          </th>
          <th className="Campaign-rewards basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'type',
              defaultMessage: `Type`,
            })}
          </th>
          <th className="Campaign-rewards hide-element" colSpan="2">
            {intl.formatMessage({ id: 'budget_target', defaultMessage: `Budget target` })}
          </th>
          <th className="Campaign-rewards hide-element" colSpan="2">
            {intl.formatMessage({ id: 'current_month', defaultMessage: `Current month` })}
          </th>
          <th className="Campaign-rewards mediumWidth hide-element" rowSpan="3">
            {intl.formatMessage({ id: 'remaining', defaultMessage: `Remaining` })}
          </th>
        </tr>
        <tr>
          <th className="Campaign-rewards basicWidth hide-element" rowSpan="2">
            <p>{intl.formatMessage({ id: 'monthly', defaultMessage: `Monthly` })}</p>
            <p>(USD)</p>
          </th>
          <th className="Campaign-rewards basicWidth hide-element" rowSpan="2">
            <p>{intl.formatMessage({ id: 'reward', defaultMessage: `Reward` })}</p>
            <p>(USD)</p>
          </th>
          <th className="Campaign-rewards basicWidth hide-element" rowSpan="2">
            {intl.formatMessage({ id: 'reserved', defaultMessage: `Reserved` })}
          </th>
          <th className="Campaign-rewards basicWidth hide-element" rowSpan="2">
            {intl.formatMessage({
              id: 'completed',
              defaultMessage: `Completed`,
            })}
          </th>
        </tr>
      </thead>
      <tbody>
        {map(campaigns, current => (
          <CampaignRewardsTableRow
            activateCampaign={activateCampaign}
            inactivateCampaign={inactivateCampaign}
            key={current._id}
            currentItem={current}
            userName={userName}
            setHistoryFilters={setHistoryFilters}
          />
        ))}
      </tbody>
    </table>
  </div>
);

CampaignRewardsTable.propTypes = {
  campaigns: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
  activateCampaign: PropTypes.func.isRequired,
  inactivateCampaign: PropTypes.func.isRequired,
  setHistoryFilters: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

CampaignRewardsTable.defaultProps = {
  campaigns: [],
};

export default injectIntl(CampaignRewardsTable);
