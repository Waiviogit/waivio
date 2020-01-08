import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Checkbox } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import getDetailsMessages from './detailsMessagesData';
import CampaignCardHeader from '../CampaignCardHeader/CampaignCardHeader';
import './Details.less';

const Details = ({
  intl,
  objectDetails,
  toggleModal,
  isModalDetailsOpen,
  loading,
  reserveOnClickHandler,
  assigned,
  isReserved,
  proposedWobj,
}) => {
  const localizer = (id, defaultMessage, variablesData) =>
    intl.formatMessage({ id, defaultMessage }, variablesData);
  const messageData = getDetailsMessages(localizer, objectDetails);
  return (
    <Modal
      title={<div className="Details__modal-title">{messageData.seekHonestReviews}!</div>}
      closable
      onCancel={toggleModal}
      maskClosable={false}
      visible={isModalDetailsOpen}
      wrapClassName="Details"
      footer={null}
      width={768}
    >
      <CampaignCardHeader campaignData={objectDetails} isDetails />
      <div className="Details__text-wrap">
        <div className="Details__text fw6 mv3">{messageData.eligibilityRequirements}:</div>
        <div className="Details__text mv3">{messageData.eligibilityCriteriaParticipate}</div>
        <div className="Details__criteria-wrap">
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>{`${messageData.minimumSteemReputation}: ${objectDetails.userRequirements.minSteemReputation}`}</div>
          </div>
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>{`${messageData.minimumWaivioExpertise}: ${objectDetails.userRequirements.minExpertise}`}</div>
          </div>
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>{`${messageData.minimumNumberFollowers}: ${objectDetails.userRequirements.minFollowers}`}</div>
          </div>
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>{`${messageData.minimumNumberPosts}: ${objectDetails.userRequirements.minPosts}`}</div>
          </div>
          {!!objectDetails.frequency_assign && (
            <div className="Details__criteria-row">
              <Checkbox checked disabled />
              <div>
                {messageData.receivedRewardFrom}
                <Link to={`/@${objectDetails.guide.name}`}>{` @${objectDetails.guide.name} `}</Link>
                {messageData.forReviewing}
                <Link
                  className="nowrap"
                  to={`/object/${objectDetails.requiredObject}`}
                >{` ${objectDetails.name} `}</Link>
                {messageData.inTheLast}
              </div>
            </div>
          )}
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>
              {messageData.accountNotBlacklisted}
              <Link to={`/@${objectDetails.guide.name}`}>{` @${objectDetails.guide.name} `}</Link>
              {messageData.referencedAccounts}
            </div>
          </div>
        </div>
        <div className="Details__text fw6 mv3">{messageData.postRequirements}:</div>
        <div className="Details__text mv3">{messageData.reviewEligibleAward}</div>
        <div className="Details__criteria-wrap">
          <div className="Details__criteria-row">
            {`1. ${messageData.minimumOriginalPhotos} `}
            <Link className="ml1" to={`/object/${proposedWobj.name}`}>
              {proposedWobj.name}
            </Link>
            ;
          </div>
          <div className="Details__criteria-row">{`2. ${messageData.photoReceipt}`}</div>
          <div className="Details__criteria-row nowrap">
            {`3. ${messageData.linkTo}`}
            <Link className="ml1" to={`/object/${proposedWobj.author_permlink}`}>
              {proposedWobj.name}
            </Link>
            :
            <Link
              className="Details__criteria-link ml1"
              to={`/object/${proposedWobj.author_permlink}`}
            >{`www.waivio.com/object/${proposedWobj.author_permlink}`}</Link>
          </div>
          <div className="Details__criteria-row">
            {`4. ${messageData.linkTo}`}
            <Link className="ml1" to={`/object/${objectDetails.requiredObject}`}>
              {objectDetails.name}
            </Link>
            :
            <Link
              className="Details__criteria-link ml1"
              to={`/object/${objectDetails.requiredObject}`}
            >{`www.waivio.com/object/${objectDetails.requiredObject}`}</Link>
          </div>
          <div className="Details__criteria-row">
            {objectDetails.description &&
              `5. ${messageData.additionalRequirements}: ${objectDetails.description}`}
          </div>
        </div>
        <div className="Details__text mv3">{messageData.sponsorReservesPayment}</div>
        <div className="Details__text fw6 mv3">{messageData.reward}:</div>
        <span>
          {messageData.amountRewardDetermined}(
          <Link to={`/object/${objectDetails.guide.name}`}>{objectDetails.guide.name}</Link>
          {!isEmpty(objectDetails.match_bots) &&
            objectDetails.match_bots.map(bot => (
              <React.Fragment>
                ,
                <Link className="ml1" to={`/object/${bot}`}>
                  {`www.waivio.com/object/${bot}`}
                </Link>
              </React.Fragment>
            ))}
          ){messageData.countTowardsPaymentRewards}
        </span>

        <div className="Details__text fw6 mv3">{messageData.legal}:</div>
        <span>
          {messageData.makingReservation}
          <Link className="ml1" to="/object/xrj-terms-and-conditions/page">
            {messageData.legalTermsAndConditions}
          </Link>
          {!isEmpty(objectDetails.agreementObjects) && ` ${messageData.includingTheFollowing}`}
          {!isEmpty(objectDetails.agreementObjects) &&
            objectDetails.agreementObjects.map(obj => (
              <Link className="ml1" to={`/object/${obj}/page`}>
                {obj}
              </Link>
            ))}
        </span>
      </div>
      <div className="Details__footer">
        <div className="Details__footer-reserve-btn">
          <Button onClick={toggleModal}>{messageData.cancel}</Button>
          <Button
            type="primary"
            loading={loading}
            disabled={
              !(assigned !== null && !assigned && !isReserved) ||
              loading ||
              objectDetails.isReservedSiblingObj
            }
            onClick={reserveOnClickHandler}
          >
            {messageData.reserve}
          </Button>
          {objectDetails.count_reservation_days &&
            `${messageData.forDays} ${objectDetails.count_reservation_days} ${messageData.days}`}
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
  proposedWobj: PropTypes.shape().isRequired,
};
export default injectIntl(Details);
