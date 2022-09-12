import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get, round } from 'lodash';

import './CampaignCardHeader.less';

const CampaignCardHeader = ({ intl, campaignData }) => (
  <React.Fragment>
    <div className="CampaignCardHeader">
      <div className="CampaignCardHeader__name">
        {intl.formatMessage(
          {
            id: 'rewards_details_reward_for_reviews_title',
            defaultMessage: 'Share {count} photos of the dish and earn crypto',
          },
          { count: get(campaignData, 'requirements.minPhotos', 0) },
        )}
      </div>
    </div>
    <div className="user-info">
      <div className="user-info__content">
        <Link to={`/@${campaignData?.guide?.name}`} title={campaignData?.guide?.name}>
          <div className="username">
            {campaignData?.guide?.alias} (
            {intl.formatMessage({ id: 'sponsor', defaultMessage: 'Sponsor' })})
          </div>
          <div className="username">{`@${campaignData?.guide?.name}`}</div>
        </Link>
        <div className="total-paid">
          <div className="total-paid__liquid">
            {intl.formatMessage({
              id: 'total_paid_liquid',
              defaultMessage: 'Total paid (liquid)',
            })}
            :
          </div>
          <div className="total-paid__currency">
            {`${round(get(campaignData, 'guide.totalPayed'))} HIVE`}{' '}
            {`(${
              campaignData?.guide?.liquidHivePercent
                ? campaignData?.guide?.liquidHivePercent
                : 'n/a'
            }%)`}
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);

CampaignCardHeader.propTypes = {
  intl: PropTypes.shape().isRequired,
  campaignData: PropTypes.shape().isRequired,
};

export default injectIntl(CampaignCardHeader);
