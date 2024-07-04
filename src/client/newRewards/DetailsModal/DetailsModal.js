import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getIsSocial, getIsWaivio, getUsedLocale } from '../../../store/appStore/appSelectors';
import withAuthActions from '../../auth/withAuthActions';
import { clearAllSessionProposition } from '../../rewards/rewardsHelper';
import WebsiteReservedButtons from '../../rewards/Proposition/WebsiteReservedButtons/WebsiteReservedButtons';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import DetailsModalBody from './DetailsBody';
import {
  getObjectInfo,
  getObjectsByIds,
  validateEgibilitiesForUser,
} from '../../../waivioApi/ApiClient';
import RewardsHeader from '../reuseble/RewardsHeader';
import { reserveProposition } from '../../../store/newRewards/newRewardsActions';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import ReservedButtons from '../../rewards/Proposition/WebsiteReservedButtons/ReservedButtons';

import './Details.less';

const DetailsModal = ({
  proposition,
  toggleModal,
  isModalDetailsOpen,
  onActionInitiated,
  intl,
}) => {
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
  });
  const [agreementObjects, setAgreementObjects] = useState([]);
  const [requiredObject, setRequiredObject] = useState({});
  const isWidget = new URLSearchParams(history.location.search).get('display');
  const isReserved = new URLSearchParams(location.search).get('toReserved');
  const isWaivio = useSelector(getIsWaivio);
  const isSocial = useSelector(getIsSocial);
  const locale = useSelector(getUsedLocale);
  const stringRequiredObj =
    typeof proposition.requiredObject === 'string' && !isEmpty(proposition.requiredObject);
  const userName = useSelector(getAuthenticatedUserName);
  const disable = Object.values(requirements).some(requirement => !requirement);
  const withoutSecondary = requiredObject.author_permlink
    ? requiredObject.author_permlink === proposition?.object?.author_permlink
    : requiredObject.name === proposition?.objects?.replace('@', '');

  useEffect(() => {
    if (stringRequiredObj) {
      getObjectInfo([proposition?.requiredObject], locale).then(res =>
        setRequiredObject(res.wobjects[0]),
      );
    } else {
      setRequiredObject(proposition.requiredObject);
    }
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

  const handleClickReserve = cb => {
    let search = requiredObject?.author_permlink
      ? `?object=[${getObjectName(requiredObject)}](${requiredObject?.author_permlink})`
      : `?user=[${requiredObject?.name}](@${requiredObject?.name})`;

    if (!withoutSecondary) {
      search += proposition?.object?.author_permlink
        ? `&object=[${getObjectName(proposition.object)}](${proposition?.object?.author_permlink})`
        : `&user=[${proposition?.objects.replace('@', '')}](${proposition?.objects})`;
    }

    search += `&campaign=${proposition._id}`;

    if (!proposition?.reserved && proposition?.type !== 'mentions') {
      return dispatch(reserveProposition(proposition, userName))
        .then(() => {
          const urlConfig = {
            pathname: '/editor',
            search,
          };

          history.push(urlConfig);
        })
        .catch(e => {
          console.error(e);
          if (cb) cb(false);
        });
    }
    const urlConfig = {
      pathname: '/editor',
      search,
    };

    return history.push(urlConfig);
  };
  const onClick = cb => onActionInitiated(() => handleClickReserve(cb));

  const reserveButton =
    isWaivio || isSocial ? (
      <ReservedButtons
        reserved={proposition.reserved}
        handleReserve={onClick}
        disable={disable}
        reservedDays={proposition?.countReservationDays}
        type={proposition?.type}
        handleReserveForPopover={() =>
          dispatch(reserveProposition(proposition, userName)).then(res => {
            if (!res.value.error) toggleModal();

            return Promise.resolve();
          })
        }
      />
    ) : (
      <WebsiteReservedButtons
        reserved={proposition.reserved}
        dish={{ ...proposition, ...proposition?.object }}
        disable={disable}
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
      title={
        <div className="DetailsModal__modal-title">
          {intl.formatMessage({
            id: 'we_seek_honest_reviews',
            defaultMessage: 'We seek honest reviews!',
          })}
        </div>
      }
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
        proposition={{ ...proposition, requiredObject }}
        requirements={requirements}
        agreementObjects={agreementObjects}
        withoutSecondary={withoutSecondary}
      />
      <div className="DetailsModal__footer">
        <div className="DetailsModal__footer-reserve-btn">
          <Button className="DetailsModal__cancel" onClick={handleCancelModalBtn}>
            {intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
          </Button>
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
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

DetailsModal.defaultProps = {
  removeToggleFlag: () => {},
};
export default withRouter(injectIntl(withAuthActions(DetailsModal)));
