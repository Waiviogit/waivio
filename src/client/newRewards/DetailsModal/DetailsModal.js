import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getIsWaivio } from '../../../store/appStore/appSelectors';
// import { clearAllSessionProposition, getSessionData } from '../rewardsHelper';
import withAuthActions from '../../auth/withAuthActions';
import { clearAllSessionProposition } from '../../rewards/rewardsHelper';
import WebsiteReservedButtons from '../../rewards/Proposition/WebsiteReservedButtons/WebsiteReservedButtons';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import DetailsModalBody from './DetailsBody';
import { validateEgibilitiesForUser } from '../../../waivioApi/ApiClient';
import useRewards from '../../../hooks/useRewards';
import { changeRewardsTab } from '../../../store/authStore/authActions';
import RewardsHeader from '../reuseble/RewardsHeader';

// import './DetailsModal.less';

const DetailsModal = ({
  proposition,
  toggleModal,
  isModalDetailsOpen,
  reserveOnClickHandler,
  removeToggleFlag,
  onActionInitiated,
}) => {
  const location = useLocation();
  const { reserveProposition } = useRewards();
  const history = useHistory();
  const dispatch = useDispatch();
  const authorizedUserName = useSelector(getAuthenticatedUserName);
  const [requirements, setRequirements] = useState({});
  const [loading, setLoading] = useState(true);
  const isAuth = !!authorizedUserName;
  const isWidget = new URLSearchParams(history.location.search).get('display');
  const isReserved = new URLSearchParams(location.search).get('toReserved');
  const isWaivio = useSelector(getIsWaivio);
  const requiredObject = get(proposition.object, 'parent');
  const userName = useSelector(getAuthenticatedUserName);
  const isEligible = Object.values(requirements).every(req => req);

  useEffect(() => {
    validateEgibilitiesForUser({
      userName,
      activationPermlink: proposition?.activationPermlink,
    }).then(res => {
      setRequirements(res);
      setLoading(false);
    });
  }, [proposition?.activationPermlink, userName]);
  // const requiredObjectName = getObjectName(proposition?.object?.parent)
  // const userName = getSessionData('userName');

  // const proposedWobjName = getObjectName(proposition.object);

  const handleTypeReserveButton = () => (isAuth ? 'primary' : 'default');
  const handleClickReserve = () => {
    setLoading(true);

    reserveProposition(proposition, userName).then(() => {
      history.push('/rewards-new/reserved');
      setLoading(false);
      dispatch(changeRewardsTab(userName));
    });
  };
  const onClick = () => onActionInitiated(handleClickReserve);

  // const mainObjectPermLink = get(objectDetails, 'required_object.author_permlink');
  // const mainObject = `[${requiredObjectName}](${'mainObjectPermLink'})`;
  // const secondaryObject = `[${proposedWobjName}](${proposition.object.author_permlink})`;
  //
  // const urlConfig = {
  //   pathname: '/editor',
  //   search: `?object=${mainObject}&object=${secondaryObject}`,
  //   state: {
  //     mainObject,
  //     secondaryObject,
  //     // campaign: objectDetails._id,
  //   },
  // };
  //
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
        <RewardsHeader proposition={proposition} />
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
  reserveOnClickHandler: PropTypes.func.isRequired,
  removeToggleFlag: PropTypes.func,
  proposition: PropTypes.shape().isRequired,
  onActionInitiated: PropTypes.func.isRequired,
};

DetailsModal.defaultProps = {
  removeToggleFlag: () => {},
};
export default withRouter(injectIntl(withAuthActions(DetailsModal)));
