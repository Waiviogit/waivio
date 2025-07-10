import PropsType from 'prop-types';
import React from 'react';
import { Button, Checkbox } from 'antd';

import './GiveawayBlockPreview.less';

const GiveawayBlockPreview = ({ formData, onEdit, isEditable, onDelete }) => {
  const {
    reward,
    winners,
    giveawayRequirements = [],
    eligible,
    minExpertise,
    minFollowers,
    minPosts,
  } = formData;

  const renderRequirement = (label, key) =>
    giveawayRequirements.includes(key) && (
      <div className="GiveawayPreviewBlock__item">
        <Checkbox checked disabled />
        <span>{label}</span>
      </div>
    );

  const renderUserRequirements = () => {
    if (eligible === 'all') {
      return (
        <div className="GiveawayPreviewBlock__item">
          <Checkbox checked disabled />
          <span>Available to everyone</span>
        </div>
      );
    }

    const rules = [];

    if (minExpertise) rules.push(`Minimum Waivio expertise: ${minExpertise}`);
    if (minFollowers) rules.push(`Minimum number of followers: ${minFollowers}`);
    if (minPosts) rules.push(`Minimum number of posts: ${minPosts}`);

    return rules.map(rule => (
      <div key={rule} className="GiveawayPreviewBlock__item">
        <Checkbox checked disabled />
        <span>{rule}</span>
      </div>
    ));
  };

  return (
    <div className="GiveawayPreviewBlock">
      <div className="GiveawayPreviewBlock__header">
        <h3 className="GiveawayPreviewBlock__title">
          Giveaway time! Your chance to win ${reward}
          {winners > 1 ? ` with ${winners} winners` : ''}!
        </h3>
        {isEditable && (
          <div>
            <Button style={{ marginRight: '5px' }} onClick={onEdit}>
              Edit
            </Button>
            <Button onClick={onDelete}>Delete</Button>
          </div>
        )}
      </div>
      <div className="GiveawayPreviewBlock__section">
        <strong className="GiveawayPreviewBlock__label">To enter:</strong>
        <div className="GiveawayPreviewBlock__list">
          {renderRequirement('Like the post', 'likePost')}
          {renderRequirement('Follow the author', 'follow')}
          {renderRequirement('Leave a comment', 'comment')}
          {renderRequirement('Tag a friend in a comment', 'tag')}
          {renderRequirement('Re-blog the post', 'reblog')}
        </div>
      </div>

      <div className="GiveawayPreviewBlock__section">
        <strong className="GiveawayPreviewBlock__label">User requirements:</strong>
        <div className="GiveawayPreviewBlock__list">{renderUserRequirements()}</div>
      </div>

      <p className="GiveawayPreviewBlock__disclaimer">
        Sponsor reserves the right to refuse the payment if review is suspected to be fraudulent,
        spam, poorly written or for other reasons.
      </p>
    </div>
  );
};

GiveawayBlockPreview.propTypes = {
  formData: PropsType.shape({
    reward: PropsType.number,
    winners: PropsType.number,
    giveawayRequirements: PropsType.number,
    eligible: PropsType.number,
    minExpertise: PropsType.number,
    minFollowers: PropsType.number,
    minPosts: PropsType.number,
  }),
  onEdit: PropsType.func,
  onDelete: PropsType.func,
  isEditable: PropsType.bool,
};

export default GiveawayBlockPreview;
