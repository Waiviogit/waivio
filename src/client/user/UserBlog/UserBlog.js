import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { useParams, withRouter } from 'react-router';
import { isEmpty, get } from 'lodash';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import { getProxyImageURL } from '../../../common/helpers/image';
import { getMetadata } from '../../../common/helpers/postingMetadata';
import { useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import { getAppUrl, getHelmetIcon, getSiteName } from '../../../store/appStore/appSelectors';
import { getUser } from '../../../store/usersStore/usersSelectors';
import { getQueryString } from '../../../waivioApi/helpers';
import { getAvatarURL } from '../../components/Avatar';

import Feed from '../../feed/Feed';
import DEFAULTS from '../../object/const/defaultValues';
import EmptyUserOwnProfile from '../../statics/EmptyUserOwnProfile';
import EmptyUserProfile from '../../statics/EmptyUserProfile';
import PostModal from '../../post/PostModalContainer';
import {
  getFeedFetchedFromState,
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../../../common/helpers/stateHelpers';
import {
  getAuthenticatedUserName,
  isGuestUser,
  getAuthenticatedUser,
} from '../../../store/authStore/authSelectors';
import {
  getBlogFilters,
  getFeed,
  getPreviewLoadingFromState,
} from '../../../store/feedStore/feedSelectors';
import {
  getTiktokPreviewAction,
  getUserProfileBlogPosts,
  resetProfileFilters,
} from '../../../store/feedStore/feedActions';
import { showPostModal } from '../../../store/appStore/appActions';
import { getUsersMentionCampaign } from '../../../waivioApi/ApiClient';
import Campaing from '../../newRewards/reuseble/Campaing';
import Proposition from '../../newRewards/reuseble/Proposition/Proposition';
import useQuery from '../../../hooks/useQuery';

const limit = 10;

const UserBlog = props => {
  const { name } = useParams();
  const user = useSelector(state => getUser(state, name));
  const previewLoading = useSelector(getPreviewLoadingFromState);

  const [mentions, setMentions] = useState({});
  const isOwnProfile = name === props.authenticatedUserName;
  const content = getFeedFromState('blog', name, props.feed);
  const isFetching = getFeedLoadingFromState('blog', name, props.feed);
  const fetched = getFeedFetchedFromState('blog', name, props.feed);
  const hasMore = getFeedHasMoreFromState('blog', name, props.feed);
  const metadata = getMetadata(user);
  const query = useQuery();
  const queryTags = query?.get('tags')?.split(',');
  const profile = get(metadata, 'profile', {});
  const description =
    (metadata && get(profile, 'about')) ||
    "Browse a rich collection of user-generated posts, covering a myriad of topics. Engage with our diverse community's insights, stories, and perspectives.";

  const displayedUsername = profile?.name || name || '';

  const ensureAbsoluteUrl = url => {
    if (!url) return url;
    if (typeof url !== 'string') return url;
    if (/^https?:\/\//i.test(url)) return url;
    const baseUrl = props.appUrl || (typeof window !== 'undefined' ? window.location.origin : '');

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
    image = getAvatarURL(name, 200, user);
  }
  if (!image) {
    image =
      DEFAULTS.AVATAR ||
      'https://waivio.nyc3.digitaloceanspaces.com/1587571702_96367762-1996-4b56-bafe-0793f04a9d79';
  }
  image = ensureAbsoluteUrl(image);

  const { canonicalUrl } = useSeoInfoWithAppUrl(user?.canonical);
  const canonical = `${canonicalUrl}${getQueryString(query)}`;

  const title = `${displayedUsername || name || 'User'}`;

  useEffect(() => {
    if (isEmpty(content))
      props.getUserProfileBlogPosts(name, { limit, initialLoad: true }, queryTags).then(res => {
        props.getTiktokPreviewAction(res.value.posts);
      });
  }, [props?.tagsCondition?.length, name]);

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
    const postingJsonMetadata = get(user, 'posting_json_metadata', {});

    if (postingJsonMetadata?.profile?.pinned) {
      Cookie.set('userPin', profile?.pinned);
    }
    getUsersMentionCampaign(name).then(res => {
      setMentions(res);
    });

    return () => props.resetProfileFilters();
  }, [name]);

  const loadMoreContentAction = () =>
    props.getUserProfileBlogPosts(name, { limit, initialLoad: false }, queryTags).then(res => {
      props.getTiktokPreviewAction(res.value.posts);
    });

  return (
    <div className="profile">
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={description} />
        <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:site" content={`@${props.siteName}`} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
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
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={props.siteName} />
        <link rel="image_src" href={image} />
        <link id="favicon" rel="icon" href={props.helmetIcon} type="image/x-icon" />
      </Helmet>
      {mentions.main && <Campaing campain={mentions.main} secondary={mentions?.secondary} />}
      {!isEmpty(mentions.secondary) &&
        mentions.secondary.map(propos => <Proposition key={propos._id} proposition={propos} />)}
      <Feed
        content={content}
        isFetching={isFetching || previewLoading}
        hasMore={hasMore}
        loadMoreContent={loadMoreContentAction}
        showPostModal={props.showPostModal}
        isGuest={props.isGuest}
      />
      {isEmpty(content) && fetched && isOwnProfile && <EmptyUserOwnProfile />}
      {isEmpty(content) && fetched && !isOwnProfile && <EmptyUserProfile />}
      {<PostModal userName={props.authenticatedUserName} />}
    </div>
  );
};

UserBlog.propTypes = {
  authenticatedUserName: PropTypes.string,
  helmetIcon: PropTypes.string,
  siteName: PropTypes.string,
  appUrl: PropTypes.string,
  feed: PropTypes.shape(),
  isGuest: PropTypes.bool,
  tagsCondition: PropTypes.arrayOf(PropTypes.string),
  getUserProfileBlogPosts: PropTypes.func,
  showPostModal: PropTypes.func,
  resetProfileFilters: PropTypes.func,
  getTiktokPreviewAction: PropTypes.func,
};

export default withRouter(
  connect(
    state => ({
      authenticatedUserName: getAuthenticatedUserName(state),
      feed: getFeed(state),
      isGuest: isGuestUser(state),
      tagsCondition: getBlogFilters(state),
      authenticatedUser: getAuthenticatedUser(state),
      appUrl: getAppUrl(state),
      helmetIcon: getHelmetIcon(state),
      siteName: getSiteName(state),
    }),
    {
      getUserProfileBlogPosts,
      showPostModal,
      resetProfileFilters,
      getTiktokPreviewAction,
    },
  )(UserBlog),
);
