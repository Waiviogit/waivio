import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import getDetailsMessages from './detailsMessagesData';
import { getObjectName } from '../../helpers/wObjectHelper';
import './Details.less';

const DetailsPostRequirments = ({ objectDetails, intl, proposedWobj, requiredObjectName }) => {
  const localizer = (id, defaultMessage, variablesData) =>
    intl.formatMessage({ id, defaultMessage }, variablesData);
  const messageData = getDetailsMessages(localizer, objectDetails);
  const proposedWobjName = getObjectName(proposedWobj);
  const receiptPhoto = get(objectDetails, ['requirements', 'receiptPhoto']);
  const requiredObject = get(objectDetails, ['requiredObject']);
  const description = get(objectDetails, ['description']);
  let indexItem = 1;

  return (
    <React.Fragment>
      <div className="Details__text fw6 mv3">{messageData.postRequirements}:</div>
      <div className="Details__text mv3">{messageData.reviewEligibleAward}</div>
      <div className="Details__criteria-wrap">
        <div className="Details__criteria-row Details__criteria-row--mobile">
          {/* eslint-disable-next-line no-plusplus */}
          {`${indexItem++}. ${messageData.minimumOriginalPhotos} `}
          <Link
            className="ml1 Details__container"
            to={`/object/${proposedWobj.id || proposedWobj.author_permlink}`}
          >
            {proposedWobjName || proposedWobj.name}
          </Link>
        </div>
        {receiptPhoto && (
          /* eslint-disable-next-line no-plusplus */
          <div className="Details__criteria-row">{`${indexItem++}. ${
            messageData.photoReceipt
          }`}</div>
        )}
        <div className="Details__criteria-row ">
          {/* eslint-disable-next-line no-plusplus */}
          {`${indexItem++}. ${messageData.linkTo}`}
          <Link className="ml1 Details__container" to={`/object/${proposedWobj.author_permlink}`}>
            {proposedWobjName || proposedWobj.name}
          </Link>
        </div>
        <div className="Details__criteria-row ">
          {/* eslint-disable-next-line no-plusplus */}
          {`${indexItem++}. ${messageData.linkTo}`}
          <Link className="ml1 Details__container" to={`/object/${requiredObject}`}>
            {requiredObjectName}
          </Link>
        </div>
        <div className="Details__criteria-row">
          {description &&
            /* eslint-disable-next-line no-plusplus */
            `${indexItem++}. ${messageData.additionalRequirements}: ${description}`}
        </div>
      </div>
      <div className="Details__text mv3">{messageData.sponsorReservesPayment}</div>
    </React.Fragment>
  );
};

DetailsPostRequirments.propTypes = {
  intl: PropTypes.shape().isRequired,
  objectDetails: PropTypes.shape().isRequired,
  proposedWobj: PropTypes.shape().isRequired,
  requiredObjectName: PropTypes.string.isRequired,
};

export default injectIntl(DetailsPostRequirments);
