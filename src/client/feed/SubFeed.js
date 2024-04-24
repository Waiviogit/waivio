import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Cookie from 'js-cookie';
import { isEmpty, isNil, uniq } from 'lodash';
import { showPostModal } from '../../store/appStore/appActions';
import {
  getFeedContent,
  getUserFeedContent,
  getMoreFeedContent,
  getMoreUserFeedContent,
} from '../../store/feedStore/feedActions';

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
} from '../../common/helpers/stateHelpers';
import Feed from './Feed';
import FetchFailed from '../statics/FetchFailed';
import EmptyFeed from '../statics/EmptyFeed';
import LetsGetStarted from './LetsGetStarted';
import ScrollToTop from '../components/Utils/ScrollToTop';
import PostModal from '../post/PostModalContainer';
import {
  getAuthenticatedUser,
  getIsAuthenticated,
  getIsLoaded,
} from '../../store/authStore/authSelectors';
import { getFeed } from '../../store/feedStore/feedSelectors';

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
    history: PropTypes.shape().isRequired,
    sortBy: PropTypes.string,
  };

  static defaultProps = {
    getFeedContent: () => {},
    getUserFeedContent: () => {},
    getMoreUserFeedContent: () => {},
    getMoreFeedContent: () => {},
    sortBy: '',
  };
  state = { isAuthHomeFeed: false };

  componentDidMount() {
    const { authenticated, loaded, user, match, feed, history, sortBy } = this.props;
    const category = match.params.category;

    if (!loaded && Cookie.get('access_token')) return;

    if (match.url === '/' && authenticated) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ isAuthHomeFeed: true });
      const fetched = getUserFeedFetchedFromState(user.name, feed);
      const content = getUserFeedFromState(user.name, feed);

      if (fetched || !isEmpty(content)) return;
      this.props.getUserFeedContent(user.name).then(res => {
        if (res.value.message && history.action !== 'PUSH') {
          history.push('/trending');
        }
      });
    } else {
      const fetched = getFeedFetchedFromState(sortBy, category, feed);

      if (fetched) return;
      this.props.getFeedContent(sortBy, category);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { authenticated, loaded, user, match, feed, sortBy } = nextProps;
    const oldSortBy = this.props.sortBy;
    const newSortBy = sortBy;
    const oldCategory = this.props.match.params.category;
    const newCategory = match.params.category;
    const wasAuthenticated = this.props.authenticated;
    const isAuthenticated = authenticated;
    const wasLoaded = this.props.loaded;
    const isLoaded = loaded;

    if (!isLoaded && Cookie.get('access_token')) return;

    if (
      match.url === '/' &&
      ((match.url !== this.props.match.url && isAuthenticated) ||
        (isAuthenticated && !wasAuthenticated))
    ) {
      const fetching = getUserFeedLoadingFromState(user.name, feed);

      if (!fetching) {
        this.props.getUserFeedContent(user.name);
      }
    } else if (oldSortBy !== newSortBy || oldCategory !== newCategory || (!wasLoaded && isLoaded)) {
      const fetching = getFeedLoadingFromState(newSortBy || 'trending', newCategory, feed);

      if (!fetching) {
        this.props.getFeedContent(newSortBy || 'trending', newCategory);
      }
    }
  }

  render() {
    const { authenticated, loaded, user, feed, match, sortBy } = this.props;
    let content;
    let isFetching;
    let fetched;
    let hasMore;
    let failed;
    let loadMoreContent;
    const isAuthHomeFeed = match.url === '/' && authenticated;

    if (isAuthHomeFeed) {
      content = getUserFeedFromState(user.name, feed);
      isFetching = getUserFeedLoadingFromState(user.name, feed);
      fetched = getUserFeedFetchedFromState(user.name, feed);
      hasMore =
        feed.feed[user.name] && !isNil(feed.feed[user.name].hasMore)
          ? feed.feed[user.name].hasMore
          : true;
      failed = getUserFeedFailedFromState(user.name, feed);
      loadMoreContent = () => this.props.getMoreUserFeedContent(user.name);
    } else {
      content = getFeedFromState(sortBy, match.params.category, feed);
      isFetching = getFeedLoadingFromState(sortBy, match.params.category, feed);
      fetched = getFeedFetchedFromState(sortBy, match.params.category, feed);
      hasMore = getFeedHasMoreFromState(sortBy, match.params.category, feed);
      failed = getFeedFailedFromState(sortBy, match.params.category, feed);
      loadMoreContent = () => this.props.getMoreFeedContent(sortBy, match.params.category);
    }
    content = uniq(content);
    const empty = isEmpty(content);
    const displayEmptyFeed = empty && !fetched && loaded && !isFetching && !failed;
    const ready = loaded && fetched && !isFetching;

    return (
      <div>
        {isAuthHomeFeed && <LetsGetStarted />}
        {empty && <ScrollToTop />}
        {displayEmptyFeed && <EmptyFeed />}
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadMoreContent={loadMoreContent}
          showPostModal={this.props.showPostModal}
        />
        {ready && failed && <FetchFailed />}
        <PostModal />
      </div>
    );
  }
}

export default SubFeed;
