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

const RateObjectModal = ({
  isVisible,
  ratingCategoryField,
  ownRatesOnly,
  wobjId,
  wobjName,
  username,
  onCancel,
}) =>
  ratingCategoryField ? (
    <React.Fragment>
      <Modal
        className="RateInfo__modal"
        destroyOnClose
        footer={null}
        title={wobjName ? `${wobjName} - ${ratingCategoryField.body}` : ratingCategoryField}
        visible={username && isVisible}
        onCancel={onCancel}
      >
        <RateForm
          authorPermlink={wobjId}
          field={ratingCategoryField}
          initialValue={getInitialRateValue(ratingCategoryField, username)}
          ownRatesOnly={ownRatesOnly}
          username={username}
        />
      </Modal>
    </React.Fragment>
  ) : null;

RateObjectModal.propTypes = {
  isVisible: PropTypes.bool,
  ownRatesOnly: PropTypes.bool,
  ratingCategoryField: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  wobjId: PropTypes.string.isRequired,
  wobjName: PropTypes.string,
  onCancel: PropTypes.func,
};
RateObjectModal.defaultProps = {
  isVisible: false,
  ownRatesOnly: false,
  ratingCategoryField: null,
  wobjName: '',
  onCancel: () => {},
};

export default RateObjectModal;
