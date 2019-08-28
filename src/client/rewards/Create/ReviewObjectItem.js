import { Icon } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ObjectCardView from '../../objectCard/ObjectCardView';
import './ReviewObjectItem.less';

const ReviewObjectItem = ({ object, removeReviewObject, loading }) => (
  <React.Fragment>
    <div className={classNames('Review-object-item__close-circle', { 'disable-element': loading })}>
      <Icon type="close-circle" onClick={!loading ? () => removeReviewObject(object) : null} />
    </div>
    <ObjectCardView wObject={object} />
  </React.Fragment>
);

ReviewObjectItem.propTypes = {
  object: PropTypes.shape().isRequired,
  removeReviewObject: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ReviewObjectItem;
