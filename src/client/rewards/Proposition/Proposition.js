/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { isEmpty, get, includes, filter } from 'lodash';
import PropTypes from 'prop-types';
import { Button, message, Icon } from 'antd';
import classNames from 'classnames';
import { getClientWObj } from '../../adapters';
import ObjectCardView from '../../objectCard/ObjectCardView';
import CampaignFooter from '../CampaignFooter/CampainFooterContainer';
import { getSingleComment } from '../../comments/commentsActions';
import { getCommentContent } from '../../reducers';
import { GUIDE_HISTORY, HISTORY, MESSAGES } from '../../../common/constants/rewards';
import { connect } from 'react-redux';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';
import {
  rejectReservationCampaign,
  reserveActivatedCampaign,
  getCurrentHivePrice,
} from '../../../waivioApi/ApiClient';
import { generatePermlink } from '../../helpers/wObjectHelper';
import { AppSharedContext } from '../../Wrapper';
import Details from '../Details/Details';
import CampaignCardHeader from '../CampaignCardHeader/CampaignCardHeader';
import './Proposition.less';

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
}) => {
  const getEligibility = proposition =>
    Object.values(proposition.requirement_filters).every(item => item === true);
  const isEligible = getEligibility(proposition);
  const { usedLocale } = useContext(AppSharedContext);
  const proposedWobj = getClientWObj(wobj, usedLocale);
  const [isModalDetailsOpen, setModalDetailsOpen] = useState(false);
  const [isReviewDetails, setReviewDetails] = useState(false);
  const parentObject = getClientWObj(proposition.required_object, usedLocale);
  const requiredObjectName = getFieldWithMaxWeight(proposition.required_object, 'name');
  const isMessages = match.params[0] === MESSAGES || match.params[0] === GUIDE_HISTORY;
  const propositionUserName = get(proposition, ['users', '0', 'name']);
  const permlink = get(proposition, ['users', '0', 'permlink']);
  const userName = isMessages ? propositionUserName : authorizedUserName;
  const parenAuthor = isMessages ? propositionUserName : proposition.guide.name;
  const parentPermlink = isMessages ? permlink : proposition.activation_permlink;
  const unreservationPermlink = `reject-${proposition._id}${generatePermlink()}`;
  const type = isMessages ? 'reject_reservation_by_guide' : 'waivio_reject_object_campaign';

  const toggleModalDetails = ({ value }) => {
    if (value) setReviewDetails(value);
    setModalDetailsOpen(!isModalDetailsOpen);
  };

  const discardPr = obj => {
    const reservationPermlink = filter(proposition.objects, object => object.permlink)[0].permlink;
    const rejectData = {
      campaign_permlink: proposition.activation_permlink,
      user_name: userName,
      reservation_permlink: reservationPermlink || get(proposition, ['users', '0', 'permlink'], ''),
      unreservation_permlink: unreservationPermlink,
    };
    return rejectReservationCampaign(rejectData).then(() =>
      discardProposition({
        requiredObjectName,
        companyAuthor: parenAuthor,
        companyPermlink: parentPermlink,
        objPermlink: obj.author_permlink,
        reservationPermlink: rejectData.reservation_permlink,
        unreservationPermlink,
        type,
      }),
    );
  };

  const [isReserved, setReservation] = useState(false);
  const userData = !isEmpty(users) ? get(users, [user.name, 'alias']) : null;

  const reserveOnClickHandler = () => {
    const getJsonData = () => {
      if (!isEmpty(user)) {
        try {
          return JSON.parse(user.posting_json_metadata) || JSON.parse(user.json_metadata);
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
    const userName = userData || get(getJsonData(), ['profile', 'name']) || user.name;
    const reserveData = {
      campaign_permlink: proposition.activation_permlink,
      approved_object: wobj.author_permlink,
      user_name: authorizedUserName,
      reservation_permlink: `reserve-${generatePermlink()}`,
    };
    getCurrentHivePrice().then(res => {
      const currencyId = res.id;
      const currentHivePrice = res.hiveCurrency;
      const amount = (proposition.reward / currentHivePrice).toFixed(3);
      reserveActivatedCampaign(reserveData)
        .then(() =>
          assignProposition({
            companyAuthor: proposition.guide.name,
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
        .then(({ isAssign }) => {
          if (isAssign) {
            setModalDetailsOpen(!isModalDetailsOpen);
            setReservation(true);
            history.push('/rewards/reserved');
          }
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
        {assigned ||
        includes(match.url, HISTORY) ||
        includes(match.url, GUIDE_HISTORY) ||
        includes(match.url, MESSAGES) ? (
          <CampaignFooter
            post={post}
            loading={loading}
            proposedWobj={proposedWobj}
            requiredObjectPermlink={proposition.required_object.author_permlink}
            requiredObjectName={requiredObjectName}
            discardPr={discardPr}
            proposition={proposition}
            toggleModalDetails={toggleModalDetails}
            history={history}
            match={match}
            getMessageHistory={getMessageHistory}
            blacklistUsers={blacklistUsers}
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
                {proposition.count_reservation_days &&
                  `${intl.formatMessage({
                    id: 'for_days',
                    defaultMessage: `for`,
                  })} ${proposition.count_reservation_days} ${intl.formatMessage({
                    id: 'days',
                    defaultMessage: `days`,
                  })}`}
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
      />
    </div>
  );
};

Proposition.propTypes = {
  proposition: PropTypes.shape().isRequired,
  wobj: PropTypes.shape().isRequired,
  assignProposition: PropTypes.func.isRequired,
  discardProposition: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  assigned: PropTypes.bool,
  assignCommentPermlink: PropTypes.string,
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape(),
  users: PropTypes.shape(),
};

Proposition.defaultProps = {
  authorizedUserName: '',
  post: {},
  assigned: null,
  loading: false,
  users: {},
};

export default connect(
  (state, ownProps) => ({
    post:
      ownProps.authorizedUserName &&
      ownProps.assignCommentPermlink &&
      !isEmpty(state.comments.comments)
        ? getCommentContent(state, ownProps.authorizedUserName, ownProps.assignCommentPermlink)
        : {},
  }),
  {
    getSingleComment,
  },
)(injectIntl(Proposition));
