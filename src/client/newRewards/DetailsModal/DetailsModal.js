import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty, isArray, has } from 'lodash';
import { Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTemplateId } from '../../../designTemplates/TemplateProvider';
import { getIsSocial, getIsWaivio, getUsedLocale } from '../../../store/appStore/appSelectors';
import { getRequiredObject } from '../../../store/newRewards/newRewardsSelectors';
import {
  setActivationPermlink,
  reserveProposition,
} from '../../../store/newRewards/newRewardsActions';
import withAuthActions from '../../auth/withAuthActions';
import { clearAllSessionProposition, campaignTypes } from '../../rewards/rewardsHelper';
import WebsiteReservedButtons from '../../rewards/Proposition/WebsiteReservedButtons/WebsiteReservedButtons';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import DetailsModalBody from './DetailsBody';
import {
  getObjectInfo,
  getObjectsByIds,
  getUserAccount,
  validateEgibilitiesForUser,
} from '../../../waivioApi/ApiClient';
import RewardsHeader from '../reuseble/RewardsHeader';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import ReservedButtons from '../../rewards/Proposition/WebsiteReservedButtons/ReservedButtons';
import { getObjectUrl } from '../../../common/helpers/postHelpers';

import './Details.less';

const DetailsModal = ({
  proposition,
  toggleModal,
  isModalDetailsOpen,
  onActionInitiated,
  intl,
  isJudges = false,
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
  const [object, setObject] = useState(proposition?.object || {});
  const isWidget = new URLSearchParams(history.location.search).get('display');
  const isReserved = new URLSearchParams(location.search).get('toReserved');
  const isWaivio = useSelector(getIsWaivio);
  const isSocial = useSelector(getIsSocial);
  const locale = useSelector(getUsedLocale);
  const reduxRequiredObject = useSelector(getRequiredObject);
  const template = useTemplateId();

  const stringRequiredObj =
    typeof proposition.requiredObject === 'string' && !isEmpty(proposition.requiredObject);
  const userName = useSelector(getAuthenticatedUserName);
  const disable = Object.values(requirements).some(requirement => !requirement);
  const objects = isArray(proposition?.objects) ? proposition?.objects[0] : proposition?.objects;
  const withoutSecondary = requiredObject?.author_permlink
    ? requiredObject?.author_permlink === proposition?.object?.author_permlink ||
      requiredObject?.author_permlink === object?.author_permlink
    : requiredObject?.name === objects?.replace('@', '');

  useEffect(() => {
    if (!has(proposition, 'object')) {
      getObjectInfo([objects], locale).then(res => setObject(res.wobjects[0]));
    }
    if (stringRequiredObj) {
      if (proposition?.requiredObject?.includes('@')) {
        getUserAccount(proposition?.requiredObject?.replace('@', '')).then(res => {
          setRequiredObject(res);
        });
      } else {
        getObjectInfo([proposition?.requiredObject], locale).then(res => {
          setRequiredObject(res.wobjects[0]);
        });
      }
    } else {
      setRequiredObject(proposition.requiredObject || proposition.object);
    }

    if (!proposition?.reserved && !isJudges) {
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
    const authorPermlink =
      reduxRequiredObject ||
      requiredObject?.author_permlink ||
      proposition?.requiredObject?.author_permlink;

    if (!authorPermlink) {
      if (cb) cb(false);

      return;
    }

    let search = requiredObject?.author_permlink
      ? `?object=[${getObjectName(requiredObject).replace('&', '*amp*')}](${
          requiredObject?.object_type === 'link'
            ? requiredObject?.url.replace('*', '')
            : getObjectUrl(requiredObject?.author_permlink)
        })`
      : `?user=[${requiredObject?.name}](@${requiredObject?.name})`;

    if (!withoutSecondary) {
      search += object?.author_permlink
        ? `&object=[${getObjectName(object)}](${
            object.object_type === 'link' ? object?.url : getObjectUrl(object?.author_permlink)
          })`
        : `&user=[${objects.replace('@', '')}](${objects})`;
    }

    search += `&campaign=${proposition._id}&type=${
      proposition?.type
    }&secondaryItem=${object?.author_permlink || objects}`;

    if (!proposition?.reserved && proposition?.type === campaignTypes.REVIEWS) {
      // eslint-disable-next-line consistent-return
      return dispatch(reserveProposition(proposition, userName))
        .then(() => {
          if (isJudges && proposition?.activationPermlink) {
            dispatch(setActivationPermlink(proposition.activationPermlink));
          }

          const urlConfig = {
            pathname: isJudges ? `/rewards/judges/eligible/${authorPermlink}/posts` : '/editor',
            search: isJudges ? '' : search,
          };

          history.push(urlConfig);
        })
        .catch(e => {
          console.error(e);
          if (cb) cb(false);
        });
    }

    if (isJudges && proposition?.activationPermlink) {
      dispatch(setActivationPermlink(proposition.activationPermlink));
    }

    const urlConfig = {
      pathname: isJudges ? `/rewards/judges/eligible/${authorPermlink}/posts` : '/editor',
      search: isJudges ? '' : search,
    };

    // eslint-disable-next-line consistent-return
    return history.push(urlConfig);
  };
  const onClick = cb => onActionInitiated(() => handleClickReserve(cb));

  const reserveButton =
    isWaivio || isSocial ? (
      <ReservedButtons
        isJudges={isJudges}
        reserved={proposition.reserved}
        handleReserve={onClick}
        disable={disable}
        reservedDays={proposition?.countReservationDays}
        type={proposition?.type}
        activationPermlink={proposition?.activationPermlink}
        authorPermlink={proposition?.object?.author_permlink}
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
      wrapClassName={`DetailsModal ${template}`}
      footer={null}
      width={768}
    >
      <div>
        <RewardsHeader proposition={proposition} />
      </div>
      <DetailsModalBody
        proposition={{ ...proposition, requiredObject, object }}
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
  isJudges: PropTypes.bool,
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
