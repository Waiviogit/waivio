import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import './CheckReviewModal.less';

const CheckReviewModal = ({
  intl,
  isCheckReviewModalOpen,
  isReviewValid,
  reviewData,
  onCancel,
}) => {
  const { campaign } = reviewData;
  const hideModal = () => console.log('--> hide modal');
  const modalBody = isReviewValid ? (
    <React.Fragment>
      <div className="check-review-modal__paragraph">
        <span>This review meets all the technical requirements of </span>
        <a
          href={`/rewards/reserved/${campaign.requiredObject}`}
          title={campaign.name}
          target="_blank"
          rel="noopener noreferrer"
        >
          the reservation
        </a>
        <span>
          &nbsp; and entitles you to specified rewards. The sponsor reserves the right to review all
          submissions manually before paying the rewards.
        </span>
      </div>
      <div className="check-review-modal__paragraph">
        In many jurisdictions, readers should be informed that the review has been partially
        sponsored. In order to meet these requirements, the following notice will be added to your
        post:
      </div>
      <div className="check-review-modal__paragraph">
        <hr />
      </div>
      <div className="check-review-modal__paragraph">
        <span>This review was sponsored in part by </span>
        <a
          href={`/@${campaign.guideName}`}
          title={campaign.guideName}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{campaign.guideName}
        </a>
      </div>
      <div className="check-review-modal__buttons">
        <Button htmlType="button" onClick={() => console.log('Submit >')} size="large">
          {intl.formatMessage({ id: 'submit', defaultMessage: 'Submit[hc]' })}
        </Button>
        <Button htmlType="button" onClick={hideModal} size="large">
          {intl.formatMessage({ id: 'edit', defaultMessage: 'Edit[hc]' })}
        </Button>
      </div>
    </React.Fragment>
  ) : (
    <React.Fragment>Review is not Valid</React.Fragment>
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
  isCheckReviewModalOpen: PropTypes.bool,
  isReviewValid: PropTypes.bool,
  reviewData: PropTypes.shape({
    reviewer: PropTypes.shape(),
    campaign: PropTypes.shape(),
  }),
  onCancel: PropTypes.func.isRequired,
};

CheckReviewModal.defaultProps = {
  isCheckReviewModalOpen: false,
  isReviewValid: false,
  reviewData: null,
};

export default CheckReviewModal;
