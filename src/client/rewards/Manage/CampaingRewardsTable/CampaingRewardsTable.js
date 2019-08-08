import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';
import '../Manage.less';
import './CampaingRewardsTable.less';

const CampaingRewardsTable = props => {
  const { intl, campaigns } = props;
  const checked = campaigns.status === 'active' || campaigns.status === 'payed';
  return (
    <table className="Camping-rewards">
      <thead>
        <tr>
          <th className="Camping-rewards basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'active',
              defaultMessage: `Active`,
            })}
          </th>
          <th className="Camping-rewards maxWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'camping',
              defaultMessage: `Camping`,
            })}
          </th>
          <th className="Camping-rewards basicWidth" rowSpan="3">
            {intl.formatMessage({ id: 'editCampaning', defaultMessage: `Edit***` })}
          </th>
          <th className="Camping-rewards mediumWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'status',
              defaultMessage: `Status`,
            })}
          </th>
          <th className="Camping-rewards basicWidth" rowSpan="3">
            {intl.formatMessage({
              id: 'type',
              defaultMessage: `Type`,
            })}
          </th>
          <th className="Camping-rewards hide-element" colSpan="2">
            {intl.formatMessage({ id: 'budgetTarget', defaultMessage: `Budget target****` })}
          </th>
          <th className="Camping-rewards hide-element" colSpan="3">
            {intl.formatMessage({ id: 'currentMonth', defaultMessage: `Current month` })}
          </th>
          <th className="Camping-rewards mediumWidth hide-element" rowSpan="3">
            {intl.formatMessage({ id: 'remaining', defaultMessage: `Remaining` })}
          </th>
        </tr>
        <tr>
          <th className="Camping-rewards basicWidth hide-element" rowSpan="2">
            <p>{intl.formatMessage({ id: 'monthly', defaultMessage: `Monthly` })}</p>
            <p>(SBD)</p>
          </th>
          <th className="Camping-rewards basicWidth hide-element" rowSpan="2">
            <p>{intl.formatMessage({ id: 'rewardCampaning', defaultMessage: `Reward` })}</p>
            <p>(SBD)</p>
          </th>
          <th className="Camping-rewards basicWidth hide-element" rowSpan="2">
            {intl.formatMessage({ id: 'reserved', defaultMessage: `Reserved` })}
          </th>
          <th className="Camping-rewards basicWidth hide-element" rowSpan="2">
            {intl.formatMessage({
              id: 'payable',
              defaultMessage: `Payable`,
            })}
          </th>
          <th className="Camping-rewards basicWidth hide-element" rowSpan="2">
            {intl.formatMessage({
              id: 'paid',
              defaultMessage: `Paid`,
            })}
          </th>
        </tr>
      </thead>
      <tbody>
        {_.map(campaigns, current => (
          <tr>
            <td>
              <Checkbox defaultChecked={checked} disabled />
            </td>
            <td>{current.name}</td>
            <td>
              {!checked ? (
                <Link to={`/rewards/edit}`} title={'Edit'}>
                  <span>Edit</span>
                </Link>
              ) : null}
            </td>
            <td>{current.status}</td>
            <td>{current.type}</td>
            <td className="hide-element">{current.budget.toFixed(2)}</td>
            <td className="hide-element">{current.reward.toFixed(2)}</td>
            <td className="hide-element">{current.reserved}</td>
            <td className="hide-element">{current.payable}</td>
            <td className="hide-element">{current.payed}</td>
            <td className="hide-element">{current.remaining}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

CampaingRewardsTable.propTypes = {
  campaigns: PropTypes.shape(),
  intl: PropTypes.shape(),
};

CampaingRewardsTable.defaultProps = {
  campaigns: {},
  intl: {},
};

export default CampaingRewardsTable;
