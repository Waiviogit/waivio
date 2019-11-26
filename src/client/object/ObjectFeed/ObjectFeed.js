import { isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Feed from '../../feed/Feed';
import { getFeed } from '../../reducers';
import {
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../../helpers/stateHelpers';
import { getObjectPosts, getMoreObjectPosts } from '../../feed/feedActions';
import { showPostModal } from '../../app/appActions';
import PostModal from '../../post/PostModalContainer';
import './ObjectFeed.less';

@connect(
  state => ({
    feed: getFeed(state),
  }),
  {
    getObjectPosts,
    getMoreObjectPosts,
    showPostModal,
  },
)
export default class ObjectFeed extends React.Component {
  static propTypes = {
    /* from connect */
    feed: PropTypes.shape().isRequired,
    getObjectPosts: PropTypes.func,
    getMoreObjectPosts: PropTypes.func,
    showPostModal: PropTypes.func.isRequired,
    /* passed */
    match: PropTypes.shape().isRequired,
    /* default props */
    limit: PropTypes.number,
  };

  static defaultProps = {
    limit: 10,
    getObjectPosts: () => {},
    getMoreObjectPosts: () => {},
  };

  componentDidMount() {
    const { match, limit } = this.props;
    const { name } = match.params;

    this.props.getObjectPosts({
      object: name,
      username: name,
      limit,
    });
  }
  componentWillReceiveProps(nextProps) {
    const { match, limit } = this.props;
    if (match.params.name !== nextProps.match.params.name) {
      if (
        nextProps.feed &&
        nextProps.feed.objectPosts &&
        !nextProps.feed.objectPosts[nextProps.match.params.name]
      ) {
        this.props.getObjectPosts({
          object: nextProps.match.params.name,
          username: nextProps.match.params.name,
          limit,
        });
      }
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { feed, limit } = this.props;
    const wObjectName = this.props.match.params.name;
    const content = getFeedFromState('objectPosts', wObjectName, feed);
    const isFetching = getFeedLoadingFromState('objectPosts', wObjectName, feed);
    const hasMore = getFeedHasMoreFromState('objectPosts', wObjectName, feed);
    const loadMoreContentAction = () => {
      this.props.getMoreObjectPosts({
        username: wObjectName,
        authorPermlink: wObjectName,
        limit,
      });
    };

    return (
      <div className="object-feed">
        {!isEmpty(content) || isFetching ? (
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadMoreContent={loadMoreContentAction}
            showPostModal={this.props.showPostModal}
          />
        ) : (
          <div className="object-feed__row justify-center">
            <FormattedMessage
              id="empty_object_profile"
              defaultMessage="This object doesn't have any"
            />
          </div>
        )}
        {<PostModal />}
      </div>
    );
  }
}
