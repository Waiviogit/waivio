import React from 'react';
import PropTypes from 'prop-types';
import ObjectCardView from '../../objectCard/ObjectCardView';
import SelectUserForAutocomplete from '../../widgets/SelectUserForAutocomplete';

const ReviewItem = ({ isUser, object, removeReviewObject, loading }) => {
  const removeItem = !loading ? () => removeReviewObject(object) : null;

  return isUser ? (
    <SelectUserForAutocomplete
      account={object.name || object.account || object}
      resetUser={removeItem}
    />
  ) : (
    <ObjectCardView wObject={object} closeButton onDelete={removeItem} />
  );
};

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
