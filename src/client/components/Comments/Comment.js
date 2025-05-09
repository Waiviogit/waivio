import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import {
  injectIntl,
  FormattedRelative,
  FormattedDate,
  FormattedTime,
  FormattedMessage,
} from 'react-intl';
import { Tag, message } from 'antd';
import BTooltip from '../../components/BTooltip';
import formatter from '../../../common/helpers/steemitFormatter';
import { MAXIMUM_UPLOAD_SIZE_HUMAN } from '../../../common/helpers/image';
import { sortComments } from '../../../common/helpers/sortHelpers';
import CommentForm from './CommentForm';
import QuickCommentEditor from './QuickCommentEditor';
import Avatar from '../Avatar';
import BodyContainer from '../../containers/Story/BodyContainer';
import CommentFooter from '../CommentFooter/CommentFooter';
import HiddenCommentMessage from './HiddenCommentMessage';
import WeightTag from '../WeightTag';
import { parseJSON } from '../../../common/helpers/parseJSON';

import './Comment.less';

@injectIntl
class Comment extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    comment: PropTypes.shape().isRequired,
    isQuickComment: PropTypes.bool.isRequired,
    parent: PropTypes.shape().isRequired,
    sort: PropTypes.oneOf(['BEST', 'NEWEST', 'OLDEST', 'AUTHOR_REPUTATION']),
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    sliderMode: PropTypes.bool,
    rootPostAuthor: PropTypes.string,
    commentsChildren: PropTypes.shape(),
    pendingVotes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        percent: PropTypes.number,
      }),
    ),
    depth: PropTypes.number,
    notify: PropTypes.func,
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    handleHideComment: PropTypes.func,
    onSendComment: PropTypes.func,
  };

  static defaultProps = {
    sort: 'BEST',
    sliderMode: false,
    rootPostAuthor: undefined,
    commentsChildren: undefined,
    pendingVotes: [],
    depth: 0,
    notify: () => {},
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onSendComment: () => {},
    handleHideComment: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      replyOpen: false,
      editOpen: false,
      collapsed: props.isQuickComment && props.depth === 1 && props.comment.children,
      showCommentFormLoading: false,
      commentFormText: '',
      showHiddenComment: false,
    };

    this.handleSubmitComment = this.handleSubmitComment.bind(this);
  }

  componentDidMount() {
    const { comment } = this.props;
    const { hash } = window && window.location;
    const anchorLink = `#@${comment.author}/${comment.permlink}`;

    if (hash.indexOf(anchorLink) === 0 || (comment.focus && !this.props.isQuickComment)) {
      if (hash.endsWith('-edit')) {
        this.handleEditClick();
      }
    }
  }

  setSelf = c => {
    this.self = c;
  };

  focus = () => {
    if (this.self && window) {
      this.self.scrollIntoView(true);
      if (typeof document !== 'undefined') document.body.scrollTop -= 54 * 2; // twice the height of Topnav
      this.self.classList.add('Comment--focus');
    }
  };

  handleAnchorClick = () => this.focus();

  handleReplyClick = () =>
    this.setState({
      replyOpen: !this.state.replyOpen,
      editOpen: !this.state.replyOpen ? false : this.state.editOpen,
    });

  handleEditClick = () =>
    this.setState({
      editOpen: !this.state.editOpen,
      replyOpen: !this.state.editOpen ? false : this.state.replyOpen,
    });

  handleCollapseClick = () =>
    this.setState({
      collapsed: !this.state.collapsed,
    });

  handleImageInserted = (blob, callback, errorCallback) => {
    const { user } = this.props;

    if (!user.name) return;

    const formData = new FormData();

    formData.append('files', blob);

    fetch(`https://busy-img.herokuapp.com/@${user.name}/uploads`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(res => callback(res.secure_url, blob.name))
      .catch(() => errorCallback());
  };

  handleImageInvalid = () => {
    const { formatMessage } = this.props.intl;

    this.props.notify(
      formatMessage(
        {
          id: 'notify_uploading_image_invalid',
          defaultMessage:
            'This file is invalid. Only image files with maximum size of {size} are supported',
        },
        { size: MAXIMUM_UPLOAD_SIZE_HUMAN },
      ),
      'error',
    );
  };

  handleSubmitComment(parentPost, commentValue, isUpdating, originalComment) {
    const { intl } = this.props;

    this.setState({ showCommentFormLoading: true });

    return this.props
      .onSendComment(parentPost, commentValue, isUpdating, originalComment)
      .then(() => {
        if (isUpdating) {
          message.success(
            intl.formatMessage({
              id: 'notify_comment_updated',
              defaultMessage: 'Comment updated',
            }),
          );
        } else {
          message.success(
            intl.formatMessage({
              id: 'notify_comment_sent',
              defaultMessage: 'Comment submitted',
            }),
          );
        }

        this.setState({
          showCommentFormLoading: false,
          replyOpen: false,
          editOpen: false,
          commentFormText: '',
        });

        return true;
      })
      .catch(() => {
        this.setState({
          showCommentFormLoading: false,
          replyOpen: true,
          editOpen: false,
          commentFormText: commentValue,
        });

        return {
          error: true,
        };
      });
  }

  handleEditComment = (parentPost, commentValue) =>
    this.handleSubmitComment(parentPost, commentValue, true, this.props.comment);

  handleShowHiddenComment = () => {
    this.setState({
      showHiddenComment: true,
    });
  };

  render() {
    const {
      user,
      intl,
      comment,
      parent,
      sort,
      rootPostAuthor,
      commentsChildren,
      pendingVotes,
      depth,
      sliderMode,
      rewardFund,
      defaultVotePercent,
      isQuickComment,
    } = this.props;
    let isGuest = false;

    if (comment.json_metadata.includes('"social":')) {
      const jsonMetadata = parseJSON(comment.json_metadata);

      comment.authorGuest = jsonMetadata.comment.userId;
      isGuest = true;
    }
    const { showHiddenComment } = this.state;
    const anchorId = `@${comment.author}/${comment.permlink}`;
    const anchorLink = `${comment.url.slice(0, comment.url.indexOf('#'))}#${anchorId}`;

    const editable = isGuest ? comment.authorGuest === user.name : comment.author === user.name;
    const commentAuthorReputation = isGuest ? 0 : formatter.reputation(comment.author_reputation);
    const showCommentContent = commentAuthorReputation >= 0 || showHiddenComment;
    let content = null;

    const commentEditor = props => {
      if (isQuickComment) {
        return <QuickCommentEditor {...props} />;
      }

      return (
        <CommentForm
          isEdit={this.state.editOpen}
          isReply={this.state.replyOpen}
          currentComment={this.props.comment}
          {...props}
          onClose={this.handleEditClick}
        />
      );
    };

    if (this.state.editOpen) {
      content = commentEditor({
        isEdit: this.state.editOpen,
        parentPost: parent,
        username: '',
        inputValue: comment.body,
        onSubmit: this.handleEditComment,
        onImageInserted: this.handleImageInserted,
        onImageInvalid: this.handleImageInvalid,
      });
    } else {
      content = this.state.collapsed ? (
        <div className="Comment__content__collapsed">
          <FormattedMessage id="comment_collapsed" defaultMessage="Comment collapsed" />
        </div>
      ) : (
        <BodyContainer body={comment.body} isPost jsonMetadata={comment.json_metadata} />
      );
    }

    const avatarSize = comment.depth === 1 ? 40 : 32;
    const author = isGuest ? comment.authorGuest : comment.author;

    return (
      <div ref={this.setSelf} className="Comment" id={anchorId}>
        <span
          role="presentation"
          className="Comment__visibility"
          onClick={this.handleCollapseClick}
        >
          {this.state.collapsed ? (
            <i className="iconfont icon-addition" />
          ) : (
            <i className="iconfont icon-offline" />
          )}
        </span>
        <Link to={`/@${author}`} style={{ height: avatarSize }}>
          <Avatar username={author} size={avatarSize} />
        </Link>
        <div className="Comment__text">
          <Link to={`/@${author}`}>
            <span className="username">{author}</span>
            <span className="weight">
              <WeightTag weight={comment.author_reputation} />
            </span>
            {author === rootPostAuthor && (
              <BTooltip
                title={intl.formatMessage({
                  id: 'original_poster',
                  defaultMessage: 'Original poster',
                })}
              >
                <Tag color="#4f545c">OP</Tag>
              </BTooltip>
            )}
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
              <Link to={anchorLink} className="Comment__anchor" onClick={this.handleAnchorClick}>
                <FormattedRelative value={`${comment.created}Z`} />
              </Link>
            </BTooltip>
          </span>
          <div className="Comment__content">
            {showCommentContent ? (
              content
            ) : (
              <HiddenCommentMessage onClick={this.handleShowHiddenComment} />
            )}
          </div>
          <CommentFooter
            editable={editable}
            editing={this.state.editOpen}
            replying={this.state.replyOpen}
            user={user}
            comment={comment}
            pendingVotes={pendingVotes}
            rewardFund={rewardFund}
            sliderMode={sliderMode}
            defaultVotePercent={defaultVotePercent}
            onLikeClick={this.props.onLikeClick}
            onDislikeClick={this.props.onDislikeClick}
            handleHideComment={this.props.handleHideComment}
            onReplyClick={this.handleReplyClick}
            onEditClick={this.handleEditClick}
          />
          {this.state.replyOpen &&
            user.name &&
            commentEditor({
              isEdit: this.state.editOpen,
              username: user.name,
              parentPost: comment,
              isSmall: comment.depth !== 1,
              onSubmit: this.handleSubmitComment,
              isLoading: this.state.showCommentFormLoading,
              inputValue: this.state.commentFormText,
              onImageInserted: this.handleImageInserted,
              onImageInvalid: this.handleImageInvalid,
            })}
          <div
            className={classNames('Comment__replies', {
              'Comment__replies--no-indent': depth >= 1,
              'Comment__replies--never-indent': depth >= 5,
            })}
          >
            {!this.state.collapsed &&
              commentsChildren &&
              commentsChildren[comment.id] &&
              sortComments(commentsChildren[comment.id], sort).map(
                child =>
                  child && (
                    <Comment
                      key={child.id}
                      user={user}
                      depth={depth + 1}
                      intl={this.props.intl}
                      comment={child}
                      isQuickComment={this.props.isQuickComment}
                      parent={comment}
                      sort={sort}
                      pendingVotes={pendingVotes}
                      rootPostAuthor={rootPostAuthor}
                      commentsChildren={commentsChildren}
                      notify={this.props.notify}
                      rewardFund={rewardFund}
                      sliderMode={sliderMode}
                      defaultVotePercent={defaultVotePercent}
                      onLikeClick={this.props.onLikeClick}
                      onDislikeClick={this.props.onDislikeClick}
                      onSendComment={this.props.onSendComment}
                    />
                  ),
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Comment;
