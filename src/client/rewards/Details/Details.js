import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import getDetailsMessages from './detailsMessagesData';
import CampaignCardHeader from '../CampaignCardHeader/CampaignCardHeader';
import DetailsBody from './DetailsBody';
import DetailsPostRequirments from './DetailsPostRequirments';
import { getObjectName } from '../../helpers/wObjectHelper';
import ModalSignIn from '../../components/Navigation/ModlaSignIn/ModalSignIn';

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
  isAuth,
}) => {
  const [isShowSignInModal, setIsShowSignInModal] = useState(false);
  const localizer = (id, defaultMessage, variablesData) =>
    intl.formatMessage({ id, defaultMessage }, variablesData);
  const messageData = getDetailsMessages(localizer, objectDetails);
  const isCamaignReserved =
    !(assigned !== null && !assigned) || loading || objectDetails.isReservedSiblingObj;

  const isExpired = objectDetails.status === 'expired';
  const isInActive = objectDetails.status === 'inactive';
  const proposedWobjName = getObjectName(proposedWobj);

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

  const handleTypeReserveButton = () => (isAuth ? 'primary' : 'default');

  const objName = getRequiredObjectName();
  const proposedWobjNewName = getProposedWobjName();
  const onClick = isAuth ? reserveOnClickHandler : () => setIsShowSignInModal(true);
  const disabled = (isAuth && !isEligible) || isInActive || isExpired;
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
      {isShowSignInModal && (
        <ModalSignIn
          hideLink
          isButton={false}
          showModal
          setIsShowSignInModal={setIsShowSignInModal}
        />
      )}
      <div className="Details__footer">
        <div className="Details__footer-reserve-btn">
          <Button onClick={toggleModal}>{messageData.cancel}</Button>
          {/* Button "Reserve" inside the reward card */}
          {!isReviewDetails ? (
            <Button
              type={handleTypeReserveButton()}
              loading={loading}
              disabled={disabled}
              onClick={onClick}
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
  isAuth: PropTypes.bool,
};

Details.defaultProps = {
  loading: false,
  assigned: false,
  isAuth: false,
};
export default injectIntl(Details);
