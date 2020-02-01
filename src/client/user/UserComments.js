import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import Feed from '../feed/Feed';
import PostModal from '../post/PostModalContainer';
import {getFeed} from '../reducers';
import {getFeedFromState, getFeedHasMoreFromState, getFeedLoadingFromState,} from '../helpers/stateHelpers';
import {showPostModal} from '../app/appActions';
import {getMoreUserComments, getUserComments} from '../feed/feedActions';

@connect(
  state => ({
    feed: getFeed(state),
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
  };

  static defaultProps = {
    limit: 10,
    getUserComments: () => {
    },
    getMoreUserComments: () => {
    },
  };

  // eslint-disable-next-line react/sort-comp
  static skip = 0;

  componentDidMount() {
    this.props.getUserComments({
      username: this.props.match.params.name,
    });

    UserProfilePosts.skip += this.props.limit;
  }

  render() {
    const {feed, match, limit} = this.props;
    const username = match.params.name;

    const content = getFeedFromState('comments', username, feed);
    const isFetching = getFeedLoadingFromState('comments', username, feed);
    const hasMore = getFeedHasMoreFromState('comments', username, feed);
    const loadMoreContentAction = () => {
      this.props.getMoreUserComments({username, skip: UserProfilePosts.skip, limit});
      UserProfilePosts.skip += this.props.limit;
    };

    return (
      <React.Fragment>
        {(content && content.length) || isFetching ? (
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadMoreContent={loadMoreContentAction}
            showPostModal={this.props.showPostModal}
          />
        ) : (
          <div className="Comments__empty">
            <FormattedMessage id="empty_comments" defaultMessage="There are no comments yet." />
          </div>
        )}
        <PostModal />
      </React.Fragment>
    );
  }
}
