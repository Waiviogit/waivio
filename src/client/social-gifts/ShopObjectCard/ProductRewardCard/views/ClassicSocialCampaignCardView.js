import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import USDDisplay from '../../../../components/Utils/USDDisplay';
import Avatar from '../../../../components/Avatar';
import ReservedButtons from '../../../../rewards/Proposition/WebsiteReservedButtons/ReservedButtons';
import RewardsPopover from '../../../../newRewards/RewardsPopover/RewardsPopover';

const ClassicSocialCampaignCardView = ({
  maxReward,
  sponsor,
  openDetailsModal,
  proposition,
  handleReserveForPopup,
  getProposition,
  propositionType,
  isSocialProduct,
  isCampaign,
  minPhotos,
  propositionGiveaway,
  isSpecialCampaign,
  isMention,
  daysLeft,
  getCampaignText,
  specialAmount,
  buttonLabel,
  goToProducts,
}) => (
  <div className="SocialCampaignCard">
    <div className="SocialCampaignCard__card">
      <div className="SocialCampaignCard__content">
        <h3>
          {isSpecialCampaign ? (
            <>
              <span className="SocialCampaignCard__earn">
                {' '}
                <USDDisplay value={specialAmount} currencyDisplay="symbol" />{' '}
              </span>
              {propositionGiveaway ? 'Giveaway' : 'Contest'}
              {daysLeft !== null && getCampaignText(propositionGiveaway, daysLeft)}
            </>
          ) : (
            <>
              <FormattedMessage
                id={`share_photo${minPhotos === 1 ? '' : 's'}_and_earn`}
                defaultMessage={`Share {minPhotos} photo${minPhotos === 1 ? '' : 's'} and earn`}
                values={{ minPhotos: minPhotos === 0 ? '' : minPhotos }}
              />
              <span className="SocialCampaignCard__earn">
                {' '}
                <USDDisplay currencyDisplay={'symbol'} value={maxReward} />
              </span>
            </>
          )}
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
      <div
        className="Proposition-new__button-container"
        style={{ marginTop: isMention ? '5px' : '' }}
      >
        {isCampaign ? (
          <div style={{ marginTop: '8px' }}>
            <span onClick={goToProducts} className="Campaing__button">
              {buttonLabel}{' '}
              <b>
                <USDDisplay value={maxReward} />
              </b>{' '}
              <Icon type="right" />
            </span>
          </div>
        ) : (
          <div className="SocialCampaignCard__reservedButtons">
            <ReservedButtons
              type={proposition.type}
              handleReserveForPopover={handleReserveForPopup}
              handleReserve={() => {
                openDetailsModal();

                return Promise.resolve();
              }}
              reserved={proposition.reserved}
              reservedDays={proposition.countReservationDays}
              inCard
              isSocialProduct={isSocialProduct}
              authorPermlink={proposition?.object?.author_permlink}
              activationPermlink={proposition?.activationPermlink}
            />
            {proposition.reserved && (
              <RewardsPopover
                proposition={proposition}
                type={propositionType}
                getProposition={getProposition}
              />
            )}
          </div>
        )}
        {!isCampaign && (
          <span className="SocialCampaignCard__details" onClick={openDetailsModal}>
            <FormattedMessage id="details" defaultMessage="Details" /> <Icon type="right" />
          </span>
        )}
      </div>
    </div>
  </div>
);

ClassicSocialCampaignCardView.propTypes = {
  handleReserveForPopup: PropTypes.func.isRequired,
  openDetailsModal: PropTypes.func.isRequired,
  getProposition: PropTypes.func.isRequired,
  sponsor: PropTypes.string.isRequired,
  propositionType: PropTypes.string.isRequired,
  proposition: PropTypes.shape().isRequired,
  maxReward: PropTypes.number.isRequired,
  isSocialProduct: PropTypes.bool,
  isCampaign: PropTypes.bool,
  minPhotos: PropTypes.number,
  propositionGiveaway: PropTypes.bool,
  isSpecialCampaign: PropTypes.bool,
  isMention: PropTypes.bool,
  daysLeft: PropTypes.number,
  getCampaignText: PropTypes.func,
  specialAmount: PropTypes.number,
  buttonLabel: PropTypes.string,
  goToProducts: PropTypes.func,
};

export default ClassicSocialCampaignCardView;
