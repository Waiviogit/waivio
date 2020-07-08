import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { find, get, pick } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Icon, message } from 'antd';
import {
  FormattedDate,
  FormattedMessage,
  FormattedRelative,
  FormattedTime,
  injectIntl,
} from 'react-intl';
import { voteHistoryPost } from '../../post/postActions';
import Avatar from '../../components/Avatar';
import WeightTag from '../../components/WeightTag';
import BTooltip from '../../components/BTooltip';
import BodyContainer from '../../containers/Story/BodyContainer';
import { getCommentsPendingVotes } from '../../reducers';
import QuickCommentEditor from '../../components/Comments/QuickCommentEditor';
import * as commentsActions from '../../comments/commentsActions';

const Comments = ({
  show,
  post,
  user,
  defaultVotePercent,
  intl,
  onActionInitiated,
  currentComment,
  getMessageHistory,
  parent,
}) => {
  const [replying, setReplyOpen] = useState(false);
  const [editing, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentFormText, setCommentFormText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const dispatch = useDispatch();
  const pendingVotes = useSelector(getCommentsPendingVotes);

  const commentObj = useMemo(() => currentComment || get(post, ['firstAppeal']), [
    currentComment,
    post,
  ]);

  const {
    author,
    author_reputation: authorReputation,
    created: commentCreated,
    body: postBody,
    active_votes: activeVotes,
    post_id: postId,
    children,
    permlink,
    depth,
  } = useMemo(
    () =>
      pick(commentObj, [
        'author',
        'author_reputation',
        'created',
        'body',
        'active_votes',
        'post_id',
        'children',
        'permlink',
        'depth',
      ]),
    [commentObj],
  );

  const userVote = find(activeVotes, { voter: user.name });

  const onSendComment = useCallback(
    (parentPost, commentBody, isUpdating, originalPost) =>
      dispatch(commentsActions.sendComment(parentPost, commentBody, isUpdating, originalPost)),
    [dispatch, commentsActions.sendComment],
  );

  const handleReplyClick = useCallback(() => {
    setReplyOpen(!replying);
    setEditOpen(!replying ? false : editing);
  }, [replying, editing, setReplyOpen, setEditOpen]);

  const userUpVoted = userVote && userVote.percent > 0;
  const userDownVoted = userVote && userVote.percent < 0;
  const pendingVote = find(pendingVotes, { id: postId });
  const pendingLike = pendingVote && (pendingVote.percent > 0 || pendingVote.vote === 'like');
  const pendingDisLike = pendingVote && (pendingVote.percent < 0 || pendingVote.vote === 'dislike');
  const editable = author === user.name;

  let likeTooltip = <span>{intl.formatMessage({ id: 'like' })}</span>;
  if (userUpVoted) {
    likeTooltip = <span>{intl.formatMessage({ id: 'unlike', defaultMessage: 'Unlike' })}</span>;
  }

  const onLikeClick = (id, weight = 10000) => {
    const currentPost = find(post.all, obj => obj.post_id === id);
    if (!userVote || userVote.percent <= 0) {
      dispatch(voteHistoryPost(currentPost, author, permlink, weight)).then(res =>
        console.log('res', res),
      );
    } else if (userVote.percent > 0) {
      dispatch(voteHistoryPost(currentPost, author, permlink, 0));
    }
    // setTimeout(() => getMessageHistory(), 8000);
  };

  const handleLikeClick = id => {
    setIsLiked(!isLiked);
    onLikeClick(id);
  };

  const onDislikeClick = id => {
    const currentPost = find(post.all, obj => obj.post_id === id);
    if (!userVote || userVote.percent < 0) {
      dispatch(commentsActions.likeHistoryComment(currentPost, 0, 'dislike'));
    } else {
      dispatch(commentsActions.likeHistoryComment(currentPost, -10000, 'dislike'));
    }
    // setTimeout(() => getMessageHistory(), 8000);
  };

  const handleDislikeClick = id => {
    setIsLiked(!isLiked);
    onDislikeClick(id);
  };

  const handleEditClick = () => {
    setEditOpen(!editing);
    setReplyOpen(!editing ? false : replying);
  };

  const handleSubmitComment = useCallback((parentP, commentValue) => {
    const parentPost = parentP;
    if (parentPost.author_original) parentPost.author = parentPost.author_original;

    setLoading(true);
    return onSendComment(parentPost, commentValue)
      .then(() => {
        message.success(
          intl.formatMessage({
            id: 'notify_comment_sent',
            defaultMessage: 'Comment submitted',
          }),
        );
        setLoading(false);
        setCommentFormText('');
        setCommentSubmitted(true);
        setReplyOpen(false);
      })
      .then(() => {
        setTimeout(() => getMessageHistory(), 8000);
      })
      .catch(() => {
        setCommentFormText(commentValue);
        setLoading(false);
        return {
          error: true,
        };
      });
  }, []);

  const getChildren = useCallback((obj, comments) => {
    const replyKey = get(obj, ['replies', '0']);
    return get(comments, ['all', replyKey]);
  }, []);

  const handleEditComment = (parentPost, commentValue) => {
    onSendComment(parentPost, commentValue, true, commentObj).then(() => {
      setEditOpen(false);
      setTimeout(() => getMessageHistory(), 10000);
    });
  };

  return (
    <React.Fragment>
      {show && (
        <div className="Comment">
          <Link to={`/@${author}`} style={{ height: 32 }}>
            <Avatar username={author} size={32} />
          </Link>
          <div className="Comment__text">
            <Link to={`/@${author}`}>
              <span className="username">{author}</span>
              <WeightTag weight={authorReputation} />
            </Link>
            <span className="Comment__date">
              <BTooltip
                title={
                  <span>
                    <FormattedDate value={`${commentCreated}Z`} />{' '}
                    <FormattedTime value={`${commentCreated}Z`} />
                  </span>
                }
              >
                <FormattedRelative value={commentCreated} />
              </BTooltip>
            </span>
            <div className="Comment__content">
              <BodyContainer body={postBody} />
            </div>
            <div>
              <BTooltip title={likeTooltip}>
                <a
                  role="presentation"
                  className={classNames('CommentFooter__link', {
                    'CommentFooter__link--active': userUpVoted,
                  })}
                  onClick={() => handleLikeClick(postId)}
                >
                  {pendingLike ? (
                    <Icon type="loading" />
                  ) : (
                    <i className="iconfont icon-praise_fill" />
                  )}
                </a>
              </BTooltip>
              <BTooltip title={intl.formatMessage({ id: 'dislike', defaultMessage: 'Dislike' })}>
                <a
                  role="presentation"
                  className={classNames('CommentFooter__link', {
                    'CommentFooter__link--active': userDownVoted,
                  })}
                  onClick={() => handleDislikeClick(postId)}
                >
                  {pendingDisLike ? (
                    <Icon type="loading" />
                  ) : (
                    <i className="iconfont icon-praise_fill Comment__icon_dislike" />
                  )}
                </a>
              </BTooltip>
              {user.name && (
                <span>
                  <span className="CommentFooter__bullet" />
                  <a
                    role="presentation"
                    className={classNames('CommentFooter__link', {
                      'CommentFooter__link--active': replying,
                    })}
                    onClick={handleReplyClick}
                  >
                    <FormattedMessage id="reply" defaultMessage="Reply" />
                  </a>
                </span>
              )}
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
            {replying && (
              <QuickCommentEditor
                parentPost={commentObj}
                username={user.name}
                onSubmit={handleSubmitComment}
                isLoading={loading}
                inputValue={commentFormText}
                submitted={commentSubmitted}
              />
            )}
            {editable && editing && (
              <QuickCommentEditor
                parentPost={parent || commentObj}
                username={user.name}
                onSubmit={handleEditComment}
                isLoading={loading}
                inputValue={postBody}
                submitted={commentSubmitted}
                onClose={handleEditClick}
              />
            )}
            <div
              className={classNames('Comment__replies', {
                'Comment__replies--no-indent': depth >= 1,
                'Comment__replies--never-indent': depth >= 5,
              })}
            >
              {children && (
                <Comments
                  {...{
                    intl,
                    show,
                    user,
                    post,
                    defaultVotePercent,
                    onActionInitiated,
                    parent: commentObj,
                    currentComment: getChildren(commentObj, post),
                    onLikeClick: () => {},
                    getMessageHistory,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

Comments.propTypes = {
  post: PropTypes.shape().isRequired,
  show: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
  defaultVotePercent: PropTypes.number.isRequired,
  intl: PropTypes.shape().isRequired,
  onActionInitiated: PropTypes.func.isRequired,
  currentComment: PropTypes.shape().isRequired,
  parent: PropTypes.shape().isRequired,
  getMessageHistory: PropTypes.func.isRequired,
};

export default injectIntl(Comments);
