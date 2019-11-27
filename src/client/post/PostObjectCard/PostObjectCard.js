import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import ObjectCardView from '../../objectCard/ObjectCardView';
import './PostObjectCard.less';

const propTypes = {
  isLinked: PropTypes.bool.isRequired,
  wObject: PropTypes.shape().isRequired,
  onToggle: PropTypes.func.isRequired,
};

const PostObjectCard = ({ isLinked, wObject, onToggle }) => {
  const handleChange = isLinkedValue => {
    onToggle(wObject.id, isLinkedValue);
  };
  return (
    <div className="PostObjectCard">
      <div className="PostObjectCard__switch">
        <Switch checked={isLinked} onChange={handleChange} />
      </div>
      <ObjectCardView wObject={wObject} />
    </div>
  );
};

PostObjectCard.propTypes = propTypes;

export default PostObjectCard;
