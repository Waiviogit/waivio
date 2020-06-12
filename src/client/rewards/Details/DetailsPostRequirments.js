import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import getDetailsMessages from './detailsMessagesData';
import './Details.less';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';

const DetailsPostRequirments = ({ objectDetails, intl, proposedWobj, requiredObjectName }) => {
  const localizer = (id, defaultMessage, variablesData) =>
    intl.formatMessage({ id, defaultMessage }, variablesData);
  const messageData = getDetailsMessages(localizer, objectDetails);
  const proposedWobjName = getFieldWithMaxWeight(proposedWobj, 'name');
  let indexItem = 1;
  return (
    <React.Fragment>
      <div className="Details__text fw6 mv3">{messageData.postRequirements}:</div>
      <div className="Details__text mv3">{messageData.reviewEligibleAward}</div>
      <div className="Details__criteria-wrap">
        <div className="Details__criteria-row Details__criteria-row--mobile">
          {/* eslint-disable-next-line no-plusplus */}
          {`${indexItem++}. ${messageData.minimumOriginalPhotos} `}
          <Link className="ml1" to={`/object/${proposedWobj.id}`}>
            {proposedWobjName || proposedWobj.name}
          </Link>
          ;
        </div>
        {objectDetails.requirements.receiptPhoto && (
          /* eslint-disable-next-line no-plusplus */
          <div className="Details__criteria-row">{`${indexItem++}. ${
            messageData.photoReceipt
          }`}</div>
        )}
        <div className="Details__criteria-row nowrap">
          {/* eslint-disable-next-line no-plusplus */}
          {`${indexItem++}. ${messageData.linkTo}`}
          <Link className="ml1" to={`/object/${proposedWobj.author_permlink}`}>
            {proposedWobjName || proposedWobj.name}
          </Link>
          ;
        </div>
        <div className="Details__criteria-row nowrap">
          {/* eslint-disable-next-line no-plusplus */}
          {`${indexItem++}. ${messageData.linkTo}`}
          <Link className="ml1" to={`/object/${objectDetails.requiredObject}`}>
            {requiredObjectName}
          </Link>
          ;
        </div>
        <div className="Details__criteria-row">
          {objectDetails.description &&
            /* eslint-disable-next-line no-plusplus */
            `${indexItem++}. ${messageData.additionalRequirements}: ${objectDetails.description}`}
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
