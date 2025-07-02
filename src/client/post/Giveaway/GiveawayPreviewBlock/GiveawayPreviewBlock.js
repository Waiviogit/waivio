import React from 'react';
import { Button, Icon } from 'antd';

import './GiveawayPreviewBlock.less';

const GiveawayPreviewBlock = ({ formData, onEdit }) => {
  const {
    reward,
    winners,
    requirements = [],
    eligible,
    minExpertise,
    minFollowers,
    minPosts,
  } = formData;

  const renderRequirement = (label, key) =>
    requirements.includes(key) && (
      <div className="GiveawayPreviewBlock__item">
        <Icon type="check" className="GiveawayPreviewBlock__icon" />
        <span>{label}</span>
      </div>
    );

  const renderUserRequirements = () => {
    if (eligible === 'all') {
      return (
        <div className="GiveawayPreviewBlock__item">
          <Icon type="check" className="GiveawayPreviewBlock__icon" />
          <span>Available to everyone</span>
        </div>
      );
    }

    const rules = [];
    if (minExpertise) rules.push(`Minimum Waivio expertise: ${minExpertise}`);
    if (minFollowers) rules.push(`Minimum number of followers: ${minFollowers}`);
    if (minPosts) rules.push(`Minimum number of posts: ${minPosts}`);

    return rules.map((rule, i) => (
      <div key={i} className="GiveawayPreviewBlock__item">
        <Icon type="check" className="GiveawayPreviewBlock__icon" />
        <span>{rule}</span>
      </div>
    ));
  };

  return (
    <div className="GiveawayPreviewBlock">
      <div className="GiveawayPreviewBlock__header">
        <h3 className="GiveawayPreviewBlock__title">
          Giveaway time! Your chance to win ${reward} with {winners} winner{winners > 1 ? 's' : ''}!
        </h3>
        <Button size="small" onClick={onEdit}>
          Edit
        </Button>
      </div>

      <div className="GiveawayPreviewBlock__section">
        <strong className="GiveawayPreviewBlock__label">To enter:</strong>
        <div className="GiveawayPreviewBlock__list">
          {renderRequirement('Like the post', 'like')}
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

export default GiveawayPreviewBlock;
