import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Avatar from '../../components/Avatar';

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
  console.log(objectDetails);
  return (
    <Modal
      title={intl.formatMessage({
        id: 'rewards_details_modal_details',
        defaultMessage: 'Details',
      })}
      closable
      onCancel={toggleModal}
      maskClosable={false}
      visible={isModalDetailsOpen}
      wrapClassName="Rewards-modal"
      footer={null}
    >
      <div className="Proposition__title">{objectDetails.name}</div>
      <div className="Proposition__header">
        <div className="Proposition__-type">{`${intl.formatMessage({
          id: 'rewards_details_modal_sponsored',
          defaultMessage: 'Sponsored',
        })}: ${objectDetails.type === 'reviews' &&
          intl.formatMessage({
            id: 'rewards_details_modal_reviews',
            defaultMessage: 'reviews',
          })}`}</div>
        <div className="Proposition__reward">{`${intl.formatMessage({
          id: 'rewards_details_modal_reward',
          defaultMessage: 'Reward',
        })}: ${objectDetails.reward} STEEM`}</div>
      </div>
      <div className="Proposition__footer">
        <div className="Proposition__author">
          <div className="Proposition__author-title">
            {intl.formatMessage({
              id: 'rewards_details_modal_sponsor',
              defaultMessage: 'Sponsor',
            })}
            :
          </div>
          <div className="Rewards-modal__user-card">
            <Link to={`/@${objectDetails.guide.name}`}>
              <Avatar username={objectDetails.guide.name} size={34} />
            </Link>
            <Link to={`/@${objectDetails.guide.name}`} title={objectDetails.guide.name}>
              <span className="username">{objectDetails.guide.name}</span>
            </Link>
          </div>
        </div>
        <div>{`${intl.formatMessage({
          id: 'rewards_details_modal_paid_rewards',
          defaultMessage: 'Paid rewards',
        })}: ${objectDetails.payed} STEEM (${objectDetails.payedPercent}%)`}</div>
      </div>
      <div className="Proposition__body">
        <div className="Proposition__body-description">{objectDetails.description}</div>
      </div>
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
