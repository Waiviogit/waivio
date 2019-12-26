import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Feed from '../feed/Feed';
import PostModal from '../post/PostModalContainer';
import { getFeed, isGuestUser } from '../reducers';
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
  };

  static defaultProps = {
    limit: 10,
    getUserComments: () => {},
    getMoreUserComments: () => {},
    isGuest: false,
  };

  componentDidMount() {
    this.props.getUserComments({
      username: this.props.match.params.name,
    });
  }

  render() {
    const { feed, match, limit, isGuest } = this.props;
    const username = match.params.name;
    if (isGuest) {
      return (
        <FormattedMessage
          id="guest_comments"
          defaultMessage="Guest user are can't see own comments"
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
