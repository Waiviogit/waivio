import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

import './GiveawayDetailsModal.less';

const GiveawayDetailsModal = ({ visible, proposition, onCancel }) => (
  <Modal
    className={'GiveawayDetailsModal'}
    footer={null}
    onCancel={() => onCancel(null)}
    visible={visible}
  >
    <div>
      <strong>Name:</strong> {proposition.name}
    </div>
    <div>
      <strong>Reward (per winner, USD):</strong> {proposition?.reward}
    </div>
    <div>
      <strong>Number of winners:</strong> {proposition?.budget / proposition?.reward}
    </div>
    <div>
      <strong>Payment currency:</strong> WAIV
    </div>
    <div>
      <strong>Expiry date:</strong> {proposition?.expiredAt}
    </div>

    <div>
      <strong>Giveaway requirements:</strong>
    </div>
    <ul>
      <li>✅ Follow the author</li>
      <li>✅ Like the post</li>
      <li>✅ Leave a comment</li>
      <li>✅ Tag 2 friends in a comment</li>
      <li>✅ Re-blog the post</li>
    </ul>
    <div>
      <strong>Users requirements:</strong>
    </div>
    {proposition?.userRequirements?.minPosts ||
    proposition?.userRequirements?.minFollowers ||
    proposition?.userRequirements?.minPosts ? (
      <ul>
        {proposition?.userRequirements?.minExpertise && (
          <li>✅ Minimum Expertise: {proposition?.userRequirements?.minExpertise}</li>
        )}
        {proposition?.userRequirements?.minFollowers && (
          <li>✅ Minimum followers: {proposition?.userRequirements?.minFollowers}</li>
        )}
        {proposition?.userRequirements?.minPosts && (
          <li>✅ Minimum Posts: {proposition?.userRequirements?.minPosts}</li>
        )}
      </ul>
    ) : (
      <div>All users</div>
    )}
    <div>
      <strong>Commissions:</strong> {proposition?.commissionAgreement * 100}%
    </div>
  </Modal>
);

GiveawayDetailsModal.propTypes = {
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  proposition: PropTypes.shape({
    name: PropTypes.string,
    reward: PropTypes.number,
    budget: PropTypes.number,
    expiredAt: PropTypes.string,
    commissionAgreement: PropTypes.number,
    userRequirements: PropTypes.shape({
      minPosts: PropTypes.number,
      minFollowers: PropTypes.number,
      minExpertise: PropTypes.number,
    }),
  }).isRequired,
};

export default GiveawayDetailsModal;
