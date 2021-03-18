/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { isEmpty, get, includes, filter, some } from 'lodash';
import PropTypes from 'prop-types';
import { Button, message, Icon } from 'antd';
import classNames from 'classnames';
import { withRouter } from 'react-router';

import ObjectCardView from '../../objectCard/ObjectCardView';
import CampaignFooter from '../CampaignFooter/CampainFooterContainer';
import {
  getAuthenticatedUser,
  getCommentContent,
  getIsAuthenticated,
  getIsOpenWriteReviewModal,
} from '../../reducers';
import {
  ASSIGNED,
  GUIDE_HISTORY,
  HISTORY,
  MESSAGES,
  FRAUD_DETECTION,
} from '../../../common/constants/rewards';
import { connect } from 'react-redux';
import {
  rejectReservationCampaign,
  reserveActivatedCampaign,
  getCurrentHivePrice,
} from '../../../waivioApi/ApiClient';
import { removeToggleFlag } from '../rewardsActions';
import { generatePermlink, getObjectName } from '../../helpers/wObjectHelper';
import Details from '../Details/Details';
import CampaignCardHeader from '../CampaignCardHeader/CampaignCardHeader';
import {
  handleRequirementFilters,
  openNewTab,
  removeSessionData,
  setSessionData,
} from '../rewardsHelper';

import './Proposition.less';

const Proposition = props => {
  const currentProposId = get(props.proposition, ['_id'], '');
  const currentWobjId = get(props.wobj, ['_id'], '');
  const authorizedUserName = get(props.user, 'name', '');
  const propositionClassList = classNames('Proposition', {
    'Proposition--hovered': props.hovered
  });
  const searchParams = new URLSearchParams(props.location.search);

  const isWidget = searchParams.get('display');
  const isReservedLink = searchParams.get('toReserved');
  const sessionCurrentProposjId = sessionStorage.getItem('currentProposId');
  const sessionCurrentWobjjId = sessionStorage.getItem('currentWobjId');

  const handleCurrentEligibleParam = obj => Object.values(obj).every(item => item === true);

  const requirementFilters = get(props.proposition, ['requirement_filters'], {});
  const filteredRequirementFilters = handleRequirementFilters(requirementFilters);
  const isEligible = props.isAuth
    ? handleCurrentEligibleParam(requirementFilters)
    : handleCurrentEligibleParam(filteredRequirementFilters);
  const proposedWobj = props.wobj;
  const requiredObject = get(props.proposition, ['required_object']);
  const [isModalDetailsOpen, setModalDetailsOpen] = useState(false);
  const [isReviewDetails, setReviewDetails] = useState(false);
  const requiredObjectName = getObjectName(requiredObject);
  const isMessages = !isEmpty(props.match)
    ? props.match.params[0] === MESSAGES || props.match.params[0] === GUIDE_HISTORY
    : '';
  const propositionUserName = get(props.proposition, ['users', '0', 'name']);
  const permlink = get(props.proposition, ['users', '0', 'permlink']);
  const userName = isMessages ? propositionUserName : authorizedUserName;
  const guideName = get(props.proposition, ['guide', 'name']);
  const parentAuthor = isMessages ? get(props.proposition, ['users', '0', 'rootName']) : guideName;
  const propositionActivationPermlink = get(props.proposition, ['activation_permlink']);
  const parentPermlink = isMessages ? permlink : propositionActivationPermlink;
  const unreservationPermlink = `reject-${props.proposition._id}${generatePermlink()}`;
  const type = isMessages ? 'reject_reservation_by_guide' : 'waivio_reject_object_campaign';

  const toggleModalDetails = ({ value }) => {
    if (value) {
      setReviewDetails(value);
    }
    setModalDetailsOpen(!isModalDetailsOpen);
  };

  const discardPr = obj => {
    const objects = get(props.proposition, ['objects']);
    const users = get(props.proposition, ['users']);
    const permlinks = filter(objects, object => object.permlink);
    const reservationPermlink = get(permlinks, ['0', 'permlink']);

    const currentUser =
      isMessages || props.match.params[0] === HISTORY
        ? users
        : filter(
            users,
            usersItem => usersItem.name === props.user.name && usersItem.status === ASSIGNED,
          );
    const activationPermlink = get(props.proposition, ['activation_permlink']);

    const rejectData = {
      campaign_permlink: activationPermlink,
      user_name: userName,
      reservation_permlink: reservationPermlink || get(currentUser, ['0', 'permlink'], ''),
      unreservation_permlink: unreservationPermlink,
    };

    return rejectReservationCampaign(rejectData).then(() =>
      props
        .discardProposition({
          requiredObjectName,
          companyAuthor: parentAuthor,
          companyPermlink: parentPermlink,
          objPermlink: obj.author_permlink,
          reservationPermlink: rejectData.reservation_permlink,
          unreservationPermlink,
          type,
        })
        .catch(e => message.error(e.error_description)),
    );
  };
  const [isReserved, setReservation] = useState(false);
  const userData = get(props.users, ['user', 'name', 'alias'], '');
  const reserveOnClickHandler = () => {
    const getJsonData = () => {
      if (!isEmpty(props.user)) {
        try {
          return !isEmpty(props.user.posting_json_metadata)
            ? JSON.parse(props.user.posting_json_metadata)
            : JSON.parse(props.user.json_metadata);
        } catch (err) {
          message.error(
            intl.formatMessage({
              id: 'something_went_wrong',
              defaultMessage: 'Something went wrong',
            }),
          );
        }
      }
    };
    const userName =
      userData || get(getJsonData(), ['profile', 'name'], '') || get(props.user, ['name'], '');
    const reserveData = {
      campaign_permlink: props.proposition.activation_permlink,
      approved_object: get(props.wobj, 'author_permlink'),
      user_name: authorizedUserName,
      reservation_permlink: `reserve-${generatePermlink()}`,
    };
    getCurrentHivePrice().then(res => {
      const currencyId = res.id;
      const currentHivePrice = res.hiveCurrency;
      const amount = (props.proposition.reward / currentHivePrice).toFixed(3);
      const guideName = get(props.proposition, ['guide', 'name']);
      reserveActivatedCampaign(reserveData)
        .then(() =>
          props.assignProposition({
            companyAuthor: guideName,
            companyPermlink: props.proposition.activation_permlink,
            resPermlink: reserveData.reservation_permlink,
            objPermlink: props.wobj.author_permlink,
            companyId: props.proposition._id,
            primaryObjectName: requiredObjectName,
            secondaryObjectName: proposedWobj.name,
            amount,
            proposition: props.proposition,
            proposedWobj,
            userName,
            currencyId,
          }),
        )
        .then(() => {
          setModalDetailsOpen(!isModalDetailsOpen);
          setReservation(true);
          setTimeout(() => {
            props.history.push('/rewards/reserved');
          }, 5000);
        })
        .catch(e => {
          if (e.error_description || e.message) {
            message.error(e.error_description || e.message);
          } else {
            message.error(
              intl.formatMessage({
                id: 'something_went_wrong',
                defaultMessage: 'Something went wrong',
              }),
            );
          }
        });
    });
  };

  const requiredObjectAuthorPermlink = get(props.proposition, [
    'required_object',
    'author_permlink',
  ]);

  const paramsUrl = [HISTORY, GUIDE_HISTORY, MESSAGES, FRAUD_DETECTION];

  useEffect(() => {
    if (sessionCurrentProposjId && sessionCurrentWobjjId) {
      if (sessionCurrentProposjId === currentProposId && sessionCurrentWobjjId === currentWobjId) {
        setModalDetailsOpen(!isModalDetailsOpen);
        removeSessionData('currentProposId', 'currentWobjId');
      }
    }

    if (isReservedLink && props.isAuth && props.isOpenWriteReviewModal !== isModalDetailsOpen) {
      setReviewDetails(props.isOpenWriteReviewModal);
      setModalDetailsOpen(props.isOpenWriteReviewModal);
    }
  }, [props.proposition]);

  const handleReserveOnClick = value => {
    if (isWidget) {
      setSessionData('currentProposId', currentProposId);
      setSessionData('currentWobjId', currentWobjId);
      openNewTab(`${props.location.origin}${props.location.pathname}`);
    } else {
      return toggleModalDetails(value);
    }
  };

  return (
    <div className={propositionClassList}>
      <div className="Proposition__header">
        <CampaignCardHeader
          campaignData={props.proposition}
          isWobjAssigned={props.assigned}
          wobjPrice={props.wobjPrice}
          match={props.match}
        />
      </div>
      <div className="Proposition__card">
        <ObjectCardView
          passedParent={requiredObject}
          wObject={proposedWobj}
          key={proposedWobj.id}
        />
      </div>
      <div
        className={classNames('Proposition__footer', {
          'justify-end': isReserved,
        })}
      >
        {props.assigned || some(paramsUrl, item => includes(props.match.url, item)) ? (
          <CampaignFooter
            post={props.post}
            loading={props.loading}
            proposedWobj={proposedWobj}
            requiredObjectPermlink={requiredObjectAuthorPermlink}
            requiredObjectName={requiredObjectName}
            discardPr={discardPr}
            proposition={props.proposition}
            toggleModalDetails={toggleModalDetails}
            history={props.history}
            match={props.match}
            getMessageHistory={props.getMessageHistory}
            blacklistUsers={props.blacklistUsers}
            sortFraudDetection={props.sortFraudDetection}
            userFollowing={props.proposition.guide.youFollows}
            objectFollowing={props.proposition.required_object.followsObject}
            fraudNumbers={props.fraudNumbers}
          />
        ) : (
          <React.Fragment>
            {!isReserved && !props.assigned && (
              <div className="Proposition__footer-button">
                <Button
                  type="primary"
                  loading={props.loading}
                  disabled={props.loading || props.proposition.isReservedSiblingObj}
                  onClick={handleReserveOnClick}
                >
                  {props.intl.formatMessage({
                    id: 'reserve',
                    defaultMessage: `Reserve`,
                  })}
                </Button>
                <div className="Proposition__footer-button-days">
                  {props.proposition.count_reservation_days &&
                    `${props.intl.formatMessage({
                      id: 'for_days',
                      defaultMessage: `for`,
                    })} ${props.proposition.count_reservation_days} ${props.intl.formatMessage({
                      id: 'days',
                      defaultMessage: `days`,
                    })}`}
                </div>
              </div>
            )}
            <div className="Proposition__footer-details" onClick={toggleModalDetails}>
              <span role="presentation">
                {props.intl.formatMessage({
                  id: 'details',
                  defaultMessage: `Details`,
                })}
              </span>
              <Icon type="right" />
            </div>
          </React.Fragment>
        )}
      </div>
      <Details
        isModalDetailsOpen={isModalDetailsOpen}
        objectDetails={props.proposition}
        toggleModal={toggleModalDetails}
        reserveOnClickHandler={reserveOnClickHandler}
        loading={props.loading}
        assigned={props.assigned}
        isReserved={isReserved}
        isReviewDetails={isReviewDetails}
        requiredObjectName={requiredObjectName}
        proposedWobj={proposedWobj}
        isEligible={isEligible}
        match={props.match}
        isAuth={props.isAuth}
        authorizedUserName={authorizedUserName}
        removeToggleFlag={removeToggleFlag}
        isOpenWriteReviewModal={props.isOpenWriteReviewModal}
      />
    </div>
  );
};

Proposition.propTypes = {
  proposition: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  wobj: PropTypes.shape().isRequired,
  assignProposition: PropTypes.func,
  discardProposition: PropTypes.func,
  removeToggleFlag: PropTypes.func,
  loading: PropTypes.bool,
  assigned: PropTypes.bool,
  assignCommentPermlink: PropTypes.string,
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape(),
  users: PropTypes.shape(),
  match: PropTypes.shape(),
  sortFraudDetection: PropTypes.string,
  isAuth: PropTypes.bool,
  isOpenWriteReviewModal: PropTypes.bool,
  fraudNumbers: PropTypes.shape(),
};

Proposition.defaultProps = {
  authorizedUserName: '',
  post: {},
  assigned: null,
  loading: false,
  users: {},
  match: {},
  assignProposition: () => {},
  discardProposition: () => {},
  removeToggleFlag: () => {},
  sortFraudDetection: 'reservation',
  isAuth: false,
  isOpenWriteReviewModal: false,
  fraudNumbers: [],
};

export default withRouter(
  connect(
    (state, ownProps) => ({
      user: getAuthenticatedUser(state),
      post:
        ownProps.wobj.author_permlink && !isEmpty(state.comments.comments)
          ? getCommentContent(state, getAuthenticatedUser(state), ownProps.wobj.author_permlink)
          : {},
      isAuth: getIsAuthenticated(state),
      isOpenWriteReviewModal: getIsOpenWriteReviewModal(state),
    }),
    {
      removeToggleFlag,
    },
  )(injectIntl(Proposition)),
);
