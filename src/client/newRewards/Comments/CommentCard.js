import { Link } from 'react-router-dom';
import {
  FormattedDate,
  FormattedMessage,
  FormattedRelative,
  FormattedTime,
  injectIntl,
} from 'react-intl';
import classNames from 'classnames';
import { Icon, message } from 'antd';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Avatar from '../../components/Avatar';
import BTooltip from '../../components/BTooltip';
import BodyContainer from '../../containers/Story/BodyContainer';
import QuickCommentEditor from '../../components/Comments/QuickCommentEditor';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import { voteComment } from '../../../store/postsStore/postActions';
import { getDownvotesQuontity, getUpvotesQuontity } from '../../../common/helpers/voteHelpers';
import { sendCommentForReward } from '../../../store/newRewards/newRewardsActions';
import { parseJSON } from '../../../common/helpers/parseJSON';

const CommentCard = ({ comment, intl, getMessageHistory, proposition }) => {
  const dispatch = useDispatch();
  const user = useSelector(getAuthenticatedUserName);
  const isGuest = useSelector(isGuestUser);
  const [pendingLike, setPendigLike] = useState(false);
  const [pendingSend, setPendigSend] = useState(false);
  const [pendingDisLike, setPendingDisLike] = useState(false);
  const [editing, setEditing] = useState(false);
  const author = isGuest ? parseJSON(comment.json_metadata)?.comment?.userId : comment.author;
  const editable = author === user;
  const isLiked = comment.active_votes.some(vote => vote.voter === user && +vote.percent > 0);
  const isDisliked = comment.active_votes.some(vote => vote.voter === user && +vote.percent < 0);
  const upvotesQuontity = getUpvotesQuontity(comment?.active_votes);
  const downvotesQuontity = getDownvotesQuontity(comment?.active_votes);

  const handleVote = (weight, setPending) => {
    setPending(true);
    dispatch(voteComment(comment, weight))
      .then(() => {
        setTimeout(
          () =>
            getMessageHistory().finally(() => {
              setPending(false);
              message.success('Comment submitted');
            }),
          10000,
        );
      })
      .catch(() => setPending(false));
  };

  const handleDislikeClick = () => {
    const weight = isDisliked ? 0 : -10000;

    handleVote(weight, setPendingDisLike);
  };

  const handleLikeClick = () => {
    const weight = isLiked ? 0 : 10000;

    handleVote(weight, setPendigLike);
  };

  const handleEditClick = () => setEditing(!editing);

  const handleSendComment = async (parentP, commentValue) => {
    setPendigSend(true);
    await dispatch(sendCommentForReward(proposition, commentValue, editing, comment));
    await getMessageHistory(editing, comment.permlink, commentValue);
    await setPendigSend(false);
    await setEditing(false);
    await setPendigSend(false);
  };

  return (
    <div className="Comment">
      <Link to={`/@${author}`} style={{ height: 32 }}>
        <Avatar username={author} size={32} />
      </Link>
      <div className="Comment__text">
        <Link to={`/@${author}`}>
          <span className="username">{author}</span>
        </Link>
        <span className="Comment__date">
          <BTooltip
            title={
              <span>
                <FormattedDate value={`${comment.created}Z`} />{' '}
                <FormattedTime value={`${comment.created}Z`} />
              </span>
            }
          >
            <FormattedRelative value={`${comment.created}Z`} />
          </BTooltip>
        </span>
        <div className="Comment__content">
          <BodyContainer body={comment.body} />
        </div>
        <div>
          <BTooltip title={intl.formatMessage({ id: isLiked ? 'unlike' : 'like' })}>
            <a
              role="presentation"
              className={classNames('CommentFooter__link', {
                'CommentFooter__link--active': isLiked,
              })}
              onClick={handleLikeClick}
            >
              {pendingLike ? <Icon type="loading" /> : <i className="iconfont icon-praise_fill" />}
            </a>
            {!!upvotesQuontity && upvotesQuontity}
          </BTooltip>
          <BTooltip title={intl.formatMessage({ id: 'dislike', defaultMessage: 'Dislike' })}>
            <a
              role="presentation"
              className={classNames('CommentFooter__link', {
                'CommentFooter__link--active': isDisliked,
              })}
              onClick={handleDislikeClick}
            >
              {pendingDisLike ? (
                <Icon type="loading" />
              ) : (
                <i className="iconfont icon-praise_fill Comment__icon_dislike" />
              )}
              {!!downvotesQuontity && downvotesQuontity}
            </a>
          </BTooltip>
          {/* {user.name && ( */}
          {/*  <span> */}
          {/*    <span className="CommentFooter__bullet" /> */}
          {/*    <a */}
          {/*      role="presentation" */}
          {/*      className={classNames('CommentFooter__link', { */}
          {/*        // 'CommentFooter__link--active': replying, */}
          {/*      })} */}
          {/*      // onClick={handleReplyClick} */}
          {/*    > */}
          {/*      <FormattedMessage id="reply" defaultMessage="Reply" /> */}
          {/*    </a> */}
          {/*  </span> */}
          {/* )} */}
          {editable && (
            <span>
              <span className="CommentFooter__bullet" />
              <a
                role="presentation"
                className={classNames('CommentFooter__link', {
                  'CommentFooter__link--active': editing,
                })}
                onClick={handleEditClick}
              >
                <FormattedMessage id="edit" defaultMessage="Edit" />
              </a>
            </span>
          )}
        </div>
        {/* {replying && ( */}
        {/*  <QuickCommentEditor */}
        {/*    parentPost={commentObj} */}
        {/*    username={user.name} */}
        {/*    onSubmit={handleSubmitComment} */}
        {/*    isLoading={loading} */}
        {/*    inputValue={commentFormText} */}
        {/*    submitted={commentSubmitted} */}
        {/*  /> */}
        {/* )} */}
        {editing && (
          <QuickCommentEditor
            parentPost={comment}
            onSubmit={handleSendComment}
            isLoading={pendingSend}
            inputValue={comment.body}
          />
        )}
      </div>
    </div>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.shape({
    body: PropTypes.string,
    active_votes: PropTypes.arrayOf(),
    author: PropTypes.string,
    json_metadata: PropTypes.string,
    created: PropTypes.string,
    permlink: PropTypes.string,
  }).isRequired,
  proposition: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  getMessageHistory: PropTypes.func.isRequired,
};

export default injectIntl(CommentCard);
