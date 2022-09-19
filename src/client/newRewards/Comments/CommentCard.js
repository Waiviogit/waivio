/* eslint-disable */
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import BTooltip from '../../components/BTooltip';
import { FormattedDate, FormattedMessage, FormattedRelative, FormattedTime } from 'react-intl';
import BodyContainer from '../../containers/Story/BodyContainer';
import classNames from 'classnames';
import { Icon } from 'antd';
import QuickCommentEditor from '../../components/Comments/QuickCommentEditor';
import { map } from 'lodash';
import React from 'react';

const CommentCard = ({ comment }) => {
  return (
    <div className="Comment">
      <Link to={`/@${comment.author}`} style={{ height: 32 }}>
        <Avatar username={comment.author} size={32} />
      </Link>
      <div className="Comment__text">
        <Link to={`/@${comment.author}`}>
          <span className="username">{comment.author}</span>
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
              {pendingLike ? <Icon type="loading" /> : <i className="iconfont icon-praise_fill" />}
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
  );
};

export default CommentCard;
