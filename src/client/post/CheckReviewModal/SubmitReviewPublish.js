import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const SubmitReviewPublish = ({ intl, reviewData, primaryObject }) => (
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
        href={`/rewards/reserved/${primaryObject.author_permlink}`}
        title={reviewData.name}
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
      {reviewData.alias}
      &nbsp; (
      <a
        href={`/@${reviewData.name}`}
        title={reviewData.name}
        target="_blank"
        rel="noopener noreferrer"
      >
        @{reviewData.name}
      </a>
      ).
    </div>
  </React.Fragment>
);

SubmitReviewPublish.propTypes = {
  intl: PropTypes.shape().isRequired,
  primaryObject: PropTypes.shape().isRequired,
  reviewData: PropTypes.shape().isRequired,
};

export default injectIntl(SubmitReviewPublish);
