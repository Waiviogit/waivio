import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { map, filter, get, reduce, round, capitalize } from 'lodash';
import { useSelector } from 'react-redux';
import ReportTableRewardsRow from '../ReportTableRewards/ReportTableRewardsRow';
import ReportTableRewardsRowTotal from './ReportTableRewardsRowTotal';
import { getSingleReportData } from '../../../../../store/rewardsStore/rewardsSelectors';

import './ReportTableRewards.less';

const ReportTableRewards = ({ intl, currencyInfo, reportDetails, payoutToken }) => {
  const singleReportData = reportDetails || useSelector(getSingleReportData);
  const reportUserName = get(singleReportData, ['user', 'name']);
  const getPayableInDollars = item =>
    get(item, ['details', 'payableInDollars']) || item?.payableInUSD;
  const filteredHistory = filter(
    singleReportData.histories,
    obj => obj.type === 'review' || obj.type === 'beneficiary_fee' || obj.type === 'beneficiaryFee',
  ).sort((a, b) => getPayableInDollars(b) - getPayableInDollars(a));
  const totalHive = Number(singleReportData.rewardTokenAmount || singleReportData.rewardHive);
  const beneficiaries = reduce(
    filteredHistory,
    (acc, obj) => {
      const userName = get(obj, ['userName']);
      const ownHive = userName === reportUserName;
      const votesAmount = get(obj, ['details', 'votesAmount'], 0) || obj?.votesAmount || 0;
      const amount = get(obj, ['amount'], 0);

      return [
        ...acc,
        {
          id: get(obj, '_id'),
          account: get(obj, ['userName'], ''),
          weight: round(((amount + votesAmount) * 100) / totalHive),
          votesAmount,
          amount,
          payableInDollars: getPayableInDollars(obj),
          ownHive,
          payoutToken,
        },
      ];
    },
    [],
  );

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
              {payoutToken}** {payoutToken === 'WAIV' ? 'Upvotes' : 'Power'}
            </th>
            <th className="ReportTableRewards basicWidth">{payoutToken}</th>
            <th className="ReportTableRewards basicWidth">
              {capitalize(
                intl.formatMessage({
                  id: 'total',
                  defaultMessage: 'Total',
                }),
              )}{' '}
              ({payoutToken})
            </th>
            <th className="ReportTableRewards basicWidth">
              {intl.formatMessage({
                id: 'total_usd',
                defaultMessage: 'Total*',
              })}{' '}
              ({currencyInfo.type})
            </th>
          </tr>
        </thead>
        <tbody>
          {map(beneficiaries, beneficiary => (
            <ReportTableRewardsRow key={beneficiary.id} {...beneficiary} />
          ))}
          <ReportTableRewardsRowTotal
            totalUSD={singleReportData.rewardUsd}
            totalHive={singleReportData.rewardTokenAmount}
          />
        </tbody>
      </table>
    </React.Fragment>
  );
};

ReportTableRewards.propTypes = {
  intl: PropTypes.shape().isRequired,
  currencyInfo: PropTypes.shape({
    type: PropTypes.string,
    rate: PropTypes.number,
  }).isRequired,
  reportDetails: PropTypes.shape().isRequired,
  payoutToken: PropTypes.string.isRequired,
};

export default injectIntl(ReportTableRewards);
