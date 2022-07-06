import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getIsWaivio } from '../../../store/appStore/appSelectors';
// import WebsiteReservedButtons from '../Proposition/WebsiteReservedButtons/WebsiteReservedButtons';
// import getDetailsMessages from './detailsMessagesData';
// import CampaignCardHeader from '../CampaignCardHeader/CampaignCardHeader';
// import DetailsBody from './DetailsBody';
// import DetailsPostRequirments from './DetailsPostRequirments';
// import { clearAllSessionProposition, getSessionData } from '../rewardsHelper';
import withAuthActions from '../../auth/withAuthActions';
import { clearAllSessionProposition } from '../../rewards/rewardsHelper';
import WebsiteReservedButtons from '../../rewards/Proposition/WebsiteReservedButtons/WebsiteReservedButtons';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import DetailsModalBody from './DetailsBody';
import { validateEgibilitiesForUser } from '../../../waivioApi/ApiClient';

// import './DetailsModal.less';

const DetailsModal = ({
  proposition,
  toggleModal,
  isModalDetailsOpen,
  loading,
  reserveOnClickHandler,
  history,
  removeToggleFlag,
  onActionInitiated,
}) => {
  const location = useLocation();
  const authorizedUserName = useSelector(getAuthenticatedUserName);
  const isAuth = !!authorizedUserName;
  const isWidget = new URLSearchParams(history.location.search).get('display');
  const isReserved = new URLSearchParams(location.search).get('toReserved');
  const isWaivio = useSelector(getIsWaivio);
  const requiredObject = get(proposition.object, 'parent');
  const userName = useSelector(getAuthenticatedUserName);
  const [requirements, setRequirements] = useState({});
  const isEligible = Object.values(requirements).every(req => req);

  useEffect(() => {
    validateEgibilitiesForUser({
      userName,
      activationPermlink: proposition?.activationPermlink,
    }).then(res => {
      setRequirements(res);
    });
  }, [proposition?.activationPermlink, userName]);
  // const requiredObjectName = getObjectName(proposition?.object?.parent)
  // const userName = getSessionData('userName');

  // const isExpired = objectDetails.status === 'expired';
  // const isInActive = objectDetails.status === 'inactive';
  // const proposedWobjName = getObjectName(proposition.object);

  const handleTypeReserveButton = () => (isAuth ? 'primary' : 'default');

  const onClick = () => onActionInitiated(reserveOnClickHandler);
  // const disabled = (isAuth && !isEligible) || isInActive || isExpired;

  // const mainObjectPermLink = get(objectDetails, 'required_object.author_permlink');
  // const mainObject = `[${requiredObjectName}](${'mainObjectPermLink'})`;
  // const secondaryObject = `[${proposedWobjName}](${proposition.object.author_permlink})`;

  // const urlConfig = {
  //   pathname: '/editor',
  //   search: `?object=${mainObject}&object=${secondaryObject}`,
  //   state: {
  //     mainObject,
  //     secondaryObject,
  //     // campaign: objectDetails._id,
  //   },
  // };

  // const toCurrentWobjLink = `/object/${proposition.object.author_permlink}`;
  const reserveButton = isWaivio ? (
    <Button
      type={handleTypeReserveButton()}
      loading={loading}
      disabled={!isEligible}
      onClick={onClick}
    >
      Reserve
    </Button>
  ) : (
    <WebsiteReservedButtons
      dish={proposition?.object}
      restaurant={requiredObject}
      handleReserve={reserveOnClickHandler}
    />
  );

  // const handleWriteReviewBtn = () => {
  //   if (!isAuth) return;
  //   if (userName) {
  //     const historyUrl = isEqual(userName, authorizedUserName) ? urlConfig : toCurrentWobjLink;
  //
  //     history.push(historyUrl);
  //     clearAllSessionProposition();
  //
  //     return;
  //   }
  //   history.push(urlConfig);
  // };

  const handleCancelModalBtn = value => {
    clearAllSessionProposition();
    if (!isWidget && isReserved) {
      removeToggleFlag();
      history.push(`/object/${proposition.object.author_permlink}`);
    }

    return toggleModal(value);
  };

  return (
    <Modal
      title={<div className="Details__modal-title">We seek honest reviews!</div>}
      closable
      onCancel={handleCancelModalBtn}
      maskClosable={false}
      visible={!isWidget && isModalDetailsOpen}
      wrapClassName="Details"
      footer={null}
      width={768}
    >
      <div>
        <p className="Proposition-new__title">
          Share {proposition?.requirements?.minPhotos} photos of the dish and earn crypto
        </p>
        <div className="Proposition-new__sponsorInfo">
          <div className="Proposition-new__infoItem Proposition-new__infoItem--right">
            <Link to={`/@${proposition?.guideName}`}>Waivio Service (Sponsor)</Link>
            <Link to={`/@${proposition?.guideName}`}>@{proposition?.guideName}</Link>
          </div>
          <div className="Proposition-new__infoItem Proposition-new__infoItem--left">
            <span>Total paid (liquid):</span>
            <span>
              {proposition?.totalPayed || 0} {proposition?.payoutToken}
            </span>
          </div>
        </div>
      </div>
      <DetailsModalBody proposition={proposition} requirements={requirements} />
      <div className="Details__footer">
        <div className="Details__footer-reserve-btn">
          <Button onClick={handleCancelModalBtn}>Cancel</Button>
          {reserveButton}
          {proposition?.countReservationDays &&
            isWaivio &&
            `for ${proposition?.countReservationDays} days`}
        </div>
      </div>
    </Modal>
  );
};

DetailsModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  isModalDetailsOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  reserveOnClickHandler: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  removeToggleFlag: PropTypes.func,
  proposition: PropTypes.shape().isRequired,
  onActionInitiated: PropTypes.func.isRequired,
};

DetailsModal.defaultProps = {
  loading: false,
  assigned: false,
  isAuth: false,
  removeToggleFlag: () => {},
};
export default withRouter(injectIntl(withAuthActions(DetailsModal)));
