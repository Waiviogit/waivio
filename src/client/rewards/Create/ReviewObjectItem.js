import { Icon } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import ObjectCardView from '../../objectCard/ObjectCardView';
import './ReviewObjectItem.less';

const ReviewObjectItem = ({ object, removeReviewObject }) => (
  <React.Fragment>
    <div className="Review-object-item__close-circle">
      <Icon type="close-circle" onClick={() => removeReviewObject(object)} />
    </div>
    <ObjectCardView wObject={object} />
  </React.Fragment>
);

ReviewObjectItem.propTypes = {
  object: PropTypes.shape().isRequired,
  removeReviewObject: PropTypes.func.isRequired,
};

export default ReviewObjectItem;
