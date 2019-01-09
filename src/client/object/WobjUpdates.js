import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCommentsList, getFeed, getObject } from '../reducers';
import Feed from '../feed/Feed';
import PostModal from '../post/PostModalContainer';
import {
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../helpers/stateHelpers';
import { getObjectComments } from '../feed/feedActions';
import { showPostModal } from '../app/appActions';

@connect(
  state => ({
    feed: getFeed(state),
    commentsList: getCommentsList(state),
    object: getObject(state),
  }),
  {
    getObjectComments,
    showPostModal,
  },
)
export default class WobjUpdates extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    getObjectComments: PropTypes.func,
    object: PropTypes.shape(),
  };

  static defaultProps = {
    limit: 10,
    getObjectComments: () => {},
    getUserComments: () => {},
    getMoreUserComments: () => {},
    commentsList: {},
    object: {},
  };

  componentDidMount() {
    this.props.getObjectComments(this.props.object.author, this.props.object.author_permlink);
  }

  render() {
    const { feed, object } = this.props;

    const content = getFeedFromState('comments', object.author, feed);
    const isFetching = getFeedLoadingFromState('comments', object.author, feed);
    const hasMore = getFeedHasMoreFromState('comments', object.author, feed);

    return (
      <React.Fragment>
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          showPostModal={this.props.showPostModal}
        />
        <PostModal />
      </React.Fragment>
    );
  }
}
