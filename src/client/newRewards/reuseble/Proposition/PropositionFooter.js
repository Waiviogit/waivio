import React, { useEffect, useState } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, noop } from 'lodash';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useLocation } from 'react-router';

import RewardsPopover from '../../RewardsPopover/RewardsPopover';
import Avatar from '../../../components/Avatar';
import QuickCommentEditor from '../../../components/Comments/QuickCommentEditor';
import {
  reserveProposition,
  sendCommentForReward,
} from '../../../../store/newRewards/newRewardsActions';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { getPostCommentsFromApi } from '../../../../waivioApi/ApiClient';
import CommentCard from '../../Comments/CommentCard';
import config from '../../../../waivioApi/routes';
import { getIsWaivio } from '../../../../store/appStore/appSelectors';
import WebsiteReservedButtons from '../../../rewards/Proposition/WebsiteReservedButtons/WebsiteReservedButtons';

import './Proposition.less';

const PropositionFooter = ({ type, openDetailsModal, proposition, getProposition, intl }) => {
  const dispatch = useDispatch();
  const authUserName = useSelector(getAuthenticatedUserName);
  const isWaivio = useSelector(getIsWaivio);

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(proposition?.commentsCount);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    if (showComment) setShowComment(false);
  }, [location.search]);

  const getCommentsList = async (editing, permlink, value) => {
    setCommentsLoading(true);
    if (editing) {
      setComments(
        comments.reduce((acc, curr) => {
          if (curr.permlink === permlink) return [...acc, { ...curr, body: value }];

          return [...acc, curr];
        }, []),
      );
    } else {
      const postInfo = await getPostCommentsFromApi({
        author: proposition?.userName,
        permlink: proposition?.reservationPermlink,
        userName: authUserName,
        category: config.appName,
      });
      const commensList = Object.values(postInfo.content).filter(
        comment => comment.permlink !== proposition?.reservationPermlink,
      );

      await setComments(commensList);
      await setShowComment(true);
      await setCommentsCount(commensList?.length);
    }

    await setCommentsLoading(false);
  };

  const handleCommentsClick = async () => {
    if (!showComment && commentsCount) {
      getCommentsList();
    } else {
      setShowComment(false);
    }
  };

  const sendComment = (parentP, commentValue) => {
    setLoading(true);

    return dispatch(sendCommentForReward(proposition, commentValue)).then(comment => {
      const commentList = [
        ...comments,
        {
          body: commentValue,
          created: moment()
            .utc()
            .format('YYYY-MM-DDTHH:mm:ss'),
          author: authUserName,
          active_votes: [],
          ...comment,
        },
      ];

      setComments(commentList);
      setCommentsCount(commentList?.length);
      setLoading(false);
    });
  };

  const getFooter = () => {
    switch (type) {
      case 'reserved':
        return (
          <React.Fragment>
            <div className="Proposition-new__footer-container">
              <div className="Proposition-new__button-container">
                <b>Reserved</b>
                <i className="iconfont icon-message_fill" onClick={handleCommentsClick} />
                {commentsCount}
                <RewardsPopover proposition={proposition} getProposition={getProposition} />
              </div>
              <Button type="primary" onClick={openDetailsModal}>
                Write review
              </Button>
            </div>
            {showComment &&
              comments.map(comment => (
                <CommentCard
                  key={`${comment?.author}/${comment?.permlink}`}
                  comment={comment}
                  getMessageHistory={getCommentsList}
                  proposition={proposition}
                />
              ))}
            <QuickCommentEditor onSubmit={sendComment} isLoading={loading} />
          </React.Fragment>
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
                {commentsLoading ? (
                  <Icon type="loading" />
                ) : (
                  <i className="iconfont icon-message_fill" onClick={handleCommentsClick} />
                )}
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
            {showComment &&
              comments.map(comment => (
                <CommentCard
                  key={`${comment?.author}/${comment?.permlink}`}
                  comment={comment}
                  getMessageHistory={getCommentsList}
                  proposition={proposition}
                />
              ))}
            <QuickCommentEditor onSubmit={sendComment} isLoading={loading} />
          </React.Fragment>
        );

      default:
        return isWaivio ? (
          <div className="Proposition-new__footer-container">
            <Button type="primary" onClick={openDetailsModal}>
              <b>Reserve</b> Your Reward
            </Button>{' '}
            for {proposition?.countReservationDays} days
          </div>
        ) : (
          <WebsiteReservedButtons
            dish={{ ...proposition, ...proposition.object, parent: proposition.requiredObject }}
            restaurant={proposition.requiredObject}
            handleReserve={() => dispatch(reserveProposition(proposition, authUserName))}
            isNewReward
          />
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
  getProposition: PropTypes.func,
  proposition: PropTypes.shape({
    reviewStatus: PropTypes.string,
    userName: PropTypes.string,
    commentsCount: PropTypes.number,
    countReservationDays: PropTypes.number,
    reservationPermlink: PropTypes.string,
    fraudCodes: PropTypes.arrayOf(PropTypes.number),
    object: PropTypes.shape(),
    requiredObject: PropTypes.shape(),
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

PropositionFooter.defaultProps = {
  getProposition: noop,
};

export default injectIntl(PropositionFooter);
