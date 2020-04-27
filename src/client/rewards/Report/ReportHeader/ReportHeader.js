import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { getCurrentUSDPrice } from '../../rewardsHelper';
import Avatar from '../../../components/Avatar';
import './ReportHeader.less';

const ReportHeader = ({ intl }) => {
  const currentUSDPrice = getCurrentUSDPrice();
  const rewardPrise = currentUSDPrice ? `${(currentUSDPrice * 1.2).toFixed(2)} USD` : `${1.2} HIVE`;

  return (
    <React.Fragment>
      <div className="ReportHeader">
        <div className="ReportHeader__name">
          {intl.formatMessage({
            id: 'distribution_of_the_rewards',
            defaultMessage: 'Distribution of the rewards',
          })}
        </div>
        <div className="ReportHeader__data">
          <React.Fragment>
            <span className="ReportHeader__data-colored">
              <span className="fw6">{` ${rewardPrise} `}</span>
            </span>
          </React.Fragment>
        </div>
      </div>
      <div className="ReportHeader__user-info">
        <div className="ReportHeader__user-info__content">
          <div className="ReportHeader__user-info__sponsor">
            <div className="ReportHeader__user-info__sponsor-header">
              <span>{intl.formatMessage({ id: 'sponsor', defaultMessage: 'Sponsor' })}</span>
            </div>
            <div className="ReportHeader__user-info__sponsor-content">
              <Avatar username="pacific.gifts" size={44} />
              <div className="ReportHeader__user-info__sponsor-name-wrap">
                <div className="ReportHeader__user-info__sponsor-name-wrap-alias">
                  Pacific Dining Gifts
                </div>
                <div className="ReportHeader__user-info__sponsor-name-wrap-row">
                  <div className="ReportHeader__user-info__sponsor-name-wrap-row-name">
                    @pacific.gifts
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ReportHeader__user-info__user">
            <div className="ReportHeader__user-info__user-header">
              <span className="user">
                {intl.formatMessage({ id: 'user', defaultMessage: 'User' })}
              </span>
            </div>
            <div className="ReportHeader__user-info__user-content">
              <Avatar username="van.dining" size={44} />
              <div className="ReportHeader__user-info__user-name-wrap">
                <div className="ReportHeader__user-info__user-name-wrap-alias">VanDining</div>
                <div className="ReportHeader__user-info__user-name-wrap-row">
                  <div className="ReportHeader__user-info__user-name-wrap-row-name">
                    @van.dining
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ReportHeader__campaignInfo" role="presentation">
        <span>
          {intl.formatMessage({
            id: 'campaign_announcement',
            defaultMessage: 'Campaign announcement:',
          })}
        </span>
        <span>
          {intl.formatMessage({
            id: 'rewards_reservation',
            defaultMessage: 'Rewards reservation:',
          })}
        </span>
        <span>{intl.formatMessage({ id: 'paymentTable_review', defaultMessage: 'Review' })}:</span>
        <span>{intl.formatMessage({ id: 'review_title', defaultMessage: 'Review title:' })}</span>
      </div>
    </React.Fragment>
  );
};

ReportHeader.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ReportHeader);
