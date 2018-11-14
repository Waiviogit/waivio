import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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
import { getObjectPosts } from '../feed/feedActions';
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
    getObjectPosts,
    // getMoreFeedContent,
    showPostModal,
  },
)
export default class ObjectProfile extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    // limit: PropTypes.number,
    getObjectPosts: PropTypes.func,
    // getMoreFeedContent: PropTypes.func,
  };

  static defaultProps = {
    limit: 10,
    location: {},
    getObjectPosts: () => {},
    // getMoreFeedContent: () => {},
  };

  componentDidMount() {
    const { match } = this.props;
    const { name } = match.params;

    this.props.getObjectPosts({
      object: name,
      username: this.props.authenticatedUser.name,
    });
  }

  render() {
    const { authenticated, authenticatedUser, feed } = this.props;
    const username = this.props.match.params.name;
    const isOwnProfile = authenticated && username === authenticatedUser.name;
    const content = getFeedFromState('objectPosts', authenticatedUser.name, feed);
    const isFetching = getFeedLoadingFromState('objectPosts', authenticatedUser.name, feed);
    const fetched = getFeedFetchedFromState('objectPosts', authenticatedUser.name, feed);
    const hasMore = getFeedHasMoreFromState('objectPosts', authenticatedUser.name, feed);
    const loadMoreContentAction = () => {};

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
          {_.isEmpty(content) && fetched && isOwnProfile && <EmptyUserOwnProfile />}
          {_.isEmpty(content) && fetched && !isOwnProfile && <EmptyUserProfile />}
        </div>
        {<PostModal />}
      </div>
    );
  }
}
