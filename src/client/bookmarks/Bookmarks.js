import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { getPendingBookmarks } from '../store/reducers';
import Feed from '../feed/Feed';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { reload } from '../store/authStore/authActions';
import { getBookmarks } from '../store/feedStore/feedActions';
import { showPostModal } from '../store/appStore/appActions';
import requiresLogin from '../auth/requiresLogin';
import PostModal from '../post/PostModalContainer';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import { getIsReloading } from '../store/authStore/authSelectors';
import { getPosts } from '../store/postsStore/postsSelectors';
import { getFeed } from '../store/feedStore/feedSelectors';

@requiresLogin
@injectIntl
@connect(
  state => ({
    feed: getFeed(state),
    posts: getPosts(state),
    pendingBookmarks: getPendingBookmarks(state),
    reloading: getIsReloading(state),
  }),
  { getBookmarks, reload, showPostModal },
)
export default class Bookmarks extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    reloading: PropTypes.bool,
    pendingBookmarks: PropTypes.arrayOf(PropTypes.string),
    getBookmarks: PropTypes.func,
    reload: PropTypes.func,
  };

  static defaultProps = {
    reloading: false,
    pendingBookmarks: [],
    getBookmarks: () => {},
    reload: () => {},
  };

  componentDidMount() {
    this.props.reload().then(() => this.props.getBookmarks());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pendingBookmarks.length < this.props.pendingBookmarks.length) {
      this.props.getBookmarks();
    }
  }

  render() {
    const { intl, reloading, feed } = this.props;
    const content = getFeedFromState('bookmarks', 'all', feed);
    const isFetching = getFeedLoadingFromState('bookmarks', 'all', feed) || reloading;
    const hasMore = getFeedHasMoreFromState('bookmarks', 'all', feed);
    const noBookmarks = !reloading && !isFetching && !content.length;

    return (
      <React.Fragment>
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'bookmarks', defaultMessage: 'Bookmarks' })} - Waivio
          </title>
        </Helmet>
        <MobileNavigation />
        {noBookmarks ? (
          <div className="container">
            <h3 className="text-center">
              <FormattedMessage
                id="bookmarks_empty"
                defaultMessage="You don't have any story saved."
              />
            </h3>
          </div>
        ) : (
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            showPostModal={this.props.showPostModal}
          />
        )}
        <PostModal />
      </React.Fragment>
    );
  }
}
