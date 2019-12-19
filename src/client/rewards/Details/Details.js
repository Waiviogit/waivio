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
  const localizer = (id, message) => intl.formatMessage({ id, message });
  const data = detailsData(localizer);
  return (
    <Modal
      title={
        <div className="Details__modal-title">
          {intl.formatMessage({
            id: 'rewards_details_seek_honest_reviews',
            defaultMessage: 'We seek honest reviews',
          })}
          !
        </div>
      }
      closable
      onCancel={toggleModal}
      maskClosable={false}
      visible={isModalDetailsOpen}
      wrapClassName="Details"
      footer={null}
      width={768}
    >
      <div className="Details__title-wrap">
        <div className="Details__title-wrap-name">
          {intl.formatMessage({
            id: 'rewards_details_reward_for_reviews',
            defaultMessage: 'Reward for reviews',
          })}
        </div>
        <div className="Details__title-wrap-data">
          <span>
            {intl.formatMessage({
              id: 'rewards_details_earn',
              defaultMessage: 'Earn',
            })}
          </span>
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
              {objectDetails.guide.alias} (
              {intl.formatMessage({
                id: 'sponsor',
                defaultMessage: `Sponsor`,
              })}
              )
            </div>
            <div className="Details__user-card-username">{`@${objectDetails.guide.name}`}</div>
          </Link>
        </div>
        <div className="Details__total-paid">
          <div>
            {intl.formatMessage({
              id: 'paid',
              defaultMessage: `Total paid`,
            })}
          </div>
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
        <div className="Details__text fw6 mv3">Post requirements:</div>
        <div className="Details__text mv3">
          For the review to be eligible for the award, all the following requirements must be met:
        </div>
        <div className="Details__criteria-wrap">
          <div className="Details__criteria-row">
            1. Minimum [min. number of photos] original photos of [name of the secondary object];
          </div>
          <div className="Details__criteria-row">
            2. Photo of the receipt (without personal details);
          </div>
          <div className="Details__criteria-row">
            3. Link to [name of the secondary object]: [URL of the secondary object]
          </div>
          <div className="Details__criteria-row">
            4. Link to [name of primary object]: [URL of the primary object]
          </div>
          <div className="Details__criteria-row">
            5. Additional requirements/notes: [additional notes]
          </div>
        </div>
        <div className="Details__text mv3">
          Sponsor reserves the right to refuse the payment if review is suspected to be fraudulent,
          spam, poorly written or for other reasons as stated in the agreement.
        </div>

        <div className="Details__text fw6 mv3">Reward:</div>
        <span>
          The amount of the reward is determined in STEEM at the time of reservation. The reward
          will be paid in the form of a combination of upvotes (Steem Power) and direct payments
          (liquid STEEM). Only upvotes from registered accounts (@[sponsor], @[registered match
          bots]) count towards the payment of rewards. The value of all other upvotes is not
          subtracted from the specified amount of the reward.
        </span>

        <div className="Details__text fw6 mv3">Legal:</div>
        <span>
          By making the reservation, you confirm that you have read and agree to the Terms and
          Conditions of the Service Agreement, including the following: Legal highlights: legal
          agreement highlights.
        </span>
      </div>
      <div className="Details__footer">
        <div className="Details__footer-reserve-btn">
          <Button onClick={toggleModal}>
            {intl.formatMessage({
              id: 'cancel',
              defaultMessage: `Cancel`,
            })}
          </Button>
          <Button
            type="primary"
            loading={loading}
            disabled={!(assigned !== null && !assigned && !isReserved) || loading}
            onClick={reserveOnClickHandler}
          >
            {intl.formatMessage({
              id: 'reserve',
              defaultMessage: `Reserve`,
            })}
          </Button>
          {objectDetails.count_reservation_days &&
            `${intl.formatMessage({
              id: 'for_days',
              defaultMessage: `for`,
            })} ${objectDetails.count_reservation_days} ${intl.formatMessage({
              id: 'days',
              defaultMessage: `days`,
            })}`}
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
