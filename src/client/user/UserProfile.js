import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Feed from '../feed/Feed';
import { getIsAuthenticated, getAuthenticatedUser, getFeed } from '../reducers';
import {
  getFeedLoadingFromState,
  getFeedFetchedFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../helpers/stateHelpers';
import { getUserProfileBlogPosts } from '../feed/feedActions';
import { showPostModal } from '../app/appActions';
import EmptyUserProfile from '../statics/EmptyUserProfile';
import EmptyUserOwnProfile from '../statics/EmptyUserOwnProfile';
import PostModal from '../post/PostModalContainer';

@withRouter
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    feed: getFeed(state),
  }),
  {
    getUserProfileBlogPosts,
    showPostModal,
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
  };

  static defaultProps = {
    limit: 10,
    location: {},
    getUserProfileBlogPosts: () => {},
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

  render() {
    const { authenticated, authenticatedUser, feed, limit } = this.props;
    const username = this.props.match.params.name;
    const isOwnProfile = authenticated && username === authenticatedUser.name;
    const content = getFeedFromState('blog', username, feed);
    const isFetching = getFeedLoadingFromState('blog', username, feed);
    const fetched = getFeedFetchedFromState('blog', username, feed);
    const hasMore = getFeedHasMoreFromState('blog', username, feed);
    const loadMoreContentAction = () =>
      this.props.getUserProfileBlogPosts(username, { limit, initialLoad: false });

    return (
      <div>
        <div className="profile">
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadMoreContent={loadMoreContentAction}
            showPostModal={this.props.showPostModal}
          />
          {isEmpty(content) && fetched && isOwnProfile && <EmptyUserOwnProfile />}
          {isEmpty(content) && fetched && !isOwnProfile && <EmptyUserProfile />}
        </div>
        {<PostModal />}
      </div>
    );
  }
}
