import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCommentsList, getFeed, getObject } from '../reducers';
import Feed from '../feed/Feed';
import PostModal from '../post/PostModalContainer';
import { getFeedFromState, getFeedLoadingFromState } from '../helpers/stateHelpers';
import { getObjectComments } from '../feed/feedActions';

@connect(
  state => ({
    feed: getFeed(state),
    commentsList: getCommentsList(state),
    object: getObject(state),
  }),
  {
    getObjectComments,
  },
)
export default class WobjUpdates extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
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

    const content = getFeedFromState('comments', object.author, feed).sort((a, b) => b - a);
    const isFetching = getFeedLoadingFromState('comments', object.author, feed);

    return (
      <React.Fragment>
        <Feed content={content} isFetching={isFetching} />
        <PostModal />
      </React.Fragment>
    );
  }
}
