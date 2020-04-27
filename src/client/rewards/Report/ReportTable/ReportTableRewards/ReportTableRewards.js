import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { map } from 'lodash';
import ReportTableRewardsRow from '../ReportTableRewards/ReportTableRewardsRow';
import './ReportTableRewards.less';
import ReportTableRewardsRowTotal from './ReportTableRewardsRowTotal';

const ReportTableRewards = ({ intl }) => {
  const beneficiaries = [
    {
      account: 'VanDining',
      weight: 9700,
    },
    {
      account: 'waivio',
      weight: 300,
    },
    {
      account: 'someUser',
      weight: 200,
    },
  ];

  return (
    <React.Fragment>
      <div className="ReportTableRewards__header">
        <span>{intl.formatMessage({ id: 'user_rewards', defaultMessage: 'User rewards:' })}</span>
      </div>
      <table className="ReportTableRewards">
        <thead>
          <tr>
            <th className="ReportTableRewards maxWidth" rowSpan="2">
              {intl.formatMessage({
                id: 'post_beneficiaries',
                defaultMessage: 'Post beneficiaries',
              })}
            </th>
            <th className="ReportTableRewards basicWidth">
              {intl.formatMessage({ id: 'shares', defaultMessage: `Shares` })}
            </th>
            <th className="ReportTableRewards basicWidth">
              {intl
                .formatMessage({ id: 'steem_power', defaultMessage: `HIVE POWER` })
                .toUpperCase()}
            </th>
            <th className="ReportTableRewards basicWidth">
              {intl
                .formatMessage({
                  id: 'hive',
                  defaultMessage: 'HIVE',
                })
                .toUpperCase()}
            </th>
            <th className="ReportTableRewards basicWidth">
              {intl.formatMessage({
                id: 'total_hive)',
                defaultMessage: 'Total (HIVE)',
              })}
            </th>
            <th className="ReportTableRewards basicWidth">
              {intl.formatMessage({
                id: 'total_usd',
                defaultMessage: 'Total* (USD)',
              })}
            </th>
          </tr>
        </thead>
        <tbody>
          {map(beneficiaries, beneficiary => (
            <ReportTableRewardsRow key={beneficiary.account} {...beneficiary} />
          ))}
          <ReportTableRewardsRowTotal />
        </tbody>
      </table>
    </React.Fragment>
  );
};

ReportTableRewards.propTypes = {
  intl: PropTypes.shape().isRequired,
  // beneficiaries: PropTypes.shape().isRequired,
};

export default injectIntl(ReportTableRewards);
