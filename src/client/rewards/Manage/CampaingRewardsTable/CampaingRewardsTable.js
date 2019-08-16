import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import '../Manage.less';
import './CampaingRewardsTable.less';
import CampaingRewardsTableRow from './CampaingRewardsTableBodyRow';
import ModalWindow from '../../../components/ModalWindow/ModalWindow';

const CampaingRewardsTable = props => {
  const { intl, campaigns, visibility, setModalVisibility } = props;
  const isChecked = campaigns.status === 'active' || campaigns.status === 'payed';
  return (
    <div>
      {visibility && <ModalWindow />}
      <table className="Campaing-rewards">
        <thead>
          <tr>
            <th className="Campaing-rewards basicWidth" rowSpan="3">
              {intl.formatMessage({
                id: 'active',
                defaultMessage: `Active`,
              })}
            </th>
            <th className="Campaing-rewards maxWidth" rowSpan="3">
              {intl.formatMessage({
                id: 'campaing',
                defaultMessage: `Campaing`,
              })}
            </th>
            <th className="Campaing-rewards basicWidth" rowSpan="3">
              {intl.formatMessage({ id: 'edit', defaultMessage: `Edit` })}
              ***
            </th>
            <th className="Campaing-rewards mediumWidth" rowSpan="3">
              {intl.formatMessage({
                id: 'status',
                defaultMessage: `Status`,
              })}
            </th>
            <th className="Campaing-rewards basicWidth" rowSpan="3">
              {intl.formatMessage({
                id: 'type',
                defaultMessage: `Type`,
              })}
            </th>
            <th className="Campaing-rewards hide-element" colSpan="2">
              {intl.formatMessage({ id: 'budget_target', defaultMessage: `Budget target` })}
              ****
            </th>
            <th className="Campaing-rewards hide-element" colSpan="3">
              {intl.formatMessage({ id: 'current_month', defaultMessage: `Current month` })}
            </th>
            <th className="Campaing-rewards mediumWidth hide-element" rowSpan="3">
              {intl.formatMessage({ id: 'remaining', defaultMessage: `Remaining` })}
            </th>
          </tr>
          <tr>
            <th className="Campaing-rewards basicWidth hide-element" rowSpan="2">
              <p>{intl.formatMessage({ id: 'monthly', defaultMessage: `Monthly` })}</p>
              <p>(SBD)</p>
            </th>
            <th className="Campaing-rewards basicWidth hide-element" rowSpan="2">
              <p>{intl.formatMessage({ id: 'reward', defaultMessage: `Reward` })}</p>
              <p>(SBD)</p>
            </th>
            <th className="Campaing-rewards basicWidth hide-element" rowSpan="2">
              {intl.formatMessage({ id: 'reserved', defaultMessage: `Reserved` })}
            </th>
            <th className="Campaing-rewards basicWidth hide-element" rowSpan="2">
              {intl.formatMessage({
                id: 'payable',
                defaultMessage: `Payable`,
              })}
            </th>
            <th className="Campaing-rewards basicWidth hide-element" rowSpan="2">
              {intl.formatMessage({
                id: 'paid',
                defaultMessage: `Paid`,
              })}
            </th>
          </tr>
        </thead>
        <tbody>
          {_.map(campaigns, current => (
            <CampaingRewardsTableRow
              // eslint-disable-next-line no-underscore-dangle
              key={current._id}
              currentItem={current}
              checked={isChecked}
              setModalVisibility={setModalVisibility}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

CampaingRewardsTable.propTypes = {
  campaigns: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape(),
  visibility: PropTypes.shape(),
  setModalVisibility: PropTypes.func.isRequired,
};

CampaingRewardsTable.defaultProps = {
  campaigns: [],
  intl: {},
  visibility: {},
};

export default CampaingRewardsTable;
