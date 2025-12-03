import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import USDDisplay from '../../../../components/Utils/USDDisplay';
import Avatar from '../../../../components/Avatar';
import ReservedButtons from '../../../../rewards/Proposition/WebsiteReservedButtons/ReservedButtons';
import RewardsPopover from '../../../../newRewards/RewardsPopover/RewardsPopover';

import '../SocialCampaignCard.clean.less';

const CleanSocialCampaignCardView = ({
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
  daysLeft,
  getCampaignText,
  specialAmount,
  goToProducts,
}) => (
  <div className="SocialCampaignCardClean">
    <div className="SocialCampaignCardClean__card">
      <div className="SocialCampaignCardClean__badge">
        {/* eslint-disable-next-line no-nested-ternary */}
        {isSpecialCampaign
          ? propositionGiveaway
            ? 'GIVEAWAY'
            : 'CONTEST'
          : // eslint-disable-next-line no-nested-ternary
          proposition.type === 'reviews'
          ? 'REVIEW'
          : proposition.type === 'mentions'
          ? 'MENTION'
          : proposition.type?.toUpperCase() || 'CAMPAIGN'}
      </div>
      <div className="SocialCampaignCardClean__avatar">
        <Link to={`/@${sponsor}`}>
          <Avatar username={sponsor} size={50} />
        </Link>
      </div>
      <div className="SocialCampaignCardClean__content">
        <h3 className="SocialCampaignCardClean__title">
          {isSpecialCampaign ? (
            <>
              <span className="SocialCampaignCardClean__amount">
                <USDDisplay value={specialAmount} currencyDisplay="symbol" />
              </span>{' '}
              {propositionGiveaway ? 'Giveaway' : 'Contest'}
              {daysLeft !== null && (
                <span className="SocialCampaignCardClean__days">
                  {getCampaignText(propositionGiveaway, daysLeft)}
                </span>
              )}
            </>
          ) : (
            <>
              <FormattedMessage
                id={`share_photo${minPhotos === 1 ? '' : 's'}_and_earn`}
                defaultMessage={`Share {minPhotos} photo${minPhotos === 1 ? '' : 's'} & earn`}
                values={{ minPhotos: minPhotos === 0 ? '' : minPhotos }}
              />
              <span className="SocialCampaignCardClean__amount">
                {' '}
                <USDDisplay currencyDisplay={'symbol'} value={maxReward} />
              </span>
            </>
          )}
        </h3>
        <div className="SocialCampaignCardClean__buttons">
          {isCampaign ? (
            <button onClick={goToProducts} className="SocialCampaignCardClean__participateBtn">
              Participate
            </button>
          ) : (
            <div className="SocialCampaignCardClean__reservedButtons">
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
          <span className="SocialCampaignCardClean__details" onClick={openDetailsModal}>
            <FormattedMessage id="details" defaultMessage="Details" /> <Icon type="right" />
          </span>
        </div>
      </div>
    </div>
  </div>
);

CleanSocialCampaignCardView.propTypes = {
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
  daysLeft: PropTypes.number,
  getCampaignText: PropTypes.func,
  specialAmount: PropTypes.number,
  goToProducts: PropTypes.func,
};

export default CleanSocialCampaignCardView;
