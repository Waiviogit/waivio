import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import getDetailsMessages from './detailsMessagesData';
import './Details.less';

const DetailsBody = ({ objectDetails, intl }) => {
  const localizer = (id, defaultMessage, variablesData) =>
    intl.formatMessage({ id, defaultMessage }, variablesData);
  const messageData = getDetailsMessages(localizer, objectDetails);
  return (
    <React.Fragment>
      <div className="Details__text fw6 mv3">{messageData.reward}:</div>
      <span>
        {messageData.amountRewardDetermined}(
        <Link to={`/object/${objectDetails.guide.name}`}>{objectDetails.guide.name}</Link>
        {!isEmpty(objectDetails.match_bots) &&
          objectDetails.match_bots.map(bot => (
            <React.Fragment>
              ,
              <Link className="ml1" to={`/object/${bot}`}>
                {`www.waivio.com/object/${bot}`}
              </Link>
            </React.Fragment>
          ))}
        ){messageData.countTowardsPaymentRewards}
      </span>

      <div className="Details__text fw6 mv3">{messageData.legal}:</div>
      <span>
        {messageData.makingReservation}
        <Link className="ml1" to="/object/xrj-terms-and-conditions/page">
          {messageData.legalTermsAndConditions}
        </Link>
        {!isEmpty(objectDetails.agreementObjects) && ` ${messageData.includingTheFollowing}`}
        {!isEmpty(objectDetails.agreementObjects) &&
          objectDetails.agreementObjects.map(obj => (
            <Link className="ml1" to={`/object/${obj}/page`}>
              {obj}
            </Link>
          ))}
      </span>
      {objectDetails.usersLegalNotice && (
        <div>
          <div className="Details__text fw6 mv3">{messageData.usersLegalNotice}:</div>
          <span>{objectDetails.usersLegalNotice}</span>
        </div>
      )}
    </React.Fragment>
  );
};

DetailsBody.propTypes = {
  intl: PropTypes.shape().isRequired,
  objectDetails: PropTypes.shape().isRequired,
};

export default injectIntl(DetailsBody);
