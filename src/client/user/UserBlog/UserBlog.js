import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Feed from '../../feed/Feed';
import EmptyUserOwnProfile from '../../statics/EmptyUserOwnProfile';
import EmptyUserProfile from '../../statics/EmptyUserProfile';
import PostModal from '../../post/PostModalContainer';
import {
  getFeedFetchedFromState,
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../../../common/helpers/stateHelpers';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import { getBlogFilters, getFeed } from '../../../store/feedStore/feedSelectors';
import { getUserProfileBlogPosts, resetProfileFilters } from '../../../store/feedStore/feedActions';
import { showPostModal } from '../../../store/appStore/appActions';

const limit = 10;

const UserBlog = props => {
  const { name } = useParams();
  const isOwnProfile = name === props.authenticatedUserName;
  const content = getFeedFromState('blog', name, props.feed);
  const isFetching = getFeedLoadingFromState('blog', name, props.feed);
  const fetched = getFeedFetchedFromState('blog', name, props.feed);
  const hasMore = getFeedHasMoreFromState('blog', name, props.feed);

  useEffect(() => {
    props.getUserProfileBlogPosts(name, { limit, initialLoad: true });
  }, [props?.tagsCondition?.length, name]);

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);

    return () => props.resetProfileFilters();
  }, [name]);

  const loadMoreContentAction = () =>
    props.getUserProfileBlogPosts(name, { limit, initialLoad: false });

  return (
    <div className="profile">
      <Feed
        content={content}
        isFetching={isFetching}
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
  feed: PropTypes.shape(),
  isGuest: PropTypes.bool,
  tagsCondition: PropTypes.arrayOf(PropTypes.string),
  getUserProfileBlogPosts: PropTypes.func,
  showPostModal: PropTypes.func,
  resetProfileFilters: PropTypes.func,
};

export default connect(
  state => ({
    authenticatedUserName: getAuthenticatedUserName(state),
    feed: getFeed(state),
    isGuest: isGuestUser(state),
    tagsCondition: getBlogFilters(state),
  }),
  {
    getUserProfileBlogPosts,
    showPostModal,
    resetProfileFilters,
  },
)(UserBlog);
