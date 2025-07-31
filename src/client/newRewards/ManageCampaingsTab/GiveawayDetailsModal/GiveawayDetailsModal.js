import { Modal } from 'antd';
import moment from 'moment';
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
      <strong>Expiry date:</strong>{' '}
      {moment(proposition?.expiredAt)
        .local()
        .format('YYYY-MM-DD hh:mm A')}
    </div>

    <div>
      <strong>Giveaway requirements:</strong>
    </div>
    <ul>
      {proposition?.giveawayRequirements?.follow && <li>✅ Follow the author</li>}
      {proposition?.giveawayRequirements?.likePost && <li>✅ Like the post</li>}
      {proposition?.giveawayRequirements?.comment && <li>✅ Leave a comment</li>}
      {proposition?.giveawayRequirements?.tagInComment && <li>✅ Tag 2 friends in a comment</li>}
      {proposition?.giveawayRequirements?.reblog && <li>✅ Re-blog the post</li>}
    </ul>
    <div>
      <strong>Eligibility:</strong>
    </div>
    {proposition?.userRequirements?.minPosts ||
    proposition?.userRequirements?.minFollowers ||
    proposition?.userRequirements?.minPosts ? (
      <ul>
        {proposition?.userRequirements?.minExpertise && (
          <li>✅ Minimum Waivio expertise: {proposition?.userRequirements?.minExpertise}</li>
        )}
        {proposition?.userRequirements?.minFollowers && (
          <li>✅ Minimum number of followers: {proposition?.userRequirements?.minFollowers}</li>
        )}
        {proposition?.userRequirements?.minPosts && (
          <li>✅ Minimum number of posts: {proposition?.userRequirements?.minPosts}</li>
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
    timezone: PropTypes.string,
    commissionAgreement: PropTypes.number,
    userRequirements: PropTypes.shape({
      minPosts: PropTypes.number,
      minFollowers: PropTypes.number,
      minExpertise: PropTypes.number,
    }),
    giveawayRequirements: PropTypes.shape({
      follow: PropTypes.bool,
      likePost: PropTypes.bool,
      comment: PropTypes.bool,
      tagInComment: PropTypes.bool,
      reblog: PropTypes.bool,
    }),
  }).isRequired,
};

export default GiveawayDetailsModal;
