import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Cookie from 'js-cookie';
import _ from 'lodash';
import { showPostModal } from '../app/appActions';
import {
  getFeedContent,
  getUserFeedContent,
  getMoreFeedContent,
  getMoreUserFeedContent,
} from './feedActions';

import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedFetchedFromState,
  getUserFeedLoadingFromState,
  getUserFeedFetchedFromState,
  getFeedHasMoreFromState,
  getUserFeedFailedFromState,
  getFeedFailedFromState,
  getUserFeedFromState,
} from '../helpers/stateHelpers';
import { getIsAuthenticated, getIsLoaded, getAuthenticatedUser, getFeed } from '../reducers';
import Feed from './Feed';
import FetchFailed from '../statics/FetchFailed';
import EmptyFeed from '../statics/EmptyFeed';
import LetsGetStarted from './LetsGetStarted';
import ScrollToTop from '../components/Utils/ScrollToTop';
import PostModal from '../post/PostModalContainer';

@withRouter
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    loaded: getIsLoaded(state),
    user: getAuthenticatedUser(state),
    feed: getFeed(state),
  }),
  dispatch => ({
    getFeedContent: (sortBy, category) => dispatch(getFeedContent({ sortBy, category, limit: 10 })),
    getUserFeedContent: userName => dispatch(getUserFeedContent({ userName, limit: 10 })),
    getMoreUserFeedContent: userName => dispatch(getMoreUserFeedContent({ userName, limit: 10 })),
    getMoreFeedContent: (sortBy, category) =>
      dispatch(getMoreFeedContent({ sortBy, category, limit: 10 })),
    showPostModal: post => dispatch(showPostModal(post)),
  }),
)
class SubFeed extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    getFeedContent: PropTypes.func,
    getUserFeedContent: PropTypes.func,
    getMoreUserFeedContent: PropTypes.func,
    getMoreFeedContent: PropTypes.func,
  };

  static defaultProps = {
    getFeedContent: () => {},
    getUserFeedContent: () => {},
    getMoreUserFeedContent: () => {},
    getMoreFeedContent: () => {},
  };

  componentDidMount() {
    const { authenticated, loaded, user, match, feed } = this.props;

    if (!loaded && Cookie.get('access_token')) return;

    if (match.url === '/my_feed' && authenticated) {
      const fetched = getUserFeedFetchedFromState(user.name, feed);
      if (fetched) return;
      this.props.getUserFeedContent(user.name);
    } else {
      const withAppFilter = !localStorage.getItem('isAppFilterOff');
      const sortBy = withAppFilter ? 'feed' : 'trending';
      const category = withAppFilter ? 'wia_feed' : 'all';
      const fetched = getFeedFetchedFromState(sortBy, category, feed);
      if (fetched) return;
      this.props.getFeedContent(sortBy, category);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { authenticated, loaded, user, match, feed } = nextProps;
    const oldSortBy = this.props.match.params.sortBy;
    const newSortBy = match.params.sortBy;
    const oldCategory = this.props.match.params.category;
    const newCategory = match.params.category;
    const wasAuthenticated = this.props.authenticated;
    const isAuthenticated = authenticated;
    const wasLoaded = this.props.loaded;
    const isLoaded = loaded;

    if (!isLoaded && Cookie.get('access_token')) return;

    if (
      match.url === '/my_feed' &&
      ((match.url !== this.props.match.url && isAuthenticated) ||
        (isAuthenticated && !wasAuthenticated))
    ) {
      const fetching = getUserFeedLoadingFromState(user.name, feed);
      if (!fetching) {
        this.props.getUserFeedContent(user.name);
      }
    } else if (match.url === '/' && match.url !== this.props.match.url) {
      const withAppFilter = !localStorage.getItem('isAppFilterOff');
      const sortBy = withAppFilter ? 'feed' : 'trending';
      const category = withAppFilter ? 'wia_feed' : 'all';
      const fetching = getFeedLoadingFromState(sortBy, category, feed);
      if (!fetching) {
        this.props.getFeedContent(sortBy, category);
      }
    } else if (oldSortBy !== newSortBy || oldCategory !== newCategory || (!wasLoaded && isLoaded)) {
      const fetching = getFeedLoadingFromState(newSortBy || 'trending', newCategory, feed);
      if (!fetching) {
        this.props.getFeedContent(newSortBy || 'trending', newCategory);
      }
    }
  }

  render() {
    const { authenticated, loaded, user, feed, match } = this.props;
    let content = [];
    let isFetching = false;
    let fetched = false;
    let hasMore = false;
    let failed = false;
    let loadMoreContent = () => {};
    const isAuthHomeFeed = match.url === '/my_feed' && authenticated;

    if (isAuthHomeFeed) {
      content = getUserFeedFromState(user.name, feed);
      isFetching = getUserFeedLoadingFromState(user.name, feed);
      fetched = getUserFeedFetchedFromState(user.name, feed);
      hasMore =
        feed.feed[user.name] && !_.isNil(feed.feed[user.name].hasMore)
          ? feed.feed[user.name].hasMore
          : true;
      failed = getUserFeedFailedFromState(user.name, feed);
      loadMoreContent = () => this.props.getMoreUserFeedContent(user.name);
    } else {
      const withAppFilter = !localStorage.getItem('isAppFilterOff');

      const sortBy = withAppFilter ? 'feed' : 'trending';
      const category = withAppFilter ? 'wia_feed' : 'all';
      hasMore = getFeedHasMoreFromState(sortBy, category, feed);

      content = getFeedFromState(sortBy, category, feed);
      isFetching = getFeedLoadingFromState(sortBy, category, feed);
      fetched = getFeedFetchedFromState(sortBy, category, feed);
      failed = getFeedFailedFromState(sortBy, category, feed);
      loadMoreContent = () => this.props.getMoreFeedContent(sortBy, category);
    }

    const empty = _.isEmpty(content);
    const displayEmptyFeed = empty && fetched && loaded && !isFetching && !failed;

    const ready = loaded && fetched && !isFetching;

    return (
      <div>
        {isAuthHomeFeed && <LetsGetStarted />}
        {empty && <ScrollToTop />}
        <Feed
          empty={empty}
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadMoreContent={loadMoreContent}
          showPostModal={this.props.showPostModal}
        />
        {ready && failed && <FetchFailed />}
        {displayEmptyFeed && <EmptyFeed />}
        <PostModal />
      </div>
    );
  }
}

export default SubFeed;
