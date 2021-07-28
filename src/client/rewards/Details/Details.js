import React from 'react';
import { withRouter } from 'react-router-dom';
import { isEqual, get } from 'lodash';
import { Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import getDetailsMessages from './detailsMessagesData';
import CampaignCardHeader from '../CampaignCardHeader/CampaignCardHeader';
import DetailsBody from './DetailsBody';
import DetailsPostRequirments from './DetailsPostRequirments';
import { getObjectName } from '../../helpers/wObjectHelper';
import { clearAllSessionProposition, getSessionData } from '../rewardsHelper';
import withAuthActions from '../../auth/withAuthActions';

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
  history,
  authorizedUserName,
  removeToggleFlag,
  onActionInitiated,
}) => {
  const isWidget = new URLSearchParams(location.search).get('display');
  const isReserved = new URLSearchParams(location.search).get('toReserved');
  const userName = getSessionData('userName');
  const localizer = (id, defaultMessage, variablesData) =>
    intl.formatMessage({ id, defaultMessage }, variablesData);
  const messageData = getDetailsMessages(localizer, objectDetails);
  const isCamaignReserved =
    !(assigned !== null && !assigned) || loading || objectDetails.isReservedSiblingObj;

  const isExpired = objectDetails.status === 'expired';
  const isInActive = objectDetails.status === 'inactive';
  const proposedWobjName = getObjectName(proposedWobj);

  const handleTypeReserveButton = () => (isAuth ? 'primary' : 'default');

  const onClick = () => onActionInitiated(reserveOnClickHandler);
  const disabled = (isAuth && !isEligible) || isInActive || isExpired;

  const mainObjectPermLink = get(objectDetails, 'required_object.author_permlink');
  const mainObject = `[${requiredObjectName}](${mainObjectPermLink})`;
  const secondaryObject = `[${proposedWobjName}](${proposedWobj.author_permlink})`;

  const urlConfig = {
    pathname: '/editor',
    search: `?object=${mainObject}&object=${secondaryObject}&campaign=${objectDetails._id}`,
    state: {
      mainObject,
      secondaryObject,
      campaign: objectDetails._id,
    },
  };

  const toCurrentWobjLink = `/object/${proposedWobj.author_permlink}`;

  const handleWriteReviewBtn = () => {
    if (!isAuth) return;
    if (userName) {
      const historyUrl = isEqual(userName, authorizedUserName) ? urlConfig : toCurrentWobjLink;

      history.push(historyUrl);
      clearAllSessionProposition();

      return;
    }
    history.push(urlConfig);
  };

  const handleCancelModalBtn = value => {
    clearAllSessionProposition();
    if (!isWidget && isReserved) {
      removeToggleFlag();
      history.push(`/object/${proposedWobj.author_permlink}`);
    }

    return toggleModal(value);
  };

  return (
    <Modal
      title={<div className="Details__modal-title">{messageData.seekHonestReviews}!</div>}
      closable
      onCancel={handleCancelModalBtn}
      maskClosable={false}
      visible={!isWidget && isModalDetailsOpen}
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
          <Button onClick={handleCancelModalBtn}>{messageData.cancel}</Button>
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
            <Button type={handleTypeReserveButton()} onClick={handleWriteReviewBtn}>
              {intl.formatMessage({
                id: 'campaign_buttons_write_review',
                defaultMessage: `Write review`,
              })}
            </Button>
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
  history: PropTypes.shape().isRequired,
  authorizedUserName: PropTypes.string.isRequired,
  removeToggleFlag: PropTypes.func,
  onActionInitiated: PropTypes.func.isRequired,
};

Details.defaultProps = {
  loading: false,
  assigned: false,
  isAuth: false,
  removeToggleFlag: () => {},
};
export default withRouter(injectIntl(withAuthActions(Details)));
