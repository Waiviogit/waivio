import React, { memo, useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { find, get, pick, isEmpty, times, compact, orderBy, map, filter, includes } from 'lodash';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Icon, message } from 'antd';
import {
  FormattedDate,
  FormattedMessage,
  FormattedRelative,
  FormattedTime,
  injectIntl,
} from 'react-intl';
import { voteHistoryPost } from '../../store/postsStore/postActions';
import Avatar from '../../components/Avatar';
import BTooltip from '../../components/BTooltip';
import BodyContainer from '../../containers/Story/BodyContainer';
import QuickCommentEditor from '../../components/Comments/QuickCommentEditor';
import * as commentsActions from '../../store/commentsStore/commentsActions';

const CommentsMessages = memo(
  ({
    show,
    post,
    user,
    defaultVotePercent,
    intl,
    onActionInitiated,
    currentComment,
    getMessageHistory,
    parent,
    getReservedComments,
    matchPath,
    isGuest,
    proposition,
    match,
  }) => {
    const [replying, setReplyOpen] = useState(false);
    const [editing, setEditOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pendingLike, setPendingLike] = useState(false);
    const [pendingDisLike, setPendingDisLike] = useState(false);
    const [commentFormText, setCommentFormText] = useState('');
    const [commentSubmitted, setCommentSubmitted] = useState(false);
    const dispatch = useDispatch();

    const commentObj = useMemo(() => currentComment || get(post, ['firstAppeal']), [
      currentComment,
      post,
    ]);

    if (!commentObj) return null;

    const {
      author,
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

    const currentUser = filter(proposition.users, usersItem => usersItem.name === user.name);

    const commentAuthor = useMemo(() => {
      if (get(commentObj, 'guestInfo')) {
        return get(commentObj, ['guestInfo', 'userId'], '');
      } else if (includes(commentObj.author, 'guest')) {
        return get(currentUser, ['0', 'name']) || get(proposition, ['users', '0', 'name']);
      }

      return get(commentObj, ['author']);
    }, [commentObj, match.params.filterKey, currentUser, proposition]);

    const time = moment.parseZone(commentCreated).valueOf();

    const userVote = find(activeVotes, { voter: user.name });

    const onSendComment = useCallback(
      (parentPost, commentBody, isUpdating, originalPost, parentAuthorIfGuest) =>
        dispatch(
          commentsActions.sendCommentMessages(
            parentPost,
            commentBody,
            isUpdating,
            originalPost,
            parentAuthorIfGuest,
          ),
        ),
      [dispatch],
    );

    const handleReplyClick = useCallback(() => {
      setReplyOpen(!replying);
      setEditOpen(!replying ? false : editing);
    }, [replying, editing, setReplyOpen, setEditOpen]);

    const userUpVoted = userVote && userVote.percent > 0;
    const userDownVoted = userVote && userVote.percent < 0;
    const editable = author === user.name;

    let likeTooltip = <span>{intl.formatMessage({ id: 'like' })}</span>;

    if (userUpVoted) {
      likeTooltip = <span>{intl.formatMessage({ id: 'unlike', defaultMessage: 'Unlike' })}</span>;
    }

    const onLikeClick = useCallback(
      id => {
        const currentPost = find(post.all, obj => obj.post_id === id);
        const weight = !userVote || userVote.percent <= 0 ? 10000 : 0;

        dispatch(voteHistoryPost(currentPost, author, permlink, weight))
          .then(() => {
            setTimeout(() => getMessageHistory().finally(() => setPendingLike(false)), 10000);
          })
          .catch(() => setPendingLike(false));
      },
      [post.all, userVote, dispatch, author, permlink, getMessageHistory],
    );

    const handleLikeClick = id => {
      setPendingLike(true);
      onLikeClick(id);
    };

    const onDislikeClick = useCallback(
      id => {
        const currentPost = find(post.all, obj => obj.post_id === id);
        const weight = !userVote || userVote.percent >= 0 ? -10000 : 0;

        dispatch(voteHistoryPost(currentPost, author, permlink, weight))
          .then(() => {
            setTimeout(() => getMessageHistory().finally(() => setPendingDisLike(false)), 10000);
          })
          .catch(() => setPendingDisLike(false));
      },
      [post.all, userVote, dispatch, author, permlink, getMessageHistory],
    );

    const handleDislikeClick = id => {
      setPendingDisLike(true);
      onDislikeClick(id);
    };

    const handleEditClick = useCallback(() => {
      setEditOpen(!editing);
      setReplyOpen(!editing ? false : replying);
    }, [setEditOpen, setReplyOpen, editing, replying]);

    const parentPost = useMemo(() => (!isEmpty(parent) ? parent : commentObj), [
      parent,
      commentObj,
    ]);

    const onCommentSend = useCallback(() => {
      const { category, parentAuthor, parentPermlink } = parentPost;

      return isGuest || !matchPath
        ? getReservedComments({ category, author: parentAuthor, permlink: parentPermlink })
        : getMessageHistory();
    }, [parentPost, matchPath, getReservedComments, getMessageHistory]);

    const handleSubmitComment = useCallback(
      (parentP, commentValue) => {
        const parentComment = parentP;

        if (parentComment.author_original) parentComment.author = parentComment.author_original;
        const parentAuthorIfGuest = parentComment.guestInfo ? parentComment.author : '';

        setLoading(true);

        return onSendComment(parentComment, commentValue, false, commentObj, parentAuthorIfGuest)
          .then(() => {
            setTimeout(() => {
              onCommentSend().then(() => {
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
              });
            }, 12000);
          })
          .catch(() => {
            setCommentFormText(commentValue);
            setLoading(false);

            return {
              error: true,
            };
          });
      },
      [commentObj, intl, onSendComment, onCommentSend],
    );

    const getChildren = useCallback((obj, comments, index) => {
      const replyKey = get(obj, ['replies', index]);

      return get(comments, ['all', replyKey]);
    }, []);

    const handleEditComment = useCallback(
      (parentP, commentValue) => {
        setLoading(true);
        const parentPostObj = {
          ...parentP,
          permlink: parentP.parent_permlink,
        };

        return onSendComment(parentPostObj, commentValue, true, commentObj).then(() => {
          setTimeout(
            () =>
              onCommentSend().then(() => {
                message.success(
                  intl.formatMessage({
                    id: 'notify_comment_updated',
                    defaultMessage: 'Comment updated',
                  }),
                );
                setLoading(false);
                setEditOpen(false);
              }),
            12000,
          );
        });
      },
      [commentObj, intl, onSendComment, onCommentSend],
    );

    const childrenArr = useMemo(() => {
      if (!children) {
        return null;
      }

      const currentChildren = compact(
        times(children, index => getChildren(commentObj, post, index)),
      );

      return orderBy(currentChildren, ['post_id'], ['desc']);
    }, [children, commentObj, getChildren, post]);

    return (
      <React.Fragment>
        {show && (
          <div className="Comment">
            <Link to={`/@${commentAuthor}`} style={{ height: 32 }}>
              <Avatar username={commentAuthor} size={32} />
            </Link>
            <div className="Comment__text">
              <Link to={`/@${commentAuthor}`}>
                <span className="username">{commentAuthor}</span>
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
                  <FormattedRelative value={time} />
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
                  parentPost={commentObj}
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
                {childrenArr &&
                  map(childrenArr, currentChild => (
                    <CommentsMessages
                      key={`comments-${currentChild.post_id}`}
                      {...{
                        intl,
                        show,
                        user,
                        post,
                        defaultVotePercent,
                        onActionInitiated,
                        parent: parentPost,
                        currentComment: currentChild,
                        onLikeClick,
                        getMessageHistory,
                        getReservedComments,
                        matchPath,
                        isGuest,
                        proposition,
                        match,
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  },
);

CommentsMessages.propTypes = {
  post: PropTypes.shape().isRequired,
  show: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
  defaultVotePercent: PropTypes.number,
  intl: PropTypes.shape().isRequired,
  onActionInitiated: PropTypes.func,
  currentComment: PropTypes.shape().isRequired,
  parent: PropTypes.shape(),
  getMessageHistory: PropTypes.func,
  getReservedComments: PropTypes.func,
  matchPath: PropTypes.string,
  isGuest: PropTypes.bool,
  proposition: PropTypes.shape(),
  match: PropTypes.shape(),
};

CommentsMessages.defaultProps = {
  parent: {},
  defaultVotePercent: 0,
  matchPath: '',
  isGuest: false,
  proposition: {},
  match: {},
  onActionInitiated: () => {},
  getReservedComments: () => {},
  getMessageHistory: () => {},
};

export default injectIntl(CommentsMessages);
