import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { find, truncate } from 'lodash';
import { Helmet } from 'react-helmet';
import sanitize from 'sanitize-html';
import { dropCategory, isBannedPost, replaceBotWithGuestName } from '../helpers/postHelpers';
import {
  getAuthenticatedUser,
  getBookmarks,
  getPendingBookmarks,
  getPendingLikes,
  getRebloggedList,
  getPendingReblogs,
  getFollowingList,
  getPendingFollows,
  getIsEditorSaving,
  getVotingPower,
  getRewardFund,
  getVotePercent,
  getAppUrl,
} from '../reducers';
import { editPost } from './Write/editorActions';
import { votePost } from './postActions';
import { reblog } from '../app/Reblog/reblogActions';
import { toggleBookmark } from '../bookmarks/bookmarksActions';
import { followUser, unfollowUser } from '../user/userActions';
import { getAvatarURL } from '../components/Avatar';
import { getHtml } from '../components/Story/Body';
import { jsonParse } from '../helpers/formatter';
import StoryFull from '../components/Story/StoryFull';
import DMCARemovedMessage from '../components/Story/DMCARemovedMessage';

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
    pendingFollows: getPendingFollows(state),
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
    pendingFollows: PropTypes.arrayOf(PropTypes.string),
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
  };

  constructor(props) {
    super(props);

    this.handleReportClick = this.handleReportClick.bind(this);
  }

  componentDidMount() {
    const { hash } = window.location;
    // PostContent renders only when content is loaded so it's good moment to scroll to comments.
    if (hash.indexOf('comments') !== -1 || /#@[a-zA-Z-.]+\/[a-zA-Z-]+/.test(hash)) {
      const el = document.getElementById('comments');
      if (el) el.scrollIntoView({ block: 'start' });
    }
  }

  handleLikeClick = (post, postState, weight = 10000) => {
    const { sliderMode, defaultVotePercent } = this.props;
    if (sliderMode && !postState.isLiked) {
      this.props.votePost(post.id, post.author, post.permlink, weight);
    } else if (postState.isLiked) {
      this.props.votePost(post.id, post.author, post.permlink, 0);
    } else {
      this.props.votePost(post.id, post.author, post.permlink, defaultVotePercent);
    }
  };

  handleReportClick(post, postState) {
    const weight = postState.isReported ? 0 : -10000;
    this.props.votePost(post.id, post.author, post.permlink, weight);
  }

  handleShareClick = post => this.props.reblog(post.id);

  handleSaveClick = post => this.props.toggleBookmark(post.id);

  handleFollowClick = post => {
    const isFollowed = this.props.followingList.includes(post.author);
    if (isFollowed) {
      this.props.unfollowUser(post.author);
    } else {
      this.props.followUser(post.author);
    }
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
      pendingFollows,
      bookmarks,
      pendingBookmarks,
      saving,
      sliderMode,
      rewardFund,
      defaultVotePercent,
      appUrl,
      isOriginalPost,
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
      userFollowed: followingList.includes(content.author),
    };

    const pendingLike =
      pendingLikes[content.id] &&
      (pendingLikes[content.id].weight > 0 ||
        (pendingLikes[content.id].weight === 0 && postState.isLiked));

    const pendingFlag =
      pendingLikes[content.id] &&
      (pendingLikes[content.id].weight < 0 ||
        (pendingLikes[content.id].weight === 0 && postState.isReported));

    const { title, category, created, author, body } = content;
    const postMetaImage = postMetaData && postMetaData.image && postMetaData.image[0];
    const htmlBody = getHtml(body, {}, 'text');
    const bodyText = sanitize(htmlBody, { allowedTags: [] });
    const desc = `${truncate(bodyText, { length: 143 })} by ${author}`;
    const image =
      postMetaImage ||
      getAvatarURL(author) ||
      'https://waivio.nyc3.digitaloceanspaces.com/1587571702_96367762-1996-4b56-bafe-0793f04a9d79';
    const canonicalUrl = `${canonicalHost}${replaceBotWithGuestName(
      dropCategory(content.url),
      content.guestInfo,
    )}`;
    const url = `${waivioHost}${replaceBotWithGuestName(
      dropCategory(content.url),
      content.guestInfo,
    )}`;
    const ampUrl = `${url}/amp`;
    const metaTitle = `${title} - Waivio`;

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonicalUrl} />
          <link rel="amphtml" href={ampUrl} />
          <meta name="description" property="description" content={desc} />
          <meta name="og:title" property="og:title" content={metaTitle} />
          <meta name="og:type" property="og:type" content="article" />
          <meta name="og:url" property="og:url" content={url} />
          <meta name="og:image" property="og:image" content={image} />
          <meta name="og:description" property="og:description" content={desc} />
          <meta name="og:site_name" property="og:site_name" content="Waivio" />
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
          pendingFollow={pendingFollows.includes(content.author)}
          pendingBookmark={pendingBookmarks.includes(content.id)}
          saving={saving}
          rewardFund={rewardFund}
          ownPost={author === user.name}
          sliderMode={sliderMode}
          defaultVotePercent={defaultVotePercent}
          onLikeClick={this.handleLikeClick}
          onReportClick={this.handleReportClick}
          onShareClick={this.handleShareClick}
          onSaveClick={this.handleSaveClick}
          onFollowClick={this.handleFollowClick}
          onEditClick={this.handleEditClick}
          isOriginalPost={isOriginalPost}
        />
      </div>
    );
  }
}

export default PostContent;
