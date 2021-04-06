import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import Feed from '../feed/Feed';
import PostModal from '../post/PostModalContainer';
import { getUser } from '../store/reducers';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { showPostModal } from '../store/appStore/appActions';
import { getUserComments, getMoreUserComments } from '../store/feedStore/feedActions';
import EmptyMutedUserProfile from '../statics/MutedContent';
import { getAuthenticatedUserName, isGuestUser } from '../store/authStore/authSelectors';
import { getFeed } from '../store/feedStore/feedSelectors';

@connect(
  (state, ownProps) => ({
    feed: getFeed(state),
    isGuest: isGuestUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    user: getUser(state, ownProps.match.params.name),
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
    user: PropTypes.shape(),
    showPostModal: PropTypes.func.isRequired,
    limit: PropTypes.number,
    getUserComments: PropTypes.func,
    getMoreUserComments: PropTypes.func,
    authenticatedUserName: PropTypes.string,
  };

  static defaultProps = {
    limit: 10,
    getUserComments: () => {},
    getMoreUserComments: () => {},
    isGuest: false,
    authenticatedUserName: '',
    user: {},
  };

  static skip = 0;

  componentDidMount() {
    this.props.getUserComments({
      username: this.props.match.params.name,
    });
    UserProfilePosts.skip += this.props.limit;
  }

  render() {
    const { feed, match, limit, authenticatedUserName, user } = this.props;
    const username = match.params.name;
    const content = getFeedFromState('comments', username, feed);
    const isFetching = getFeedLoadingFromState('comments', username, feed);
    const hasMore = getFeedHasMoreFromState('comments', username, feed);
    const loadMoreContentAction = () => {
      this.props.getMoreUserComments({ username, skip: UserProfilePosts.skip, limit });
      UserProfilePosts.skip += this.props.limit;
    };

    if (!isEmpty(user.mutedBy) || user.muted)
      return <EmptyMutedUserProfile user={user} authName={authenticatedUserName} />;

    return (
      <React.Fragment>
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadMoreContent={loadMoreContentAction}
          showPostModal={this.props.showPostModal}
          userComments
        />
        <PostModal />
      </React.Fragment>
    );
  }
}
