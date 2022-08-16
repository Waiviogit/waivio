import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import { Button, message, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getIsWaivio } from '../../../store/appStore/appSelectors';

import withAuthActions from '../../auth/withAuthActions';
import { clearAllSessionProposition } from '../../rewards/rewardsHelper';
import WebsiteReservedButtons from '../../rewards/Proposition/WebsiteReservedButtons/WebsiteReservedButtons';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import DetailsModalBody from './DetailsBody';
import { getObjectsByIds, validateEgibilitiesForUser } from '../../../waivioApi/ApiClient';
import RewardsHeader from '../reuseble/RewardsHeader';
import { reserveProposition } from '../../../store/newRewards/newRewardsActions';
import { getObjectName } from '../../../common/helpers/wObjectHelper';

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
  const history = useHistory();
  const dispatch = useDispatch();
  const authorizedUserName = useSelector(getAuthenticatedUserName);
  const [requirements, setRequirements] = useState({
    canAssignByBudget: true,
    canAssignByCurrentDay: true,
    expertise: true,
    followers: true,
    frequency: true,
    notAssigned: true,
    notBlacklisted: true,
    posts: true,
  });
  const [loading, setLoading] = useState(false);
  const [agreementObjects, setAgreementObjects] = useState([]);
  const isAuth = !!authorizedUserName;
  const isWidget = new URLSearchParams(history.location.search).get('display');
  const isReserved = new URLSearchParams(location.search).get('toReserved');
  const isWaivio = useSelector(getIsWaivio);
  const requiredObject = get(proposition.object, 'parent');
  const userName = useSelector(getAuthenticatedUserName);
  const isEligible = Object.values(requirements).every(req => req);

  useEffect(() => {
    if (!proposition?.reserved) {
      setLoading(true);
      validateEgibilitiesForUser({
        userName,
        activationPermlink: proposition?.activationPermlink,
      }).then(res => {
        setRequirements(res);
        setLoading(false);
      });

      if (!isEmpty(proposition?.agreementObjects))
        getObjectsByIds({ authorPermlinks: proposition?.agreementObjects }).then(res =>
          setAgreementObjects(res.wobjects),
        );
    }
  }, [proposition?.activationPermlink, userName]);
  // const requiredObjectName = getObjectName(proposition?.object?.parent)
  // const userName = getSessionData('userName');

  // const proposedWobjName = getObjectName(proposition.object);

  const handleTypeReserveButton = () => (isAuth ? 'primary' : 'default');
  const handleClickReserve = () => {
    if (!proposition?.reserved) {
      setLoading(true);

      dispatch(reserveProposition(proposition, userName, history))
        .then(() => {
          setLoading(false);
        })
        .catch(e => {
          setLoading(false);
          message.error(e.error_description);
        });
    } else {
      const mainObject = `[${getObjectName(proposition.requiredObject)}](${
        proposition?.requiredObject?.author_permlink
      })`;
      const secondaryObject = `[${getObjectName(proposition.object)}](${
        proposition?.object?.author_permlink
      })`;
      const urlConfig = {
        pathname: '/editor',
        search: `?object=${mainObject}&object=${secondaryObject}&newCampaing=true&campaign=${proposition._id}`,
        state: {
          mainObject,
          secondaryObject,
          campaign: proposition._id,
        },
      };

      history.push(urlConfig);
    }
  };
  const onClick = () => onActionInitiated(handleClickReserve);

  const reserveButton = isWaivio ? (
    <Button
      type={handleTypeReserveButton()}
      loading={loading}
      disabled={!isEligible}
      onClick={onClick}
    >
      {proposition.reserved ? 'Write rewiew' : 'Reserve'}
    </Button>
  ) : (
    <WebsiteReservedButtons
      dish={proposition?.object}
      restaurant={requiredObject}
      handleReserve={reserveOnClickHandler}
    />
  );

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
      <DetailsModalBody
        proposition={proposition}
        requirements={requirements}
        agreementObjects={agreementObjects}
      />
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
