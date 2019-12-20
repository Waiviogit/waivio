import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Checkbox } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Avatar from '../../components/Avatar';
import './Details.less';
import detailsData from './detailsData';

const Details = ({
  intl,
  objectDetails,
  toggleModal,
  isModalDetailsOpen,
  loading,
  reserveOnClickHandler,
  assigned,
  isReserved,
}) => {
  const localizer = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });
  const data = detailsData(localizer);
  return (
    <Modal
      title={<div className="Details__modal-title">{data.seekHonestReviews}!</div>}
      closable
      onCancel={toggleModal}
      maskClosable={false}
      visible={isModalDetailsOpen}
      wrapClassName="Details"
      footer={null}
      width={768}
    >
      <div className="Details__title-wrap">
        <div className="Details__title-wrap-name">{data.rewardReviews}</div>
        <div className="Details__title-wrap-data">
          <span>{data.earn}</span>
          <span className="Details__title-wrap-data-colored">
            <span className="fw6">{` ${objectDetails.reward} `}</span>
            <span>STEEM</span>
          </span>
          <span>
            {' '}
            (<span className="fw6">{`${objectDetails.reward}`}</span> USD)
          </span>
        </div>
      </div>
      <div className="Details__user-info">
        <div className="Details__user-card">
          <Link to={`/@${objectDetails.guide.name}`}>
            <Avatar username={objectDetails.guide.name} size={34} />
          </Link>
          <Link to={`/@${objectDetails.guide.name}`} title={objectDetails.guide.name}>
            <div className="Details__user-card-username">
              {objectDetails.guide.alias} ({data.sponsor})
            </div>
            <div className="Details__user-card-username">{`@${objectDetails.guide.name}`}</div>
          </Link>
        </div>
        <div className="Details__total-paid">
          <div>{data.totalPaid}</div>
          <div>{`${objectDetails.guide.total_payed} STEEM`}</div>
        </div>
      </div>
      <div className="Details__text-wrap">
        <div className="Details__text fw6 mv3">{data.eligibilityRequirements}:</div>
        <div className="Details__text mv3">{data.eligibilityCriteriaParticipate}</div>
        <div className="Details__criteria-wrap">
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>{data.minimumSteemReputation}:</div>
          </div>
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>{data.minimumWaivioExpertise}:</div>
          </div>
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>{data.minimumNumberFollowers}:</div>
          </div>
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>{data.minimumNumberPosts}:</div>
          </div>
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>{data.receivedRewardReviewing}</div>
          </div>
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>{data.accountNotBlacklisted}</div>
          </div>
        </div>
        <div className="Details__text fw6 mv3">{data.postRequirements}</div>
        <div className="Details__text mv3">{data.reviewEligibleAward}</div>
        <div className="Details__criteria-wrap">
          <div className="Details__criteria-row">1. {data.minimumOriginalPhotos}</div>
          <div className="Details__criteria-row">2. {data.photoReceipt}</div>
          <div className="Details__criteria-row">3. {data.linkSecondaryObject}</div>
          <div className="Details__criteria-row">4. {data.linkPrimaryObject}</div>
          <div className="Details__criteria-row">5. {data.additionalRequirements}</div>
        </div>
        <div className="Details__text mv3">{data.sponsorReservesPayment}</div>

        <div className="Details__text fw6 mv3">{data.reward}:</div>
        <span>{data.amountRewardDetermined}</span>

        <div className="Details__text fw6 mv3">Legal:</div>
        <span>{data.legalAgreementHighlights}</span>
      </div>
      <div className="Details__footer">
        <div className="Details__footer-reserve-btn">
          <Button onClick={toggleModal}>{data.cancel}</Button>
          <Button
            type="primary"
            loading={loading}
            disabled={!(assigned !== null && !assigned && !isReserved) || loading}
            onClick={reserveOnClickHandler}
          >
            {data.reserve}
          </Button>
          {objectDetails.count_reservation_days &&
            `${data.forDays} ${objectDetails.count_reservation_days} ${data.days}`}
        </div>
      </div>
    </Modal>
  );
};

Details.propTypes = {
  intl: PropTypes.shape().isRequired,
  objectDetails: PropTypes.shape().isRequired,
  toggleModal: PropTypes.func.isRequired,
  isModalDetailsOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  reserveOnClickHandler: PropTypes.func.isRequired,
  assigned: PropTypes.bool.isRequired,
  isReserved: PropTypes.bool.isRequired,
};
export default injectIntl(Details);
