import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './Manage.less';

@injectIntl
class Manage extends React.Component {
  static propTypes = {
    intl: PropTypes.shape(),
  };
  static defaultProps = {
    userName: '',
    intl: {},
  };
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    objectsToAction: [],
    isModalEligibleUsersOpen: false,
  };

  balanceTable = () => {
    const { intl } = this.props;
    return (
      <table className="Manage__account-balance-wrap-table">
        <thead>
          <tr>
            <th>{intl.formatMessage({ id: 'balanace', defaultMessage: `Balanace` })}</th>
            <th>{intl.formatMessage({ id: 'Payable', defaultMessage: `Payable*` })}</th>
            <th>{intl.formatMessage({ id: 'Reserved', defaultMessage: `Reserved` })}</th>
            <th>{intl.formatMessage({ id: 'Remaining', defaultMessage: `Remaining**` })}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>500 mock</td>
            <td>150 mock</td>
            <td>50 mock</td>
            <td>300 mock</td>
          </tr>
        </tbody>
      </table>
    );
  };
  campaingRewardsTable = () => (
    <table className="Manage__rewards-campaign-wrap-table">
      <thead>
        <tr>
          <th rowSpan="3">Active</th>
          <th rowSpan="3">Camping</th>
          <th rowSpan="3">Edit***</th>
          <th rowSpan="3">Status</th>
          <th rowSpan="3">Type</th>
          <th colSpan="2">Budget target****</th>
          <th colSpan="3">Current month</th>
          <th rowSpan="3">Remaining</th>
        </tr>
        <tr>
          <th rowSpan="2">
            <p>Monthly</p>
            <p>(SBD)</p>
          </th>
          <th rowSpan="2">
            <p>Reward</p>
            <p>(SBD)</p>
          </th>
          <th rowSpan="2">Reserved</th>
          <th rowSpan="2">Payable</th>
          <th rowSpan="2">Paid</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Somet text</td>
          <td>Somet text</td>
          <td>Somet text</td>
          <td>Somet text</td>
          <td>Somet text</td>
          <td>Somet text</td>
          <td>Somet text</td>
          <td>Somet text</td>
          <td>Somet text</td>
          <td>Somet text</td>
          <td>Somet text</td>
        </tr>
      </tbody>
    </table>
  );

  render() {
    const { intl } = this.props;
    return (
      <div className="Manage">
        <div className="Manage__account-balance-wrap">
          <div className="Manage__account-balance-wrap-title">
            {intl.formatMessage({
              id: 'rewardAccountBalance',
              defaultMessage: `Account balance (SBD)`,
            })}
          </div>
          {this.balanceTable()}
          <div className="Manage__account-balance-wrap-text-content">
            <div>All campaigns will be suspended if:</div>
            <div>* accounts payable exeed 30 days</div>
            <div>** the remaining balance i snot sufficient to cover outstanding obligations</div>
          </div>
          <div className="Manage__rewards-campaign-wrap">
            <div className="Manage__rewards-campaign-wrap-title">
              {intl.formatMessage({
                id: 'manageRewardsCampaign',
                defaultMessage: `Manage rewards campaign`,
              })}
            </div>
            {this.campaingRewardsTable()}
            <div className="Manage__rewards-campaign-wrap-text-content">
              <div>*** Only inactive campaogns can be edited</div>
              <div>**** Campaign budgets calcualted from the 1st day of each month</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Manage;
