import React from 'react';
import PropTypes from 'prop-types';
import { get, memoize } from 'lodash';
import { Button, Icon, Modal } from 'antd';
import {Link} from "react-router-dom";
import './CheckReviewModal.less';

const getReviewRequirements = memoize((campaign, authorName) => ({
  postRequirements: {
    minPhotos: get(campaign, ['requirements', 'minPhotos'], 0),
    secondaryObject: campaign.requiredObject,
    primaryObject: get(
      campaign.users.find(user => user.status === 'assigned' && user.name === authorName),
      'object_permlink',
      '',
    ),
  },
  authorRequirements: {
    minExpertise: get(campaign, ['userRequirements', 'minExpertise'], 0), // todo: check backend key
    minFollowers: get(campaign, ['userRequirements', 'minFollowers'], 0),
    minPosts: get(campaign, ['userRequirements', 'minPosts'], 0),
  },
}));

const getIcon = isValidOption =>
  isValidOption ? (
    <Icon type="check-square" style={{ color: '#30b580' }} />
  ) : (
    <Icon type="close-square" style={{ color: '#d9534f' }} />
  );

const CheckReviewModal = ({
  intl,
  postBody,
  isCheckReviewModalOpen,
  reviewData: { campaign, reviewer },
  linkedObjects,
  onCancel,
  onEdit,
  onSubmit,
}) => {
  const { postRequirements } = getReviewRequirements(campaign, reviewer.name);
  const secondaryObject = linkedObjects.find(obj => obj.id === postRequirements.secondaryObject);
  const primaryObject = linkedObjects.find(obj => obj.id === postRequirements.primaryObject);
  const hasMinPhotos =
    (postBody.match(/(?:!\[(.*?)\]\((.*?)\))/gi) || []).length >= postRequirements.minPhotos;
  const modalBody =
    hasMinPhotos && secondaryObject && primaryObject ? (
      <React.Fragment>
        <div className="check-review-modal__paragraph">
          <span>
            {intl.formatMessage({
              id: `check_review_agreement_part_1`,
              defaultMessage: 'This review meets all the technical requirements of',
            })}
          </span>
          &nbsp;
          <a
            href={`/rewards/reserved/${campaign.requiredObject}`}
            title={campaign.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            {intl.formatMessage({
              id: `check_review_the_reservation`,
              defaultMessage: 'the reservation',
            })}
          </a>
          &nbsp;
          <span>
            {intl.formatMessage({
              id: `check_review_agreement_part_2`,
              defaultMessage:
                'and entitles you to specified rewards. The sponsor reserves the right to review all submissions manually before paying the rewards.',
            })}
          </span>
        </div>
        <div className="check-review-modal__paragraph">
          {intl.formatMessage({
            id: `check_review_agreement_part_3`,
            defaultMessage:
              'In many jurisdictions, readers should be informed that the review has been partially sponsored. In order to meet these requirements, the following notice will be added to your post:',
          })}
        </div>
        <div className="check-review-modal__paragraph">
          <hr />
        </div>
        <div className="check-review-modal__paragraph">
          <span>
            {intl.formatMessage({
              id: `check_review_post_add_text`,
              defaultMessage: 'This review was sponsored in part by',
            })}
          </span>
          &nbsp;
          {campaign.alias}
          &nbsp; (
          <a
            href={`/@${campaign.guideName}`}
            title={campaign.guideName}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{campaign.guideName}
          </a>
          ).
        </div>
        <div className="check-review-modal__buttons">
          <Button htmlType="button" onClick={onCancel} size="large">
            {intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
          </Button>
          <Button htmlType="button" type="primary" onClick={onSubmit} size="large">
            {intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}
          </Button>
        </div>
      </React.Fragment>
    ) : (
      <React.Fragment>
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
                secondaryObjectName: postRequirements.secondaryObject,
              },
            )}
          </div>
          <div className="check-review-modal__list-item">
            {getIcon(Boolean(secondaryObject && secondaryObject.id))}
            {intl.formatMessage(
              {
                id: `check_review_secondaryObject_link`,
                defaultMessage: 'Link to ',
              }
            )}
            <Link className="ml1" to={`/object/${postRequirements.secondaryObject}`}>
              {postRequirements.secondaryObject}
            </Link>
              :
            <Link
              to={`/object/${postRequirements.secondaryObject}`}
            >{` www.waivio.com/object/${postRequirements.secondaryObject}`}</Link>
            ;
          </div>
          <div className="check-review-modal__list-item">
            {getIcon(Boolean(primaryObject && primaryObject.id))}
            {intl.formatMessage(
              {
                id: `check_review_primaryObject_link`,
                defaultMessage: 'Link to ',
              }
            )}
            <Link className="ml1" to={`/object/${postRequirements.primaryObject}`}>
              {postRequirements.primaryObject}
            </Link>
              :
            <Link
              to={`/object/${postRequirements.primaryObject}`}
            >{` www.waivio.com/object/${postRequirements.primaryObject}`}</Link>
             ;
          </div>
        </div>
        <div className="check-review-modal__buttons">
          <Button htmlType="button" type='primary' onClick={onEdit} size="large">
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
    reviewer: PropTypes.shape(),
    campaign: PropTypes.shape(),
  }),
  linkedObjects: PropTypes.arrayOf(PropTypes.shape()),
  onCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

CheckReviewModal.defaultProps = {
  isCheckReviewModalOpen: false,
  isReviewValid: false,
  reviewData: null,
  linkedObjects: [],
};

export default CheckReviewModal;
