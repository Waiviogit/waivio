import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { find, truncate, get } from 'lodash';
import { Helmet } from 'react-helmet';
import sanitize from 'sanitize-html';
import {
  dropCategory,
  isBannedPost,
  replaceBotWithGuestName,
  getAuthorName,
} from '../helpers/postHelpers';
import {
  getAuthenticatedUser,
  getBookmarks,
  getPendingBookmarks,
  getPendingLikes,
  getRebloggedList,
  getPendingReblogs,
  getFollowingList,
  getIsEditorSaving,
  getVotingPower,
  getRewardFund,
  getVotePercent,
  getAppUrl,
} from '../reducers';
import { editPost } from './Write/editorActions';
import {
  errorFollowingPostAuthor,
  followingPostAuthor,
  pendingFollowingPostAuthor,
  votePost,
  getSocialInfoPost as getSocialInfoPostAction,
} from './postActions';
import { reblog } from '../app/Reblog/reblogActions';
import { toggleBookmark } from '../bookmarks/bookmarksActions';
import { followUser, unfollowUser } from '../user/userActions';
import { getAvatarURL } from '../components/Avatar';
import { getHtml } from '../components/Story/Body';
import { jsonParse } from '../helpers/formatter';
import StoryFull from '../components/Story/StoryFull';
import DMCARemovedMessage from '../components/Story/DMCARemovedMessage';
import { getProxyImageURL } from '../helpers/image';

@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    bookmarks: getBookmarks(state),
    pendingBookmarks: getPendingBookmarks(state),
    pendingLikes: getPendingLikes(state),
    reblogList: getRebloggedList(state),
    pendingReblogs: getPendingReblogs(state),
    followingList: getFollowingList(state),
    saving: getIsEditorSaving(state),
    sliderMode: getVotingPower(state),
    rewardFund: getRewardFund(state),
    defaultVotePercent: getVotePercent(state),
    appUrl: getAppUrl(state),
  }),
  {
    editPost,
    votePost,
    reblog,
    toggleBookmark,
    followUser,
    unfollowUser,
    push,
    pendingFollowingPostAuthor,
    followingPostAuthor,
    errorFollowingPostAuthor,
    getSocialInfoPost: getSocialInfoPostAction,
  },
)
class PostContent extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    content: PropTypes.shape().isRequired,
    signature: PropTypes.string,
    pendingLikes: PropTypes.shape(),
    reblogList: PropTypes.arrayOf(PropTypes.string),
    pendingReblogs: PropTypes.arrayOf(PropTypes.string),
    followingList: PropTypes.arrayOf(PropTypes.string),
    pendingBookmarks: PropTypes.arrayOf(PropTypes.string).isRequired,
    saving: PropTypes.bool.isRequired,
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    appUrl: PropTypes.string.isRequired,
    bookmarks: PropTypes.arrayOf(PropTypes.string),
    sliderMode: PropTypes.bool,
    editPost: PropTypes.func,
    toggleBookmark: PropTypes.func,
    votePost: PropTypes.func,
    reblog: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    push: PropTypes.func,
    isOriginalPost: PropTypes.string,
    pendingFollowingPostAuthor: PropTypes.func.isRequired,
    followingPostAuthor: PropTypes.func.isRequired,
    errorFollowingPostAuthor: PropTypes.func.isRequired,
    getSocialInfoPost: PropTypes.func.isRequired,
    postSocialInfo: PropTypes.shape(),
  };

  static defaultProps = {
    signature: null,
    pendingLikes: {},
    reblogList: [],
    pendingReblogs: [],
    followingList: [],
    pendingFollows: [],
    bookmarks: [],
    sliderMode: false,
    editPost: () => {},
    toggleBookmark: () => {},
    votePost: () => {},
    reblog: () => {},
    followUser: () => {},
    unfollowUser: () => {},
    push: () => {},
    isOriginalPost: '',
    postSocialInfo: {},
  };

  constructor(props) {
    super(props);

    this.handleReportClick = this.handleReportClick.bind(this);
    this.state = {
      cities: [],
      socialHashtags: [],
      userFacebook: '',
      userTwitter: '',
      wobjectsFacebook: [],
      wobjectsTwitter: [],
    };
  }

  componentDidMount() {
    const { content, getSocialInfoPost } = this.props;
    if (!content.tags) {
      const authorName = getAuthorName(content);
      const postPermlink = get(content, 'permlink');
      getSocialInfoPost(authorName, postPermlink);
    }

    this.renderWithCommentsSettings();
  }

  componentDidUpdate() {
    this.renderWithCommentsSettings();
  }

  renderWithCommentsSettings = () => {
    const { hash, pathname } = window.location;
    const { content } = this.props;
    // PostContent renders only when content is loaded so it's good moment to scroll to comments.
    if (hash.indexOf('comments') !== -1 || /#@[a-zA-Z0-9-.]+\/[a-zA-Z0-9-]+/.test(hash)) {
      if (
        typeof window !== 'undefined' &&
        content.guestInfo &&
        content.guestInfo.userId &&
        pathname.indexOf(content.guestInfo.userId) === -1
      )
        window.history.replaceState(
          {},
          '',
          `/@${content.guestInfo.userId}/${content.permlink}${window.location.hash}`,
        );

      const el = document.getElementById('comments');
      if (el) el.scrollIntoView({ block: 'start' });
    }
  };

  handleLikeClick = (post, postState, weight = 10000) => {
    const { sliderMode, defaultVotePercent } = this.props;
    const authorName = post.guestInfo ? post.root_author : post.author;

    if (sliderMode && !postState.isLiked) {
      this.props.votePost(post.id, authorName, post.permlink, weight);
    } else if (postState.isLiked) {
      this.props.votePost(post.id, authorName, post.permlink, 0);
    } else {
      this.props.votePost(post.id, authorName, post.permlink, defaultVotePercent);
    }
  };

  handleReportClick(post, postState) {
    const weight = postState.isReported ? 0 : -10000;
    const authorName = post.guestInfo ? post.root_author : post.author;

    this.props.votePost(post.id, authorName, post.permlink, weight);
  }

  handleShareClick = post => this.props.reblog(post.id);

  handleSaveClick = post => this.props.toggleBookmark(post.id);

  handleFollowClick = post => {
    const authorName = getAuthorName(post);
    const postId = `${post.author}/${post.permlink}`;

    this.props.pendingFollowingPostAuthor(postId);

    if (post.youFollows) {
      return this.props
        .unfollowUser(authorName)
        .then(() => this.props.followingPostAuthor(postId))
        .catch(() => this.props.errorFollowingPostAuthor(postId));
    }

    return this.props
      .followUser(authorName)
      .then(() => this.props.followingPostAuthor(postId))
      .catch(() => this.props.errorFollowingPostAuthor(postId));
  };

  handleEditClick = post => {
    const { intl } = this.props;
    if (post.depth === 0) return this.props.editPost(post, intl);
    return this.props.push(`${post.url}-edit`);
  };

  render() {
    const {
      user,
      content,
      signature,
      pendingLikes,
      reblogList,
      pendingReblogs,
      followingList,
      bookmarks,
      pendingBookmarks,
      saving,
      sliderMode,
      rewardFund,
      defaultVotePercent,
      appUrl,
      isOriginalPost,
      postSocialInfo,
    } = this.props;

    if (isBannedPost(content)) return <DMCARemovedMessage className="center" />;

    const postMetaData = jsonParse(content.json_metadata);
    const waivioHost = appUrl || 'https://www.waivio.com';
    const canonicalHost = 'https://www.waivio.com';

    const userVote = find(content.active_votes, { voter: user.name }) || {};

    const postState = {
      isReblogged: reblogList.includes(content.id),
      isReblogging: pendingReblogs.includes(content.id),
      isSaved: content.guestInfo
        ? bookmarks.includes(`${content.guestInfo.userId}/${content.root_permlink}`)
        : bookmarks.includes(content.id),
      isLiked: userVote.percent > 0,
      isReported: userVote.percent < 0,
      userFollowed: followingList.includes(getAuthorName(content)),
    };

    const pendingLike =
      pendingLikes[content.id] &&
      (pendingLikes[content.id].weight > 0 ||
        (pendingLikes[content.id].weight === 0 && postState.isLiked));

    const pendingFlag =
      pendingLikes[content.id] &&
      (pendingLikes[content.id].weight < 0 ||
        (pendingLikes[content.id].weight === 0 && postState.isReported));

    const { title, category, created, body, guestInfo } = content;
    const { socialHashtags, cities } = this.state;
    const hashtags = [...socialHashtags, ...cities];
    const authorName = getAuthorName(content);
    const postMetaImage = postMetaData && postMetaData.image && postMetaData.image[0];
    const htmlBody = getHtml(body, {}, 'text');
    const bodyText = sanitize(htmlBody, { allowedTags: [] });
    const desc = `${truncate(bodyText, { length: 143 })} ${hashtags}`;
    const image =
      postMetaImage ||
      getAvatarURL(authorName) ||
      'https://waivio.nyc3.digitaloceanspaces.com/1587571702_96367762-1996-4b56-bafe-0793f04a9d79';
    const canonicalUrl = `${canonicalHost}${replaceBotWithGuestName(
      dropCategory(content.url),
      guestInfo,
    )}`;
    const url = `${waivioHost}${replaceBotWithGuestName(dropCategory(content.url), guestInfo)}`;
    const ampUrl = `${url}/amp`;
    const metaTitle = `${title} - Waivio`;

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonicalUrl} />
          <link rel="amphtml" href={ampUrl} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:type" content="article" />
          <meta property="description" content={desc} />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={getProxyImageURL(image)} />
          <meta property="og:site_name" content="Waivio" />
          <meta name="article:tag" property="article:tag" content={category} />
          <meta name="article:published_time" property="article:published_time" content={created} />
          <meta
            name="twitter:card"
            property="twitter:card"
            content={image ? 'summary_large_image' : 'summary'}
          />
          <meta name="twitter:site" property="twitter:site" content={'@waivio'} />
          <meta name="twitter:title" property="twitter:title" content={metaTitle} />
          <meta name="twitter:description" property="twitter:description" content={desc} />
          <meta name="twitter:image" property="twitter:image" content={image} />
        </Helmet>
        <StoryFull
          user={user}
          post={content}
          postState={postState}
          signature={signature}
          commentCount={content.children}
          pendingLike={pendingLike}
          pendingFlag={pendingFlag}
          pendingBookmark={pendingBookmarks.includes(content.id)}
          saving={saving}
          rewardFund={rewardFund}
          ownPost={authorName === user.name}
          sliderMode={sliderMode}
          defaultVotePercent={defaultVotePercent}
          onLikeClick={this.handleLikeClick}
          onReportClick={this.handleReportClick}
          onShareClick={this.handleShareClick}
          onSaveClick={this.handleSaveClick}
          onFollowClick={this.handleFollowClick}
          onEditClick={this.handleEditClick}
          isOriginalPost={isOriginalPost}
          postSocialInfo={postSocialInfo}
        />
      </div>
    );
  }
}

export default PostContent;
