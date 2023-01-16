import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
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
import ReservedButtons from '../../rewards/Proposition/WebsiteReservedButtons/ReservedButtons';

import './Details.less';

const DetailsModal = ({ proposition, toggleModal, isModalDetailsOpen, onActionInitiated }) => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [requirements, setRequirements] = useState({
    canAssignByBudget: true,
    canAssignByCurrentDay: true,
    expertise: true,
    followers: true,
    frequency: true,
    notAssigned: true,
    notBlacklisted: true,
    posts: true,
    notGuide: true,
  });
  const [agreementObjects, setAgreementObjects] = useState([]);
  const isWidget = new URLSearchParams(history.location.search).get('display');
  const isReserved = new URLSearchParams(location.search).get('toReserved');
  const isWaivio = useSelector(getIsWaivio);
  const requiredObject = proposition?.requiredObject;
  const userName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    if (!proposition?.reserved) {
      validateEgibilitiesForUser({
        userName,
        activationPermlink: proposition?.activationPermlink,
      }).then(res => {
        setRequirements(res);
      });

      if (!isEmpty(proposition?.agreementObjects))
        getObjectsByIds({ authorPermlinks: proposition?.agreementObjects }).then(res =>
          setAgreementObjects(res.wobjects),
        );
    }
  }, [proposition?.activationPermlink, userName]);

  const handleClickReserve = () => {
    if (!proposition?.reserved) {
      dispatch(reserveProposition(proposition, userName))
        .then(() => {
          const mainObject = `[${getObjectName(requiredObject)}](${
            requiredObject?.author_permlink
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
        })
        .catch(e => {
          message.error(e.error_description);
        });
    } else {
      const mainObject = `[${getObjectName(requiredObject)}](${requiredObject?.author_permlink})`;

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
    <ReservedButtons
      handleReserve={onClick}
      handleReserveForPopover={() =>
        dispatch(reserveProposition(proposition, userName)).then(() => {
          toggleModal();

          return Promise.resolve();
        })
      }
    />
  ) : (
    <WebsiteReservedButtons
      reserved={proposition.reserved}
      dish={{ ...proposition, ...proposition?.object }}
      handleReserve={() => {
        toggleModal();

        return dispatch(reserveProposition(proposition, userName));
      }}
      onCloseDetails={toggleModal}
    />
  );

  const handleCancelModalBtn = value => {
    clearAllSessionProposition();
    if (!isWidget && isReserved) {
      history.push(`/object/${proposition.object.author_permlink}`);
    }

    return toggleModal(value);
  };

  return (
    <Modal
      title={<div className="DetailsModal__modal-title">We seek honest reviews!</div>}
      closable
      onCancel={handleCancelModalBtn}
      maskClosable={false}
      visible={!isWidget && isModalDetailsOpen}
      wrapClassName="DetailsModal"
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
      {!requirements.notGuide && (
        <div className="DetailsModal__message">You can&apos;t reserve your own campaing</div>
      )}
      <div className="DetailsModal__footer">
        <div className="DetailsModal__footer-reserve-btn">
          <Button onClick={handleCancelModalBtn}>Cancel</Button>
          {reserveButton}
        </div>
      </div>
    </Modal>
  );
};

DetailsModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  isModalDetailsOpen: PropTypes.bool.isRequired,
  proposition: PropTypes.shape().isRequired,
  onActionInitiated: PropTypes.func.isRequired,
};

DetailsModal.defaultProps = {
  removeToggleFlag: () => {},
};
export default withRouter(injectIntl(withAuthActions(DetailsModal)));
