import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Feed from '../feed/Feed';
import { getIsAuthenticated, getAuthenticatedUser, getFeed } from '../reducers';
// import {
//   getFeedLoadingFromState,
//   getFeedFetchedFromState,
//   getFeedHasMoreFromState,
//   getFeedFromState,
// } from '../helpers/stateHelpers';
import { getMoreFeedContent } from '../feed/feedActions';
import { getFeedContentByObject } from '../object/wobjectsActions';
import { showPostModal } from '../app/appActions';
import PostModal from '../post/PostModalContainer';

@withRouter
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    feed: getFeed(state),
  }),
  {
    getFeedContentByObject,
    getMoreFeedContent,
    showPostModal,
  },
)
export default class ObjectProfile extends React.Component {
  static propTypes = {
    // authenticated: PropTypes.bool.isRequired,
    // authenticatedUser: PropTypes.shape().isRequired,
    // feed: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    // showPostModal: PropTypes.func.isRequired,
    // limit: PropTypes.number,
    getFeedContentByObject: PropTypes.func,
    // getMoreFeedContent: PropTypes.func,
  };

  static defaultProps = {
    limit: 10,
    location: {},
    getFeedContentByObject: () => {},
    getMoreFeedContent: () => {},
  };

  state = {
    posts: [],
  };

  componentDidMount() {
    const { match } = this.props;
    const { name } = match.params;
    //
    // this.props.getFeedContent({
    //   sortBy: 'blog',
    //   category: name,
    //   limit,
    // });
    this.props.getFeedContentByObject(name).then(({ posts }) => this.setState({ posts }));
  }

  render() {
    // const { authenticated, authenticatedUser, feed, limit } = this.props;
    // const username = 'guest123';
    // const isOwnProfile = authenticated && username === authenticatedUser.name;
    // const content = getFeedFromState('blog', username, feed);
    // const isFetching = getFeedLoadingFromState('blog', username, feed);
    // const fetched = getFeedFetchedFromState('blog', username, feed);
    // const hasMore = getFeedHasMoreFromState('blog', username, feed);
    // const loadMoreContentAction = () => {};
    // this.props.getMoreFeedContent({
    //   sortBy: 'blog',
    //   category: username,
    //   limit,
    // });

    return (
      <div>
        <div className="profile">
          <Feed
            content={this.state.posts}
            // isFetching={isFetching}
            // hasMore={hasMore}
            // loadMoreContent={loadMoreContentAction}
            // showPostModal={this.props.showPostModal}
          />
        </div>
        {<PostModal />}
      </div>
    );
  }
}
