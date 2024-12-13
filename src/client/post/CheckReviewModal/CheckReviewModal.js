import React from 'react';
import PropTypes from 'prop-types';
import { size } from 'lodash';
import { Button, Icon, Modal } from 'antd';
import { photosInPostRegex } from '../../../common/helpers/regexHelpers';
import SubmitReviewPublish from './SubmitReviewPublish';
import { getObjectUrlForLink } from '../../../common/helpers/wObjectHelper';

import './CheckReviewModal.less';

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
  tags,
}) => {
  const primaryObject = reviewData.requiredObject;
  const secondaryObject = reviewData.secondaryObject;
  const hasMinPhotos = size(postBody.match(photosInPostRegex)) >= reviewData.requirements.minPhotos;
  const hasWaivioTag = postBody?.includes('#waivio') || tags?.includes('waivio');
  const isMention = reviewData?.type === 'mentions';
  const meetsWaivioTagReq = isMention && hasWaivioTag;
  const hasReceipt =
    size(postBody.match(photosInPostRegex)) >= reviewData.requirements.receiptPhoto;

  const hasObject = object => {
    if (object.url && postBody) {
      const url = object.url.replace(/[*\\<>]/g, '');
      const body = postBody.replace(/[*\\<>]/g, '');
      const regex = new RegExp(url);

      return object.url[object.url.length - 1] === '*' ? body.includes(url) : regex.test(body);
    }

    return (
      linkedObjects.some(obj => obj.author_permlink === object.author_permlink) ||
      postBody.includes(`@${object.name}`)
    );
  };

  const modalBody =
    hasMinPhotos && hasReceipt && hasObject(secondaryObject) && hasObject(primaryObject) ? (
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
                defaultMessage: 'Minimum {minPhotos} original photos of ',
              },
              {
                minPhotos: reviewData?.requirements?.minPhotos,
              },
            )}
            {<a href={getObjectUrlForLink(secondaryObject)}>{secondaryObject.name}</a>}
          </div>
          {reviewData?.requirements?.receiptPhoto && (
            <div className="check-review-modal__list-item">
              {getIcon(hasReceipt)}
              Photo of the receipt (without personal details).
            </div>
          )}
          <div className="check-review-modal__list-item">
            {getIcon(hasObject(secondaryObject))}
            {intl.formatMessage({
              id: 'rewards_details_link_to',
              defaultMessage: 'Link to',
            })}{' '}
            {<a href={getObjectUrlForLink(secondaryObject)}>{secondaryObject.name}</a>}
          </div>
          <div className="check-review-modal__list-item">
            {getIcon(hasObject(primaryObject))}
            {intl.formatMessage({
              id: 'rewards_details_link_to',
              defaultMessage: 'Link to',
            })}{' '}
            {<a href={getObjectUrlForLink(primaryObject)}>{primaryObject.name}</a>}
          </div>
          {isMention && reviewData?.qualifiedPayoutToken && (
            <div className="check-review-modal__list-item">
              {getIcon(meetsWaivioTagReq)}
              Hashtag #waivio
            </div>
          )}
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
    qualifiedPayoutToken: PropTypes.bool,
    name: PropTypes.string,
    type: PropTypes.string,
    alias: PropTypes.string,
    guideName: PropTypes.string,
    requirements: PropTypes.shape({
      minPhotos: PropTypes.number,
      receiptPhoto: PropTypes.bool,
    }),
    requiredObject: PropTypes.shape().isRequired,
    secondaryObject: PropTypes.shape().isRequired,
  }),
  linkedObjects: PropTypes.arrayOf(PropTypes.shape()),
  tags: PropTypes.arrayOf(PropTypes.shape()),
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
