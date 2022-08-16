import React from 'react';
import PropTypes from 'prop-types';
import { size } from 'lodash';
import { Button, Icon, Modal } from 'antd';
import { photosInPostRegex } from '../../../common/helpers/regexHelpers';
import { getReviewRequirements } from '../../rewards/rewardsHelper';

import './CheckReviewModal.less';
import SubmitReviewPublish from './SubmitReviewPublish';

const getIcon = isValidOption => (
  <Icon type="check-square" style={{ color: isValidOption ? '#30b580' : '#d9534f' }} />
);

const CheckReviewModal = ({
  intl,
  postBody,
  isCheckReviewModalOpen,
  reviewData,
  linkedObjects,
  onCancel,
  onEdit,
  onSubmit,
}) => {
  const { postRequirements } = getReviewRequirements(reviewData);
  const primaryObject = postRequirements.requiredObject;
  const secondaryObject = postRequirements.secondaryObject;
  const hasMinPhotos = size(postBody.match(photosInPostRegex)) >= postRequirements.minPhotos;
  const hasObject = object =>
    linkedObjects.some(obj => obj.author_permlink === object.author_permlink);

  const modalBody =
    hasMinPhotos && hasObject(secondaryObject) && hasObject(primaryObject) ? (
      <React.Fragment>
        <SubmitReviewPublish reviewData={reviewData} primaryObject={primaryObject} />
        <div className="check-review-modal__buttons">
          <Button htmlType="button" onClick={onCancel} size="large">
            {intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
          </Button>
          <Button htmlType="button" onClick={onSubmit} size="large" type="primary">
            {intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}
          </Button>
        </div>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <div className="check-review-modal__paragraph fw5">
          {intl.formatMessage({
            id: `check_review_requirements_title`,
            defaultMessage: 'This review does not meet some of the formal requirements.',
          })}
        </div>
        <div className="check-review-modal__list">
          <div className="check-review-modal__list-title fw5">
            {intl.formatMessage({
              id: `check_review_post_requirements`,
              defaultMessage: 'Post requirements',
            })}
            :
          </div>
          <div className="check-review-modal__list-item">
            {getIcon(hasMinPhotos)}
            {intl.formatMessage(
              {
                id: `check_review_minPhotos`,
                defaultMessage: 'Minimum {minPhotos} original photos of {secondaryObjectName}',
              },
              {
                minPhotos: postRequirements.minPhotos,
                secondaryObjectName: secondaryObject.name,
              },
            )}
          </div>
          <div className="check-review-modal__list-item">
            {getIcon(hasObject(secondaryObject))}
            {intl.formatMessage({
              id: 'rewards_details_link_to',
              defaultMessage: 'Link to',
            })}{' '}
            {<a href={`/object/${secondaryObject.defaultShowLink}`}>{secondaryObject.name}</a>}
          </div>
          <div className="check-review-modal__list-item">
            {getIcon(hasObject(primaryObject))}
            {intl.formatMessage({
              id: 'rewards_details_link_to',
              defaultMessage: 'Link to',
            })}{' '}
            {<a href={`/object/${primaryObject.defaultShowLink}`}>{primaryObject.name}</a>}
          </div>
        </div>
        <div className="check-review-modal__buttons">
          <Button htmlType="button" onClick={onEdit} size="large">
            {intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
          </Button>
        </div>
      </React.Fragment>
    );

  return (
    <Modal
      title={null}
      footer={null}
      visible={isCheckReviewModalOpen}
      centered={false}
      closable
      confirmLoading={false}
      wrapClassName="check-review-modal"
      width={600}
      onCancel={onCancel}
      zIndex={1501}
      maskClosable={false}
    >
      <div className="check-review-modal__body">{modalBody}</div>
    </Modal>
  );
};

CheckReviewModal.propTypes = {
  intl: PropTypes.shape().isRequired,
  postBody: PropTypes.string.isRequired,
  isCheckReviewModalOpen: PropTypes.bool,
  reviewData: PropTypes.shape({
    name: PropTypes.string,
    alias: PropTypes.string,
    guideName: PropTypes.string,
  }),
  linkedObjects: PropTypes.arrayOf(PropTypes.shape()),
  onCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

CheckReviewModal.defaultProps = {
  isCheckReviewModalOpen: false,
  isReviewValid: false,
  reviewData: {},
  linkedObjects: [],
};

export default CheckReviewModal;
