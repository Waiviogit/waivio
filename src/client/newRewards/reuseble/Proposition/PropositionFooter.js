import React, { useState } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, noop } from 'lodash';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import RewardsPopover from '../../RewardsPopover/RewardsPopover';
import Avatar from '../../../components/Avatar';
import QuickCommentEditor from '../../../components/Comments/QuickCommentEditor';
import { sendCommentForReward } from '../../../../store/newRewards/newRewardsActions';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { getPostCommentsFromApi } from '../../../../waivioApi/ApiClient';
import CommentsMessages from '../../../rewards/CampaignFooter/CommentsMessages';

import './Proposition.less';

const PropositionFooter = ({
  type,
  openDetailsModal,
  countReservationDays,
  commentsCount,
  proposition,
  getProposition,
  intl,
}) => {
  const dispatch = useDispatch();
  const authUserName = useSelector(getAuthenticatedUserName);
  const [loading, setLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState({});

  const getCommentsList = async () => {
    const commentList = await getPostCommentsFromApi({
      author: proposition?.userName,
      permlink: proposition?.reservationPermlink,
      userName: authUserName,
    });

    setComments(commentList.content);
    setShowComment(true);
  };

  const sendComment = (parentP, commentValue) => {
    setLoading(true);

    return dispatch(sendCommentForReward(proposition, commentValue)).then(() => {
      setLoading(false);
      getProposition();
    });
  };

  const getFooter = () => {
    switch (type) {
      case 'reserved':
        return (
          <div className="Proposition-new__footer-container">
            <div className="Proposition-new__button-container">
              <b>Reserved</b>
              <i className="iconfont icon-message_fill" onClick={getCommentsList} />
              {commentsCount}
              <RewardsPopover proposition={proposition} getProposition={getProposition} />
            </div>
            <Button type="primary" onClick={openDetailsModal}>
              Write review
            </Button>
          </div>
        );
      case 'history':
      case 'reservations':
      case 'messages':
      case 'fraud':
        return (
          <React.Fragment>
            <div className="Proposition-new__footer-container">
              <div className="Proposition-new__button-container">
                <b>
                  {intl.formatMessage({
                    id: `type_${proposition?.reviewStatus}`,
                    defaultMessage: proposition?.reviewStatus,
                  })}
                </b>
                <i className="iconfont icon-message_fill" onClick={getCommentsList} />
                {commentsCount}
                <RewardsPopover
                  proposition={proposition}
                  getProposition={getProposition}
                  type={type}
                />
              </div>
              {proposition?.userName && (
                <div className={'Proposition-new__userCard'}>
                  <Avatar size={24} username={proposition?.userName} />
                  <a href={`/@${proposition?.userName}`}>{proposition?.userName}</a>
                </div>
              )}
            </div>
            {!isEmpty(proposition?.fraudCodes) && (
              <div>Codes: {proposition?.fraudCodes.join(', ')}</div>
            )}
            <CommentsMessages
              show={showComment}
              user={{}}
              post={comments}
              getMessageHistory={() => {}}
              // currentComment={currentComment}
              // getReservedComments={this.getReservedComments}
              // parent={rootComment}
              // matchPath={match.params[0]}
              // match={match}
              // isGuest={isGuest}
              proposition={proposition}
            />
            <QuickCommentEditor onSubmit={sendComment} isLoading={loading} />
          </React.Fragment>
        );

      default:
        return (
          <div className="Proposition-new__footer-container">
            <Button type="primary" onClick={openDetailsModal}>
              <b>Reserve</b> Your Reward
            </Button>{' '}
            for {countReservationDays} days
          </div>
        );
    }
  };

  return (
    <div>
      <div className="Proposition-new__footer">{getFooter()}</div>
    </div>
  );
};

PropositionFooter.propTypes = {
  type: PropTypes.string.isRequired,
  openDetailsModal: PropTypes.func.isRequired,
  countReservationDays: PropTypes.number.isRequired,
  commentsCount: PropTypes.number.isRequired,
  getProposition: PropTypes.func,
  proposition: PropTypes.shape({
    reviewStatus: PropTypes.string,
    userName: PropTypes.string,
    reservationPermlink: PropTypes.string,
    fraudCodes: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

PropositionFooter.defaultProps = {
  getProposition: noop,
};

export default injectIntl(PropositionFooter);
