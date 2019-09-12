/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import './Proposition.less';
import { getClientWObj } from '../../adapters';
import ObjectCardView from '../../objectCard/ObjectCardView';
import Avatar from '../../components/Avatar';
import CampaignFooter from '../CampaignFooter/CampainFooterContainer';
import { getSingleComment } from '../../comments/commentsActions';
import { getCommentContent } from '../../reducers';
import { connect } from 'react-redux';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';

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
}) => {
  const proposedWobj = getClientWObj(wobj);
  const assignPr = () => {
    assignProposition({
      companyAuthor: proposition.guide.name,
      companyPermlink: proposition.activation_permlink,
      companyId: proposition._id,
      objPermlink: wobj.author_permlink,
    });
  };
  const requiredObjectName = getFieldWithMaxWeight(
    proposition.required_object,
    'name',
    proposition.required_object.author_permlink,
  );
  useEffect(() => {
    getSingleComment(proposition.guide.name, assignCommentPermlink);
  }, []);

  const toggleModalDetails = () => {
    toggleModal(proposition);
  };

  const discardPr = obj => {
    discardProposition({
      companyAuthor: proposition.guide.name,
      companyPermlink: proposition.activation_permlink,
      companyId: proposition._id,
      objPermlink: obj.author_permlink,
    });
  };

  const [isModalOpen, openModal] = useState(false);

  const reserveOnClickHandler = () => {
    openModal(!isModalOpen);
  };

  const modalOnOklHandler = () => {
    assignPr();
    openModal(false);
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
          />
        ) : (
          <React.Fragment>
            {!assigned && (
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
                    id: 'for',
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
      ownProps.proposition.guide.name &&
      ownProps.assignCommentPermlink &&
      !_.isEmpty(state.comments.comments)
        ? getCommentContent(state, ownProps.proposition.guide.name, ownProps.assignCommentPermlink)
        : {},
  }),
  {
    getSingleComment,
  },
)(injectIntl(Proposition));
