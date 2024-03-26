import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import USDDisplay from '../../../components/Utils/USDDisplay';
import withAuthActions from '../../../auth/withAuthActions';
import Avatar from '../../../components/Avatar';
import ReservedButtons from '../../../rewards/Proposition/WebsiteReservedButtons/ReservedButtons';
import RewardsPopover from '../../../newRewards/RewardsPopover/RewardsPopover';
import './SocialCampaignCard.less';

const SocialCampaignCard = ({
  maxReward,
  sponsor,
  openDetailsModal,
  proposition,
  handleReserveForPopup,
  getProposition,
  propositionType,
  isSocialProduct,
}) => (
  <div className="SocialCampaignCard">
    <div className="SocialCampaignCard__card">
      <div className="SocialCampaignCard__content">
        <h3>
          <FormattedMessage
            id={`share_photo${proposition?.requirements?.minPhotos === 1 ? '' : 's'}_and_earn`}
            defaultMessage={`Share {minPhotos} photo${
              proposition?.requirements?.minPhotos === 1 ? '' : 's'
            } and earn`}
            values={{ minPhotos: proposition?.requirements?.minPhotos }}
          />
          <span className="SocialCampaignCard__earn">
            {' '}
            <USDDisplay currencyDisplay={'symbol'} value={maxReward} />
          </span>
        </h3>
        <div className="SocialCampaignCard__sponsor-container">
          <Link to={`/@${sponsor}`}>
            <Avatar username={sponsor} size={40} />
          </Link>
          <Link to={`/@${sponsor}`}>
            <span className="username ml2">{sponsor}</span>
          </Link>
          <span className="SocialCampaignCard__sponsor ml1">(sponsor)</span>
        </div>
      </div>
      <div className="Proposition-new__button-container">
        <div className="SocialCampaignCard__reservedButtons">
          <ReservedButtons
            handleReserveForPopover={handleReserveForPopup}
            handleReserve={() => {
              openDetailsModal();

              return Promise.resolve();
            }}
            reserved={proposition.reserved}
            reservedDays={proposition.countReservationDays}
            inCard
            isSocialProduct={isSocialProduct}
          />
          {proposition.reserved && (
            <RewardsPopover
              proposition={proposition}
              type={propositionType}
              getProposition={getProposition}
            />
          )}
        </div>
        <span className="SocialCampaignCard__details" onClick={openDetailsModal}>
          <FormattedMessage id="details" defaultMessage="Details" /> <Icon type="right" />
        </span>
      </div>
    </div>
  </div>
);

SocialCampaignCard.propTypes = {
  handleReserveForPopup: PropTypes.func.isRequired,
  openDetailsModal: PropTypes.func.isRequired,
  getProposition: PropTypes.func.isRequired,
  sponsor: PropTypes.string.isRequired,
  propositionType: PropTypes.string.isRequired,
  proposition: PropTypes.shape().isRequired,
  maxReward: PropTypes.number.isRequired,
  isSocialProduct: PropTypes.bool,
};

SocialCampaignCard.defaultProps = {
  hovered: false,
};

export default withAuthActions(SocialCampaignCard);
