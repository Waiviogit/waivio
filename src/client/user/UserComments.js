import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import Feed from '../feed/Feed';
import PostModal from '../post/PostModalContainer';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../../common/helpers/stateHelpers';
import { showPostModal } from '../../store/appStore/appActions';
import { getUserComments, getMoreUserComments } from '../../store/feedStore/feedActions';
import EmptyMutedUserProfile from '../statics/MutedContent';
import { getFeed } from '../../store/feedStore/feedSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import Loading from '../components/Icon/Loading';

class UserProfilePosts extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape(),
    showPostModal: PropTypes.func.isRequired,
    limit: PropTypes.number,
    getUserComments: PropTypes.func,
    getMoreUserComments: PropTypes.func,
  };

  static defaultProps = {
    limit: 10,
    getUserComments: () => {},
    getMoreUserComments: () => {},
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
    const { feed, match, limit, user } = this.props;
    const username = match.params.name;
    const content = getFeedFromState('comments', username, feed);
    const isFetching = getFeedLoadingFromState('comments', username, feed);
    const hasMore = getFeedHasMoreFromState('comments', username, feed);
    console.log('tututu');
    const loadMoreContentAction = () => {
      this.props.getMoreUserComments({ username, skip: UserProfilePosts.skip, limit });
      UserProfilePosts.skip += this.props.limit;
    };

    if (!isEmpty(user.mutedBy) || user.muted) return <EmptyMutedUserProfile user={user} />;

    if (isEmpty(content) && !isFetching) {
      return (
        <div role="presentation" className="Threads__row justify-center">
          <FormattedMessage id="empty_comments" defaultMessage="There are no comments yet" />
        </div>
      );
    }

    return isFetching && content?.length < limit ? (
      <Loading />
    ) : (
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

export default connect(
  (state, ownProps) => ({
    feed: getFeed(state),
    user: getUser(state, ownProps.match.params.name),
  }),
  {
    getUserComments,
    getMoreUserComments,
    showPostModal,
  },
)(UserProfilePosts);
