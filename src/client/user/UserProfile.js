import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isEqual } from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Feed from '../feed/Feed';
import {
  getFeedLoadingFromState,
  getFeedFetchedFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../../common/helpers/stateHelpers';
import { getUserAccountHistory } from '../../store/walletStore/walletActions';
import { getUserProfileBlogPosts, resetProfileFilters } from '../../store/feedStore/feedActions';
import { showPostModal } from '../../store/appStore/appActions';
import EmptyUserProfile from '../statics/EmptyUserProfile';
import EmptyUserOwnProfile from '../statics/EmptyUserOwnProfile';
import PostModal from '../post/PostModalContainer';
import EmptyMutedUserProfile from '../statics/MutedContent';
import {
  getAuthenticatedUser,
  getIsAuthenticated,
  isGuestUser,
} from '../../store/authStore/authSelectors';
import { getBlogFilters, getFeed } from '../../store/feedStore/feedSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import { getUsersAccountHistory } from '../../store/walletStore/walletSelectors';

@withRouter
@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    feed: getFeed(state),
    usersAccountHistory: getUsersAccountHistory(state),
    isGuest: isGuestUser(state),
    user: getUser(state, ownProps.match.params.name),
    tagsCondition: getBlogFilters(state),
  }),
  {
    getUserProfileBlogPosts,
    showPostModal,
    getUserAccountHistory,
    resetProfileFilters,
  },
)
export default class UserProfile extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    resetProfileFilters: PropTypes.func.isRequired,
    tagsCondition: PropTypes.arrayOf(PropTypes.string),
    limit: PropTypes.number,
    getUserProfileBlogPosts: PropTypes.func,
    isGuest: PropTypes.bool,
    history: PropTypes.shape(),
    user: PropTypes.shape(),
  };

  static defaultProps = {
    limit: 10,
    getUserProfileBlogPosts: () => {},
    isGuest: false,
    history: {},
    user: {},
    tagsCondition: [],
  };

  componentDidMount() {
    const { match, limit } = this.props;
    const { name } = match.params;

    this.props.getUserProfileBlogPosts(name, { limit, initialLoad: true });
  }

  componentWillReceiveProps(nextProps) {
    const { match, limit } = this.props;
    const { name } = match.params;

    if (name !== nextProps.match.params.name) {
      if (
        nextProps.feed &&
        nextProps.feed.blog &&
        !nextProps.feed.blog[nextProps.match.params.name]
      ) {
        this.props.getUserProfileBlogPosts(nextProps.match.params.name, {
          limit,
          initialLoad: true,
        });
      }
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate(prevProps) {
    const { match, limit, user, tagsCondition } = this.props;
    const { name } = match.params;

    if (
      prevProps.user.muted !== user.muted ||
      prevProps.match.url !== match.url ||
      !isEqual(tagsCondition, prevProps.tagsCondition)
    ) {
      this.props.getUserProfileBlogPosts(name, { limit, initialLoad: true });
    }
  }

  componentWillUnmount() {
    this.props.resetProfileFilters();
  }

  render() {
    const {
      authenticated,
      authenticatedUser,
      feed,
      limit,
      isGuest,
      history,
      user,
      match,
    } = this.props;
    const { name } = match.params;
    const isOwnProfile = authenticated && name === authenticatedUser.name;
    const content = getFeedFromState('blog', name, feed);
    const isFetching = getFeedLoadingFromState('blog', name, feed);
    const fetched = getFeedFetchedFromState('blog', name, feed);
    const hasMore = getFeedHasMoreFromState('blog', name, feed);

    const loadMoreContentAction = () =>
      this.props.getUserProfileBlogPosts(name, {
        limit,
        initialLoad: false,
      });

    if (!isEmpty(user.mutedBy) || user.muted)
      return <EmptyMutedUserProfile user={user} authName={authenticatedUser.name} />;

    return (
      <div className="profile">
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadMoreContent={loadMoreContentAction}
          showPostModal={this.props.showPostModal}
          isGuest={isGuest}
          history={history}
        />
        {isEmpty(content) && fetched && isOwnProfile && <EmptyUserOwnProfile />}
        {isEmpty(content) && fetched && !isOwnProfile && <EmptyUserProfile />}
        {<PostModal userName={authenticatedUser.name} />}
      </div>
    );
  }
}
