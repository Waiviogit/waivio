import { map, isEmpty, get, toLower } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage,
  FormattedRelative,
  FormattedDate,
  FormattedTime,
} from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { Tag } from 'antd';
import {
  isPostDeleted,
  isPostTaggedNSFW,
  dropCategory,
  isBannedPost,
  replaceBotWithGuestName,
} from '../../helpers/postHelpers';
import BTooltip from '../BTooltip';
import StoryPreview from './StoryPreview';
import StoryFooter from '../StoryFooter/StoryFooter';
import Avatar from '../Avatar';
import NSFWStoryPreviewMessage from './NSFWStoryPreviewMessage';
import DMCARemovedMessage from './DMCARemovedMessage';
import ObjectAvatar from '../ObjectAvatar';
import PostedFrom from './PostedFrom';
import WeightTag from '../WeightTag';
import { getObjectName } from '../../helpers/wObjectHelper';

import './Story.less';

@injectIntl
@withRouter
class Story extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    match: PropTypes.shape(),
    postState: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    showNSFWPosts: PropTypes.bool.isRequired,
    pendingLike: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingBookmark: PropTypes.bool,
    saving: PropTypes.bool,
    ownPost: PropTypes.bool,
    singlePostVew: PropTypes.bool,
    sliderMode: PropTypes.bool,
    history: PropTypes.shape(),
    showPostModal: PropTypes.func,
    votePost: PropTypes.func,
    toggleBookmark: PropTypes.func,
    reblog: PropTypes.func,
    editPost: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    push: PropTypes.func,
    pendingFlag: PropTypes.bool,
    location: PropTypes.shape().isRequired,
    followingPostAuthor: PropTypes.func.isRequired,
    pendingFollowingPostAuthor: PropTypes.func.isRequired,
    errorFollowingPostAuthor: PropTypes.func.isRequired,
  };

  static defaultProps = {
    pendingLike: false,
    pendingFlag: false,
    pendingFollow: false,
    pendingBookmark: false,
    saving: false,
    ownPost: false,
    singlePostVew: false,
    sliderMode: false,
    history: {},
    match: { params: {} },
    showPostModal: () => {},
    votePost: () => {},
    toggleBookmark: () => {},
    reblog: () => {},
    editPost: () => {},
    followUser: () => {},
    unfollowUser: () => {},
    push: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      showHiddenStoryPreview: false,
      displayLoginModal: false,
    };

    this.getDisplayStoryPreview = this.getDisplayStoryPreview.bind(this);
    this.handleShowStoryPreview = this.handleShowStoryPreview.bind(this);
    this.handlePostModalDisplay = this.handlePostModalDisplay.bind(this);
    this.handlePreviewClickPostModalDisplay = this.handlePreviewClickPostModalDisplay.bind(this);
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleReportClick = this.handleReportClick.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleFollowClick = this.handleFollowClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  getDisplayStoryPreview() {
    const { post, showNSFWPosts } = this.props;
    const { showHiddenStoryPreview } = this.state;

    if (showHiddenStoryPreview) return true;

    if (isPostTaggedNSFW(post)) {
      return showNSFWPosts;
    }

    return true;
  }

  getObjectLayout = wobj => (
    <Link
      key={wobj.author_permlink}
      to={wobj.defaultShowLink}
      title={`${this.props.intl.formatMessage({
        id: 'related_to_object',
        defaultMessage: 'Related',
      })} ${getObjectName(wobj)} ${wobj.percent ? `(${wobj.percent.toFixed(2)}%)` : ''}`}
    >
      <ObjectAvatar item={wobj} size={40} />
    </Link>
  );

  getWobjects = wobjects => {
    let i = 0;
    let objectFromCurrentPage = null;
    const returnData = map(wobjects, wobj => {
      if (wobj.author_permlink === this.props.match.params.name) {
        objectFromCurrentPage = this.getObjectLayout(wobj);

        return null;
      }

      if (i < 5) {
        i += 1;

        return this.getObjectLayout(wobj);
      }

      return null;
    });

    if (objectFromCurrentPage) {
      returnData.unshift(objectFromCurrentPage);

      if (i === 4) returnData.splice(-1, 1);
    }

    return returnData;
  };

  handleClickVote(post, postState, weight, type) {
    const { sliderMode, defaultVotePercent, votePost } = this.props;
    const author = post.root_author;

    if (sliderMode && !postState[type]) {
      votePost(post.id, author, post.permlink, weight);
    } else if (postState[type]) {
      votePost(post.id, author, post.permlink, 0);
    } else {
      votePost(post.id, author, post.permlink, defaultVotePercent);
    }
  }

  handleLikeClick(post, postState, weight = 10000) {
    this.handleClickVote(post, postState, weight, 'isLiked');
  }

  handleReportClick(post, postState, weight) {
    this.handleClickVote(post, postState, -weight, 'isReported');
  }

  handleShareClick(post) {
    this.props.reblog(post.id);
  }

  handleFollowClick(post) {
    const postId = `${post.author}/${post.permlink}`;

    this.props.pendingFollowingPostAuthor(postId);

    if (post.youFollows) {
      return this.props
        .unfollowUser(post.author)
        .then(() => this.props.followingPostAuthor(postId))
        .catch(() => this.props.errorFollowingPostAuthor(postId));
    }

    return this.props
      .followUser(post.author)
      .then(() => this.props.followingPostAuthor(postId))
      .catch(() => this.props.errorFollowingPostAuthor(postId));
  }

  handleEditClick = post => {
    const { intl } = this.props;

    if (post.depth === 0) return this.props.editPost(post, intl);

    return this.props.push(`${post.url}-edit`);
  };

  handleShowStoryPreview() {
    this.setState({
      showHiddenStoryPreview: true,
    });
  }

  handlePostModalDisplay(e) {
    e.preventDefault();
    const { post } = this.props;

    this.props.showPostModal(post);
  }

  handlePreviewClickPostModalDisplay(e) {
    e.preventDefault();

    const { post, history } = this.props;
    const isReplyPreview = isEmpty(post.title) || post.title !== post.root_title;
    const elementNodeName = toLower(get(e, 'target.nodeName', ''));
    const elementClassName = get(e, 'target.className', '');
    const showPostModal =
      elementNodeName !== 'i' && elementClassName !== 'PostFeedEmbed__playButton';
    const openInNewTab = get(e, 'metaKey', false) || get(e, 'ctrlKey', false);
    const postURL = replaceBotWithGuestName(`/@${post.id}`, post.guestInfo);

    if (isReplyPreview) {
      history.push(postURL);
    } else if (openInNewTab && showPostModal) {
      if (window) {
        const url = `${window.location.origin}${postURL}`;

        window.open(url);
      }
    } else if (showPostModal) {
      this.props.showPostModal(post);
    }
  }

  renderStoryPreview() {
    const { post } = this.props;
    const showStoryPreview = this.getDisplayStoryPreview();
    const hiddenStoryPreviewMessage = isPostTaggedNSFW(post) && (
      <NSFWStoryPreviewMessage onClick={this.handleShowStoryPreview} />
    );

    if (isBannedPost(post)) {
      return <DMCARemovedMessage />;
    }

    return showStoryPreview ? (
      <a
        href={replaceBotWithGuestName(`/@${post.id}`, post.guestInfo)}
        rel="noopener noreferrer"
        target="_blank"
        onClick={this.handlePreviewClickPostModalDisplay}
        className="Story__content__preview"
      >
        <StoryPreview post={post} />
      </a>
    ) : (
      hiddenStoryPreviewMessage
    );
  }

  render() {
    const {
      user,
      post,
      postState,
      pendingLike,
      pendingFlag,
      pendingFollow,
      pendingBookmark,
      saving,
      rewardFund,
      ownPost,
      singlePostVew,
      sliderMode,
      defaultVotePercent,
      location,
    } = this.props;
    const rebloggedUser = get(post, ['reblogged_users'], []);
    const isRebloggedPost = rebloggedUser.includes(user.name);
    const author = post.guestInfo ? post.guestInfo.userId : post.author;
    let rebloggedUI = null;

    if (isPostDeleted(post)) return <div />;

    if (isRebloggedPost) {
      rebloggedUI = (
        <div className="Story__reblog">
          <i className="iconfont icon-share1" />
          <FormattedMessage id="reblogged" defaultMessage="Reblogged" />
        </div>
      );
    } else if (
      (post.checkForFollow && post.checkForFollow.youFollows) ||
      (location.pathname === `/@${post.reblogged_by}` &&
        location.pathname !== `/@${post.author}`) ||
      (post.checkForFollow && location.pathname !== `/@${post.author}`)
    ) {
      rebloggedUI = (
        <div className="Story__reblog">
          <i className="iconfont icon-share1" />
          <FormattedMessage
            id="reblogged_username"
            defaultMessage="Re-blogged by {username}"
            values={{
              username: (
                <Link to={`/@${post.reblogged_by}`}>
                  <span className="username">{post.reblogged_by}</span>
                </Link>
              ),
            }}
          />
        </div>
      );
    }

    return (
      post.depth >= 0 && (
        <div className="Story" id={`${author}-${post.permlink}`}>
          {rebloggedUI}
          <div className="Story__content">
            <div className="Story__header">
              <Link to={`/@${author}`}>
                <Avatar username={author} size={40} />
              </Link>
              <div className="Story__header__text">
                <span className="Story__header__flex">
                  <h4>
                    <Link to={`/@${author}`}>
                      <span className="username">{author}</span>
                    </Link>
                  </h4>
                  <WeightTag weight={post.author_wobjects_weight} />
                </span>
                <span>
                  <BTooltip
                    title={
                      <span>
                        <FormattedDate value={`${post.created}Z`} />{' '}
                        <FormattedTime value={`${post.created}Z`} />
                      </span>
                    }
                  >
                    <span className="Story__date">
                      <FormattedRelative value={`${post.created}Z`} />
                    </span>
                  </BTooltip>
                  <PostedFrom post={post} />
                </span>
              </div>
              <div className="Story__topics">
                <div className="Story__published">
                  <div className="PostWobject__wrap">
                    {post.wobjects && this.getWobjects(post.wobjects.slice(0, 4))}
                  </div>
                </div>
              </div>
            </div>
            <div className="Story__content">
              <a
                href={replaceBotWithGuestName(dropCategory(post.url), post.guestInfo)}
                rel="noopener noreferrer"
                target="_blank"
                onClick={this.handlePostModalDisplay}
                className="Story__content__title"
              >
                <h2>
                  {post.depth !== 0 && <Tag color="#4f545c">RE</Tag>}
                  {post.title || post.root_title}
                </h2>
              </a>
              {this.renderStoryPreview()}
            </div>
            <div className="Story__footer">
              <StoryFooter
                user={user}
                post={post}
                postState={postState}
                pendingLike={pendingLike}
                pendingFlag={pendingFlag}
                rewardFund={rewardFund}
                ownPost={ownPost}
                singlePostVew={singlePostVew}
                sliderMode={sliderMode}
                defaultVotePercent={defaultVotePercent}
                onLikeClick={this.handleLikeClick}
                onReportClick={this.handleReportClick}
                onShareClick={this.handleShareClick}
                pendingFollow={pendingFollow}
                pendingBookmark={pendingBookmark}
                saving={saving}
                handleFollowClick={this.handleFollowClick}
                toggleBookmark={this.props.toggleBookmark}
                handleEditClick={this.handleEditClick}
              />
            </div>
          </div>
        </div>
      )
    );
  }
}

export default Story;
