import { Icon } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ObjectCardView from '../../objectCard/ObjectCardView';
import './ReviewObjectItem.less';
import UserCardView from '../../userCardView/UserCardView';

const ReviewItem = ({ isUser, object, removeReviewObject, loading }) => (
  <React.Fragment>
    <div className={classNames('Review-object-item__close-circle', { 'disable-element': loading })}>
      <Icon type="close-circle" onClick={!loading ? () => removeReviewObject(object) : null} />
    </div>
    {!isUser ? <ObjectCardView wObject={object} /> : <UserCardView user={object} />}
  </React.Fragment>
);

ReviewItem.propTypes = {
  object: PropTypes.shape().isRequired,
  removeReviewObject: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isUser: PropTypes.bool,
};

ReviewItem.defaultProps = {
  isUser: false,
  loading: false,
};

export default ReviewItem;
