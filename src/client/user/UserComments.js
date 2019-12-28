import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Feed from '../feed/Feed';
import PostModal from '../post/PostModalContainer';
import { getAuthenticatedUserName, getFeed, isGuestUser } from '../reducers';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { showPostModal } from '../app/appActions';
import { getUserComments, getMoreUserComments } from '../feed/feedActions';

@connect(
  state => ({
    feed: getFeed(state),
    isGuest: isGuestUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
  }),
  {
    getUserComments,
    getMoreUserComments,
    showPostModal,
  },
)
export default class UserProfilePosts extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    limit: PropTypes.number,
    getUserComments: PropTypes.func,
    getMoreUserComments: PropTypes.func,
    isGuest: PropTypes.bool,
    authenticatedUserName: PropTypes.string,
  };

  static defaultProps = {
    limit: 10,
    getUserComments: () => {},
    getMoreUserComments: () => {},
    isGuest: false,
    authenticatedUserName: '',
  };

  componentDidMount() {
    this.props.getUserComments({
      username: this.props.match.params.name,
    });
  }

  render() {
    const { feed, match, limit, isGuest, authenticatedUserName } = this.props;
    const username = match.params.name;
    if (isGuest && username === authenticatedUserName) {
      return (
        <FormattedMessage
          id="guest_comments"
          defaultMessage="Guest users can't see their own comments"
        />
      );
    }
    const content = getFeedFromState('comments', username, feed);
    const isFetching = getFeedLoadingFromState('comments', username, feed);
    const hasMore = getFeedHasMoreFromState('comments', username, feed);
    const loadMoreContentAction = () => this.props.getMoreUserComments({ username, limit });

    return (
      <React.Fragment>
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadMoreContent={loadMoreContentAction}
          showPostModal={this.props.showPostModal}
        />
        <PostModal />
      </React.Fragment>
    );
  }
}
