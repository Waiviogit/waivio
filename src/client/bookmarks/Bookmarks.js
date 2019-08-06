import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { getFeed, getPosts, getPendingBookmarks, getIsBookmarksLoading } from '../reducers';
import Feed from '../feed/Feed';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { getUserMetadata } from '../user/usersActions';
import { getBookmarks } from '../feed/feedActions';
import { showPostModal } from '../app/appActions';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import requiresLogin from '../auth/requiresLogin';
import PostModal from '../post/PostModalContainer';

@requiresLogin
@injectIntl
@connect(
  state => ({
    feed: getFeed(state),
    posts: getPosts(state),
    pendingBookmarks: getPendingBookmarks(state),
    isBookmarksLoading: getIsBookmarksLoading(state),
  }),
  { getBookmarks, getUserMetadata, showPostModal },
)
export default class Bookmarks extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    isBookmarksLoading: PropTypes.bool,
    pendingBookmarks: PropTypes.arrayOf(PropTypes.string),
    getBookmarks: PropTypes.func,
    getUserMetadata: PropTypes.func,
  };

  static defaultProps = {
    isBookmarksLoading: false,
    pendingBookmarks: [],
    getBookmarks: () => {},
    getUserMetadata: () => {},
  };

  componentDidMount() {
    this.props.getUserMetadata().then(() => this.props.getBookmarks());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pendingBookmarks.length < this.props.pendingBookmarks.length) {
      this.props.getBookmarks();
    }
  }

  render() {
    const { intl, isBookmarksLoading, feed } = this.props;

    const content = getFeedFromState('bookmarks', 'all', feed);
    const isFetching = getFeedLoadingFromState('bookmarks', 'all', feed) || isBookmarksLoading;
    const hasMore = getFeedHasMoreFromState('bookmarks', 'all', feed);
    const loadContentAction = () => null;
    const loadMoreContentAction = () => null;

    const noBookmarks = !isBookmarksLoading && !isFetching && !content.length;

    return (
      <div className="shifted">
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'bookmarks', defaultMessage: 'Bookmarks' })} - Waivio
          </title>
        </Helmet>
        <div className="feed-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <RightSidebar />
            </div>
          </Affix>
          <div className="center">
            <Feed
              content={content}
              isFetching={isFetching}
              hasMore={hasMore}
              loadContent={loadContentAction}
              loadMoreContent={loadMoreContentAction}
              showPostModal={this.props.showPostModal}
            />
            {noBookmarks && (
              <div className="container">
                <h3 className="text-center">
                  <FormattedMessage
                    id="bookmarks_empty"
                    defaultMessage="You don't have any story saved."
                  />
                </h3>
              </div>
            )}
          </div>
        </div>
        <PostModal />
      </div>
    );
  }
}
