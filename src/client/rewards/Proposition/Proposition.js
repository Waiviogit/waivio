/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { getClientWObj } from '../../adapters';
import ObjectCardView from '../../objectCard/ObjectCardView';
import Avatar from '../../components/Avatar';
import CampaignFooter from '../CampaignFooter/CampainFooterContainer';
import { getSingleComment } from '../../comments/commentsActions';
import { getCommentContent } from '../../reducers';
import { connect } from 'react-redux';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';
import { reserveActivatedCampaign } from '../../../waivioApi/ApiClient';
import { rejectReservationCampaign } from '../../../waivioApi/ApiClient';
import { generatePermlink } from '../../helpers/wObjectHelper';
import './Proposition.less';

const Proposition = ({
  intl,
  proposition,
  assignProposition,
  assignCommentPermlink,
  discardProposition,
  loading,
  wobj,
  toggleModal,
  assigned,
  post,
  getSingleComment,
  authorizedUserName,
}) => {
  const proposedWobj = getClientWObj(wobj);
  const requiredObjectName = getFieldWithMaxWeight(
    proposition.required_object,
    'name',
    proposition.required_object.author_permlink,
  );
  useEffect(() => {
    getSingleComment(authorizedUserName, assignCommentPermlink);
  }, []);

  const toggleModalDetails = () => {
    toggleModal(proposition);
  };

  const discardPr = obj => {
    const unreservationPermlink = `reject-${proposition._id}${generatePermlink()}`;
    const rejectData = {
      campaign_permlink: proposition.activation_permlink,
      user_name: proposition.guide.name,
      reservation_permlink: proposition.objects[0].permlink,
      unreservation_permlink: unreservationPermlink,
    };
    rejectReservationCampaign(rejectData)
      .then(() => {
        message.success(
          intl.formatMessage({
            id: 'discarded_successfully',
            defaultMessage: 'Discarded successfully',
          }),
        );
        discardProposition({
          companyAuthor: proposition.guide.name,
          companyPermlink: proposition.activation_permlink,
          objPermlink: obj.author_permlink,
          reservationPermlink: rejectData.reservation_permlink,
          unreservationPermlink,
        });
      })
      .catch(() => {
        message.error(
          intl.formatMessage({
            id: 'cannot_reject_campaign',
            defaultMessage: 'You cannot reject the campaign at the moment',
          }),
        );
      });
  };

  const [isModalOpen, openModal] = useState(false);
  const [isReserved, setReservation] = useState(false);

  const reserveOnClickHandler = () => {
    openModal(!isModalOpen);
  };

  const modalOnOklHandler = () => {
    const reserveData = {
      campaign_permlink: proposition.activation_permlink,
      approved_object: wobj.author_permlink,
      user_name: authorizedUserName,
      reservation_permlink: `reserve-${generatePermlink()}`,
    };
    reserveActivatedCampaign(reserveData)
      .then(() => {
        assignProposition({
          companyAuthor: proposition.guide.name,
          companyPermlink: proposition.activation_permlink,
          resPermlink: reserveData.reservation_permlink,
          objPermlink: wobj.author_permlink,
          companyId: proposition._id,
        });
        openModal(false);
        setReservation(true);
      })
      .catch(() => {
        message.error(
          intl.formatMessage({
            id: 'cannot_reserve_company',
            defaultMessage: 'You cannot reserve the campaign at the moment',
          }),
        );
      });
  };

  const modalOnCancelHandler = () => {
    openModal(false);
  };

  return (
    <div className="Proposition">
      <div className="RewardsHeader-block">
        <div className="RewardsHeader-wrap">
          {`${intl.formatMessage({
            id: 'reward_requested_by',
            defaultMessage: `Reviews requested by`,
          })}:`}
          <span>{`${intl.formatMessage({
            id: 'rewards',
            defaultMessage: `Rewards`,
          })}:`}</span>
        </div>
        <div className="RewardsHeader-wrap-second">
          <div className="RewardsHeader__user-card">
            <Link to={`/@${proposition.guide.name}`}>
              <Avatar username={proposition.guide.name} size={34} />
            </Link>
            <Link to={`/@${proposition.guide.name}`} title={proposition.guide.name}>
              <div className="RewardsHeader__user-card-alias">{proposition.guide.alias}</div>
              <div className="RewardsHeader__user-card-username">{`@${
                proposition.guide.name
              } (${intl.formatMessage({
                id: 'paid',
                defaultMessage: `paid`,
              })} $${proposition.guide.total_payed})`}</div>
            </Link>
          </div>
          <span className="RewarsHeader-payment">{`$${proposition.reward}`}</span>
        </div>
      </div>
      <ObjectCardView wObject={proposedWobj} key={proposedWobj.id} />
      <div className="RewardsFooter-wrap">
        {proposition.activation_permlink && assigned === true && !_.isEmpty(post) ? (
          <CampaignFooter
            post={post}
            proposedWobj={proposedWobj}
            requiredObjectPermlink={proposition.required_object.author_permlink}
            requiredObjectName={requiredObjectName}
            discardPr={discardPr}
            proposition={proposition}
          />
        ) : (
          <React.Fragment>
            {assigned !== null && !assigned && !isReserved && (
              <div className="RewardsHeader-button">
                <Button
                  type="primary"
                  loading={loading}
                  disabled={loading}
                  onClick={reserveOnClickHandler}
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
            <a role="presentation" className="RewardsHeader" onClick={toggleModalDetails}>
              {intl.formatMessage({
                id: 'details',
                defaultMessage: `Details`,
              })}
            </a>
          </React.Fragment>
        )}
      </div>
      <Modal
        closable
        maskClosable={false}
        title={intl.formatMessage({
          id: 'reserve_campaign',
          defaultMessage: `Reserve rewards campaign`,
        })}
        visible={isModalOpen}
        onOk={modalOnOklHandler}
        onCancel={modalOnCancelHandler}
      >
        {intl.formatMessage({
          id: 'reserve_campaign_accept',
          defaultMessage: `Do you want to reserve rewards campaign?`,
        })}
      </Modal>
    </div>
  );
};

Proposition.propTypes = {
  proposition: PropTypes.shape().isRequired,
  wobj: PropTypes.shape().isRequired,
  assignProposition: PropTypes.func.isRequired,
  discardProposition: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  assigned: PropTypes.bool,
  assignCommentPermlink: PropTypes.string,
  toggleModal: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape(),
};

Proposition.defaultProps = {
  authorizedUserName: '',
  post: {},
  assigned: null,
};

export default connect(
  (state, ownProps) => ({
    post:
      ownProps.authorizedUserName &&
      ownProps.assignCommentPermlink &&
      !_.isEmpty(state.comments.comments)
        ? getCommentContent(state, ownProps.authorizedUserName, ownProps.assignCommentPermlink)
        : {},
  }),
  {
    getSingleComment,
  },
)(injectIntl(Proposition));
