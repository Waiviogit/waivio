import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import getDetailsMessages from './detailsMessagesData';
import CampaignCardHeader from '../CampaignCardHeader/CampaignCardHeader';
import DetailsBody from './DetailsBody';
import DetailsPostRequirments from './DetailsPostRequirments';
import './Details.less';

const Details = ({
  intl,
  objectDetails,
  toggleModal,
  isModalDetailsOpen,
  loading,
  reserveOnClickHandler,
  assigned,
  proposedWobj,
  isReviewDetails,
  requiredObjectName,
  isEligible,
}) => {
  const localizer = (id, defaultMessage, variablesData) =>
    intl.formatMessage({ id, defaultMessage }, variablesData);
  const messageData = getDetailsMessages(localizer, objectDetails);
  const isCamaignReserved =
    !(assigned !== null && !assigned) || loading || objectDetails.isReservedSiblingObj;

  const isExpired = objectDetails.status === 'expired';
  const isInActive = objectDetails.status === 'inactive';
  const proposedWobjName = proposedWobj.name;

  const getRequiredObjectName = () => {
    let result;
    if (requiredObjectName.includes('&')) {
      result = requiredObjectName.replace('&', '%26');
    } else {
      result = requiredObjectName;
    }
    return result;
  };

  const getProposedWobjName = () => {
    let result;
    if (proposedWobjName && proposedWobjName.toString().includes('&')) {
      result = proposedWobjName.replace('&', '%26');
    } else {
      result = proposedWobjName;
    }
    return result;
  };

  const objName = getRequiredObjectName();
  const proposedWobjNewName = getProposedWobjName();

  return (
    <Modal
      title={<div className="Details__modal-title">{messageData.seekHonestReviews}!</div>}
      closable
      onCancel={toggleModal}
      maskClosable={false}
      visible={isModalDetailsOpen}
      wrapClassName="Details"
      footer={null}
      width={768}
    >
      <CampaignCardHeader campaignData={objectDetails} />
      {!isReviewDetails ? (
        <DetailsBody
          objectDetails={objectDetails}
          intl={intl}
          proposedWobj={proposedWobj}
          requiredObjectName={requiredObjectName}
        />
      ) : (
        <DetailsPostRequirments
          proposedWobj={proposedWobj}
          requiredObjectName={requiredObjectName}
          intl={intl}
          objectDetails={objectDetails}
        />
      )}
      <div className="Details__footer">
        <div className="Details__footer-reserve-btn">
          <Button onClick={toggleModal}>{messageData.cancel}</Button>
          {!isReviewDetails ? (
            <Button
              type="primary"
              loading={loading}
              disabled={!isEligible || isInActive || isExpired}
              onClick={reserveOnClickHandler}
            >
              {!isCamaignReserved ? messageData.reserve : messageData.reserved}
            </Button>
          ) : (
            <Link
              // eslint-disable-next-line no-underscore-dangle
              to={`/editor?object=[${objName}](${objectDetails.required_object.author_permlink})&object=[${proposedWobjNewName}](${proposedWobj.author_permlink})&campaign=${objectDetails._id}`}
            >
              <Button type="primary">
                {intl.formatMessage({
                  id: 'campaign_buttons_write_review',
                  defaultMessage: `Write review`,
                })}
              </Button>
            </Link>
          )}
          {objectDetails.count_reservation_days &&
            `${messageData.forDays} ${objectDetails.count_reservation_days} ${messageData.days}`}
        </div>
      </div>
    </Modal>
  );
};

Details.propTypes = {
  intl: PropTypes.shape().isRequired,
  objectDetails: PropTypes.shape().isRequired,
  toggleModal: PropTypes.func.isRequired,
  isModalDetailsOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  reserveOnClickHandler: PropTypes.func.isRequired,
  assigned: PropTypes.bool,
  isReviewDetails: PropTypes.bool.isRequired,
  requiredObjectName: PropTypes.string.isRequired,
  proposedWobj: PropTypes.shape().isRequired,
  isEligible: PropTypes.bool.isRequired,
};

Details.defaultProps = {
  loading: false,
  assigned: false,
};
export default injectIntl(Details);
