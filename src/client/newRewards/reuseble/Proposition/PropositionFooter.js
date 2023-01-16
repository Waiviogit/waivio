import React, { useEffect, useState } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, noop } from 'lodash';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useLocation } from 'react-router';
import classnames from 'classnames';

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
import { getDaysLeftForNew } from '../../../rewards/rewardsHelper';
import ReservedButtons from '../../../rewards/Proposition/WebsiteReservedButtons/ReservedButtons';

import './Proposition.less';

const PropositionFooter = ({ type, openDetailsModal, proposition, getProposition, intl }) => {
  const dispatch = useDispatch();
  const authUserName = useSelector(getAuthenticatedUserName);
  const isWaivio = useSelector(getIsWaivio);
  const propositionFooterContainerClassList = classnames('Proposition-new__footer-container', {
    'Proposition-new__footer-container--noEligible': proposition.notEligible,
    'Proposition-new__footer-container--reserved': type === 'reserved',
  });

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(proposition?.commentsCount);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    if (showComment) setShowComment(false);
    if (location.search.includes(proposition.reservationPermlink)) handleCommentsClick();
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
        author: proposition?.reserved ? authUserName : proposition?.rootName,
        permlink: proposition?.reservationPermlink,
        userName: authUserName,
        category: config.appName,
      });

      const commensList = Object.values(postInfo?.content)?.filter(
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
      ].sort((a, b) => b.created - a.created);

      setComments(commentList);
      setCommentsCount(commentList?.length);
      setLoading(false);
    });
  };

  const handleReserveForPopup = () => dispatch(reserveProposition(proposition, authUserName));

  const getFooter = () => {
    switch (type) {
      case 'reserved':
        return (
          <React.Fragment>
            <div className={propositionFooterContainerClassList}>
              <div className="Proposition-new__button-container">
                <b>Reserved</b>
                <b>
                  <span className="Proposition-new__minus">{'-'}</span>
                  {getDaysLeftForNew(
                    proposition?.reservationCreatedAt,
                    proposition?.countReservationDays,
                  )}{' '}
                  days left
                </b>
                <i className="iconfont icon-message_fill" onClick={handleCommentsClick} />
                {Boolean(commentsCount) && (
                  <span className="Proposition-new__commentCounter">{commentsCount}</span>
                )}
                <RewardsPopover proposition={proposition} getProposition={getProposition} />
              </div>
              {proposition.guideName === authUserName ? (
                <div className={'Proposition-new__userCard'}>
                  <Avatar size={24} username={proposition?.userName} />
                  <a href={`/@${proposition?.userName}`}>{proposition?.userName}</a>
                </div>
              ) : (
                <Button type="primary" onClick={openDetailsModal}>
                  <b>Submit</b> <span className="Proposition-new__yourRewards">Dish Photos</span>
                </Button>
              )}
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
            <div className={propositionFooterContainerClassList}>
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
                {Boolean(commentsCount) && (
                  <span className="Proposition-new__commentCounter">{commentsCount}</span>
                )}
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
          <ReservedButtons
            handleReserveForPopover={handleReserveForPopup}
            handleReserve={() => {
              openDetailsModal();

              return Promise.resolve();
            }}
          />
        ) : (
          <WebsiteReservedButtons
            dish={{
              ...proposition,
              reserved: type === 'reserved',
              ...proposition.object,
              parent: proposition?.object?.parent,
            }}
            handleReserve={handleReserveForPopup}
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
    rootName: PropTypes.string,
    guideName: PropTypes.string,
    notEligible: PropTypes.bool,
    reserved: PropTypes.bool,
    commentsCount: PropTypes.number,
    countReservationDays: PropTypes.number,
    reservationPermlink: PropTypes.string,
    reservationCreatedAt: PropTypes.string,
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
