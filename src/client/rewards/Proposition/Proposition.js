/* eslint-disable */
import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { isEmpty, get, includes, filter, some } from 'lodash';
import PropTypes from 'prop-types';
import { Button, message, Icon } from 'antd';
import classNames from 'classnames';
import ObjectCardView from '../../objectCard/ObjectCardView';
import CampaignFooter from '../CampaignFooter/CampainFooterContainer';
import { getSingleComment } from '../../comments/commentsActions';
import { getAuthenticatedUser, getCommentContent, getIsAuthenticated } from '../../reducers';
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
import { generatePermlink, getObjectName } from '../../helpers/wObjectHelper';
import Details from '../Details/Details';
import CampaignCardHeader from '../CampaignCardHeader/CampaignCardHeader';
import './Proposition.less';

const handleRequirementFilters = requirementFilters => {
  let filteredObj = {};
  for (const key in requirementFilters) {
    if (key !== 'expertise' && key !== 'followers' && key !== 'posts') {
      filteredObj[key] = requirementFilters[key];
    }
  }
  return filteredObj;
};

const Proposition = ({
  intl,
  proposition,
  assignProposition,
  discardProposition,
  loading,
  wobj,
  assigned,
  post,
  authorizedUserName,
  history,
  match,
  getMessageHistory,
  user,
  blacklistUsers,
  users,
  wobjPrice,
  sortFraudDetection,
  isAuth,
}) => {
  const requirementFilters = get(proposition, ['requirement_filters'], {});
  const filteredRequirementFilters = handleRequirementFilters(requirementFilters);
  const isEligible = Object.values(filteredRequirementFilters).every(item => item === true);
  const proposedWobj = wobj;
  const requiredObject = get(proposition, ['required_object']);
  const [isModalDetailsOpen, setModalDetailsOpen] = useState(false);
  const [isReviewDetails, setReviewDetails] = useState(false);
  const parentObject = isEmpty(proposedWobj.parent) ? requiredObject : {};
  const requiredObjectName = getObjectName(requiredObject);
  const isMessages = !isEmpty(match)
    ? match.params[0] === MESSAGES || match.params[0] === GUIDE_HISTORY
    : '';
  const propositionUserName = get(proposition, ['users', '0', 'name']);
  const permlink = get(proposition, ['users', '0', 'permlink']);
  const userName = isMessages ? propositionUserName : authorizedUserName;
  const guideName = get(proposition, ['guide', 'name']);
  const parentAuthor = isMessages ? get(proposition, ['users', '0', 'rootName']) : guideName;
  const propositionActivationPermlink = get(proposition, ['activation_permlink']);
  const parentPermlink = isMessages ? permlink : propositionActivationPermlink;
  const unreservationPermlink = `reject-${proposition._id}${generatePermlink()}`;
  const type = isMessages ? 'reject_reservation_by_guide' : 'waivio_reject_object_campaign';
  const toggleModalDetails = ({ value }) => {
    if (value) setReviewDetails(value);
    setModalDetailsOpen(!isModalDetailsOpen);
  };

  const discardPr = obj => {
    const objects = get(proposition, ['objects']);
    const users = get(proposition, ['users']);
    const permlinks = filter(objects, object => object.permlink);
    const reservationPermlink = get(permlinks, ['0', 'permlink']);

    const currentUser =
      isMessages || match.params[0] === HISTORY
        ? users
        : filter(users, usersItem => usersItem.name === user.name && usersItem.status === ASSIGNED);
    const activationPermlink = get(proposition, ['activation_permlink']);

    const rejectData = {
      campaign_permlink: activationPermlink,
      user_name: userName,
      reservation_permlink: reservationPermlink || get(currentUser, ['0', 'permlink'], ''),
      unreservation_permlink: unreservationPermlink,
    };
    return rejectReservationCampaign(rejectData).then(() =>
      discardProposition({
        requiredObjectName,
        companyAuthor: parentAuthor,
        companyPermlink: parentPermlink,
        objPermlink: obj.author_permlink,
        reservationPermlink: rejectData.reservation_permlink,
        unreservationPermlink,
        type,
      }),
    );
  };
  const [isReserved, setReservation] = useState(false);
  const userData = get(users, ['user', 'name', 'alias'], '');
  const reserveOnClickHandler = () => {
    const getJsonData = () => {
      if (!isEmpty(user)) {
        try {
          return !isEmpty(user.posting_json_metadata)
            ? JSON.parse(user.posting_json_metadata)
            : JSON.parse(user.json_metadata);
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
      userData || get(getJsonData(), ['profile', 'name'], '') || get(user, ['name'], '');
    const reserveData = {
      campaign_permlink: proposition.activation_permlink,
      approved_object: get(wobj, 'author_permlink'),
      user_name: authorizedUserName,
      reservation_permlink: `reserve-${generatePermlink()}`,
    };
    getCurrentHivePrice().then(res => {
      const currencyId = res.id;
      const currentHivePrice = res.hiveCurrency;
      const amount = (proposition.reward / currentHivePrice).toFixed(3);
      const guideName = get(proposition, ['guide', 'name']);
      reserveActivatedCampaign(reserveData)
        .then(() =>
          assignProposition({
            companyAuthor: guideName,
            companyPermlink: proposition.activation_permlink,
            resPermlink: reserveData.reservation_permlink,
            objPermlink: wobj.author_permlink,
            companyId: proposition._id,
            primaryObjectName: requiredObjectName,
            secondaryObjectName: proposedWobj.name,
            amount,
            proposition,
            proposedWobj,
            userName,
            currencyId,
          }),
        )
        .then(() => {
          setModalDetailsOpen(!isModalDetailsOpen);
          setReservation(true);
          setTimeout(() => {
            history.push('/rewards/reserved');
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
  const requiredObjectAuthorPermlink = get(proposition, ['required_object', 'author_permlink']);

  const paramsUrl = [HISTORY, GUIDE_HISTORY, MESSAGES, FRAUD_DETECTION];
  return (
    <div className="Proposition">
      <div className="Proposition__header">
        <CampaignCardHeader
          campaignData={proposition}
          isWobjAssigned={assigned}
          wobjPrice={wobjPrice}
          match={match}
        />
      </div>
      <div className="Proposition__card">
        <ObjectCardView passedParent={parentObject} wObject={proposedWobj} key={proposedWobj.id} />
      </div>
      <div
        className={classNames('Proposition__footer', {
          'justify-end': isReserved || !isEligible,
        })}
      >
        {/*Temporary fix until changes on backend will be made*/}
        {/*{proposition.activation_permlink && assigned === true && !_.isEmpty(post) ? (*/}
        {/* changes braked reservation process, changes reverted */}
        {assigned || some(paramsUrl, item => includes(match.url, item)) ? (
          <CampaignFooter
            post={post}
            loading={loading}
            proposedWobj={proposedWobj}
            requiredObjectPermlink={requiredObjectAuthorPermlink}
            requiredObjectName={requiredObjectName}
            discardPr={discardPr}
            proposition={proposition}
            toggleModalDetails={toggleModalDetails}
            history={history}
            match={match}
            getMessageHistory={getMessageHistory}
            blacklistUsers={blacklistUsers}
            sortFraudDetection={sortFraudDetection}
            userFollowing={proposition.guide.youFollows}
            objectFollowing={proposition.required_object.followsObject}
          />
        ) : (
          <React.Fragment>
            {isEligible && !isReserved && !assigned && (
              <div className="Proposition__footer-button">
                <Button
                  type="primary"
                  loading={loading}
                  disabled={loading || proposition.isReservedSiblingObj}
                  onClick={toggleModalDetails}
                >
                  {intl.formatMessage({
                    id: 'reserve',
                    defaultMessage: `Reserve`,
                  })}
                </Button>
                <div className="Proposition__footer-button-days">
                  {proposition.count_reservation_days &&
                    `${intl.formatMessage({
                      id: 'for_days',
                      defaultMessage: `for`,
                    })} ${proposition.count_reservation_days} ${intl.formatMessage({
                      id: 'days',
                      defaultMessage: `days`,
                    })}`}
                </div>
              </div>
            )}
            <div className="Proposition__footer-details" onClick={toggleModalDetails}>
              <span role="presentation">
                {intl.formatMessage({
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
        objectDetails={proposition}
        toggleModal={toggleModalDetails}
        reserveOnClickHandler={reserveOnClickHandler}
        loading={loading}
        assigned={assigned}
        isReserved={isReserved}
        isReviewDetails={isReviewDetails}
        requiredObjectName={requiredObjectName}
        proposedWobj={proposedWobj}
        isEligible={isEligible}
        match={match}
        isAuth={isAuth}
      />
    </div>
  );
};

Proposition.propTypes = {
  proposition: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  wobj: PropTypes.shape().isRequired,
  assignProposition: PropTypes.func,
  discardProposition: PropTypes.func,
  loading: PropTypes.bool,
  assigned: PropTypes.bool,
  assignCommentPermlink: PropTypes.string,
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape(),
  users: PropTypes.shape(),
  match: PropTypes.shape(),
  sortFraudDetection: PropTypes.string,
  isAuth: PropTypes.bool,
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
  sortFraudDetection: 'reservation',
  isAuth: false,
};

export default connect(
  (state, ownProps) => ({
    user: getAuthenticatedUser(state),
    post:
      ownProps.authorizedUserName &&
      ownProps.assignCommentPermlink &&
      !isEmpty(state.comments.comments)
        ? getCommentContent(state, ownProps.authorizedUserName, ownProps.assignCommentPermlink)
        : {},
    isAuth: getIsAuthenticated(state),
  }),
  {
    getSingleComment,
  },
)(injectIntl(Proposition));
