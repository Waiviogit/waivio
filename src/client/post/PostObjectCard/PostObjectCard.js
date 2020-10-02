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
    // eslint-disable-next-line no-underscore-dangle
    onToggle(wObject.id, isLinkedValue, wObject._id);
  };
  return (
    <div className="PostObjectCard">
      <div className="PostObjectCard__switch">
        <Switch checked={isLinked} onChange={handleChange} size="default" />
      </div>
      <ObjectCardView wObject={wObject} options={{ mobileView: 'full', ownRatesOnly: true }} />
    </div>
  );
};

PostObjectCard.propTypes = propTypes;

export default PostObjectCard;
