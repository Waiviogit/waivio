import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Feed from '../feed/Feed';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getFeed,
  getUsersAccountHistory,
  isGuestUser,
  getUser,
} from '../reducers';
import {
  getFeedLoadingFromState,
  getFeedFetchedFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../helpers/stateHelpers';
import { getUserAccountHistory } from '../wallet/walletActions';
import { getUserProfileBlogPosts } from '../feed/feedActions';
import { showPostModal } from '../app/appActions';
import EmptyUserProfile from '../statics/EmptyUserProfile';
import EmptyUserOwnProfile from '../statics/EmptyUserOwnProfile';
import PostModal from '../post/PostModalContainer';
import EmptyMutedUserProfile from '../statics/MutedContent';

@withRouter
@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    feed: getFeed(state),
    usersAccountHistory: getUsersAccountHistory(state),
    isGuest: isGuestUser(state),
    user: getUser(state, ownProps.match.params.name),
  }),
  {
    getUserProfileBlogPosts,
    showPostModal,
    getUserAccountHistory,
  },
)
export default class UserProfile extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    limit: PropTypes.number,
    getUserProfileBlogPosts: PropTypes.func,
    getUserAccountHistory: PropTypes.func,
    usersAccountHistory: PropTypes.shape(),
    isGuest: PropTypes.bool,
    history: PropTypes.shape(),
    user: PropTypes.shape(),
    isBlogInObject: PropTypes.bool,
  };

  static defaultProps = {
    limit: 10,
    location: {},
    getUserProfileBlogPosts: () => {},
    getUserAccountHistory: () => {},
    usersAccountHistory: {},
    isGuest: false,
    history: {},
    user: {},
    isBlogInObject: false,
  };

  componentDidMount() {
    const { match, limit, usersAccountHistory, isBlogInObject } = this.props;
    const { name, author } = match.params;
    const permlink = isBlogInObject ? author : name;
    this.props.getUserProfileBlogPosts(permlink, { limit, initialLoad: true });
    if (isEmpty(usersAccountHistory[permlink])) {
      this.props.getUserAccountHistory(permlink);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match, limit, isBlogInObject } = this.props;
    const { name, author } = match.params;
    const permlink = isBlogInObject ? author : name;
    if (permlink !== isBlogInObject ? nextProps.match.params.author : nextProps.match.params.name) {
      if (
        nextProps.feed &&
        nextProps.feed.blog &&
        !nextProps.feed.blog[
          isBlogInObject ? nextProps.match.params.author : nextProps.match.params.name
        ]
      ) {
        this.props.getUserProfileBlogPosts(
          isBlogInObject ? nextProps.match.params.author : nextProps.match.params.name,
          {
            limit,
            initialLoad: true,
          },
        );
      }
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate(prevProps) {
    const { match, limit, user, isBlogInObject } = this.props;
    const { name, author } = match.params;
    const permlink = isBlogInObject ? author : name;
    if (prevProps.user.muted !== user.muted) {
      this.props.getUserProfileBlogPosts(permlink, { limit, initialLoad: true });
    }
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
      isBlogInObject,
    } = this.props;
    const { name, author } = match.params;
    const username = isBlogInObject ? author : name;
    const isOwnProfile = authenticated && username === authenticatedUser.name;
    const content = getFeedFromState('blog', username, feed);
    const isFetching = getFeedLoadingFromState('blog', username, feed);
    const fetched = getFeedFetchedFromState('blog', username, feed);
    const hasMore = getFeedHasMoreFromState('blog', username, feed);
    const loadMoreContentAction = () =>
      this.props.getUserProfileBlogPosts(username, {
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
