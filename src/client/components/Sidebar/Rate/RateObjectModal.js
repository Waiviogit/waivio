import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import RateForm from './RateForm';
import { ratePercent } from '../../../../common/constants/listOfFields';

function getInitialRateValue(field, currUser) {
  const voter =
    field && field.rating_votes && field.rating_votes.find(rate => rate.voter === currUser);
  return voter ? ratePercent.indexOf(voter.rate) + 1 : 0;
}

const RateObjectModal = ({ wobjId, ratingCategoryField, isVisible, username, onCancel }) =>
  ratingCategoryField ? (
    <React.Fragment>
      <Modal
        destroyOnClose
        title={ratingCategoryField.body}
        visible={username && isVisible}
        footer={null}
        onCancel={onCancel}
        className="RateInfo__modal"
      >
        <RateForm
          initialValue={getInitialRateValue(ratingCategoryField, username)}
          field={ratingCategoryField}
          authorPermlink={wobjId}
          username={username}
        />
      </Modal>
    </React.Fragment>
  ) : null;

RateObjectModal.propTypes = {
  wobjId: PropTypes.string.isRequired,
  ratingCategoryField: PropTypes.shape,
  isVisible: PropTypes.bool,
  username: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
};
RateObjectModal.defaultProps = {
  isVisible: false,
  ratingCategoryField: null,
  onCancel: () => {},
};

export default RateObjectModal;
