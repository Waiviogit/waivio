import React from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Tabs } from 'antd';
import { Helmet } from 'react-helmet';
import {
  getUserProfileBlogPosts,
  getUserComments,
  getThreadsContent,
} from '../../../store/feedStore/feedActions';
import EmptyMutedUserProfile from '../../statics/MutedContent';
import {
  getAuthenticatedUserName,
  getAuthenticatedUser,
} from '../../../store/authStore/authSelectors';
import { getUser } from '../../../store/usersStore/usersSelectors';
import UserProfilePosts from '../UserComments';
import UserActivity from '../../activity/UserActivity';
import UserBlog from '../UserBlog/UserBlog';
import Threads from '../../Threads/Threads';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';
import UserMentions from '../../components/UserMentions/UserMentions';
import { getAvatarURL } from '../../components/Avatar';
import { getMetadata } from '../../../common/helpers/postingMetadata';
import { getProxyImageURL } from '../../../common/helpers/image';
import { getAppUrl, getHelmetIcon, getSiteName } from '../../../store/appStore/appSelectors';
import { useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import { getQueryString } from '../../../waivioApi/helpers';
import useQuery from '../../../hooks/useQuery';
import DEFAULTS from '../../object/const/defaultValues';

const getTabDescriptions = username => ({
  posts: `Browse ${username}'s posts and discover their latest content, insights, and stories. Explore a rich collection of user-generated posts covering various topics.`,
  comments: `Explore genuine user feedback! Dive into our collection of authentic comments left by engaged readers under our posts. Discover what our community is saying, share your thoughts, and join the conversation today.`,
  threads: `Explore ${username}'s threads and conversations. Join the discussion and discover engaging content from ${username}.`,
  mentions: `See where ${username} is mentioned across the platform. Discover conversations and posts that reference ${username}.`,
  activity: `Track real-time user interactions on our platform, backed by open blockchain technology. Experience unparalleled transparency and authenticity as you witness the vibrant activity of our community members.`,
});

const getTabTitle = tab => {
  const titles = {
    posts: 'Posts',
    comments: 'Comments',
    threads: 'Threads',
    mentions: 'Mentions',
    activity: 'Activity',
  };

  return titles[tab] || tab || '';
};

const PostsCommentsActivity = props => {
  const {
    match,
    authenticatedUserName,
    user,
    intl,
    authenticatedUser,
    appUrl,
    helmetIcon,
    siteName,
  } = props;
  const { name, 0: tab = 'posts' } = match.params;
  const isGuest = guestUserRegex.test(name);
  const query = useQuery();

  if (!isEmpty(user.mutedBy) || user.muted)
    return <EmptyMutedUserProfile user={user} authName={authenticatedUserName} />;

  const metadata = getMetadata(user);
  const profile = get(metadata, 'profile', {});
  const displayedUsername = profile?.name || name || '';

  const desc =
    getTabDescriptions(name, siteName)[tab] ||
    profile?.about ||
    `Browse ${name}'s content and discover their latest posts, comments, and activity.`;

  const ensureAbsoluteUrl = url => {
    if (!url) return url;
    if (typeof url !== 'string') return url;
    if (/^https?:\/\//i.test(url)) return url;
    const baseUrl = appUrl || (typeof window !== 'undefined' ? window.location.origin : '');

    return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
  };

  let image = profile?.cover_image ? ensureAbsoluteUrl(profile.cover_image) : null;

  if (!image && profile?.profile_image) {
    const profileImg = profile.profile_image.includes('images.hive.blog')
      ? profile.profile_image
      : getProxyImageURL(profile.profile_image);
    image = ensureAbsoluteUrl(profileImg);
  }
  if (!image) {
    image = getAvatarURL(name, 200, authenticatedUser);
  }
  if (!image) {
    image =
      DEFAULTS.AVATAR ||
      'https://waivio.nyc3.digitaloceanspaces.com/1587571702_96367762-1996-4b56-bafe-0793f04a9d79';
  }
  image = ensureAbsoluteUrl(image);

  const { canonicalUrl } = useSeoInfoWithAppUrl(user?.canonical);
  const canonical = `${canonicalUrl}${getQueryString(query)}`;
  const tabTitle = getTabTitle(tab);
  const title = `${displayedUsername || name || 'User'} ${tabTitle}`.trim();

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={desc} />
        <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:site" content={`@${siteName}`} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:image:src" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={image} />
        <meta property="og:image:url" content={image} />
        <meta property="og:image:alt" content={`${displayedUsername || name}'s profile image`} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={image} />
        <link id="favicon" rel="icon" href={helmetIcon} type="image/x-icon" />
      </Helmet>
      <Tabs defaultActiveKey={tab} className={'UserFollowers'} activeKey={tab}>
        <Tabs.TabPane
          tab={
            <Link to={`/@${name}`}>
              {intl.formatMessage({ id: 'posts', defaultMessage: 'Posts' })}
            </Link>
          }
          key={'posts'}
        >
          {tab === 'posts' && <UserBlog />}
        </Tabs.TabPane>
        {!isGuest && (
          <Tabs.TabPane
            tab={
              <Link to={`/@${name}/threads`}>
                {intl.formatMessage({ id: 'threads', defaultMessage: 'Threads' })}
              </Link>
            }
            key="threads"
          >
            {tab === 'threads' && <Threads isUser />}
          </Tabs.TabPane>
        )}
        <Tabs.TabPane
          tab={
            <Link to={`/@${name}/comments`}>
              {intl.formatMessage({ id: 'comments', defaultMessage: 'Comments' })}
            </Link>
          }
          key="comments"
        >
          {tab === 'comments' && <UserProfilePosts match={match} />}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link to={`/@${name}/mentions`}>
              {intl.formatMessage({ id: 'mentions_tab', defaultMessage: 'Mentions' })}
            </Link>
          }
          key="mentions"
        >
          {tab === 'mentions' && <UserMentions />}
        </Tabs.TabPane>
        {!isGuest && (
          <Tabs.TabPane
            tab={
              <Link to={`/@${name}/activity`}>
                {intl.formatMessage({ id: 'activity', defaultMessage: 'Activity' })}
              </Link>
            }
            key="activity"
          >
            {tab === 'activity' && <UserActivity />}
          </Tabs.TabPane>
        )}
      </Tabs>
    </>
  );
};

PostsCommentsActivity.propTypes = {
  match: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  authenticatedUserName: PropTypes.string,
  authenticatedUser: PropTypes.shape(),
  user: PropTypes.shape(),
  appUrl: PropTypes.string,
  helmetIcon: PropTypes.string,
  siteName: PropTypes.string,
};

PostsCommentsActivity.defaultProps = {
  limit: 10,
  isGuest: false,
  user: {},
};

PostsCommentsActivity.fetchData = ({ store, match }) => {
  const { name, 0: tab = 'posts' } = match.params;

  if (tab === 'posts')
    return store.dispatch(getUserProfileBlogPosts(name, { limit: 10, initialLoad: true }));
  if (tab === 'comments') return store.dispatch(getUserComments({ username: name }));
  if (tab === 'threads') return store.dispatch(getThreadsContent(name, 0, 20, true));

  return Promise.resolve();
};

export default connect((state, ownProps) => ({
  authenticatedUserName: getAuthenticatedUserName(state),
  authenticatedUser: getAuthenticatedUser(state),
  user: getUser(state, ownProps.match.params.name),
  appUrl: getAppUrl(state),
  helmetIcon: getHelmetIcon(state),
  siteName: getSiteName(state),
}))(injectIntl(withRouter(PostsCommentsActivity)));
