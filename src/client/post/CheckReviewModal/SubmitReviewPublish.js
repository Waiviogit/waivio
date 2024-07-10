import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const SubmitReviewPublish = ({ intl, reviewData }) => {
  const authUserName = useSelector(getAuthenticatedUserName);

  return (
    <React.Fragment>
      <div className="check-review-modal__paragraph">
        <span>
          {intl.formatMessage({
            id: `check_review_agreement_part_1`,
            defaultMessage: 'This review meets all the technical requirements of',
          })}
        </span>
        &nbsp;
        {reviewData?.type === 'mentions' ? (
          intl.formatMessage({
            id: `mentions_lowercase`,
            defaultMessage: 'the mentions',
          })
        ) : (
          <a
            href={`/@${authUserName}/${reviewData.reservationPermlink}`}
            title={reviewData.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            {intl.formatMessage({
              id: `check_review_the_reservation`,
              defaultMessage: 'the reservation',
            })}
          </a>
        )}
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
          href={`/@${reviewData.guideName}`}
          title={reviewData.guideName}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{reviewData.guideName}
        </a>
        ).
      </div>
    </React.Fragment>
  );
};

SubmitReviewPublish.propTypes = {
  intl: PropTypes.shape().isRequired,
  reviewData: PropTypes.shape().isRequired,
};

export default injectIntl(SubmitReviewPublish);
