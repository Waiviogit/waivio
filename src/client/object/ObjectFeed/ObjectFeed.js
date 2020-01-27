import { isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Feed from '../../feed/Feed';
import { getFeed, getReadLanguages } from '../../reducers';
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
    readLocales: getReadLanguages(state),
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
    readLocales: PropTypes.arrayOf(PropTypes.string),
    /* passed */
    match: PropTypes.shape().isRequired,
    /* default props */
    limit: PropTypes.number,
  };

  static defaultProps = {
    limit: 10,
    getObjectPosts: () => {},
    getMoreObjectPosts: () => {},
    readLocales: [],
  };

  componentDidMount() {
    const { match, limit, readLocales } = this.props;
    const { name } = match.params;

    this.props.getObjectPosts({
      object: name,
      username: name,
      readLanguages: readLocales,
      limit,
    });
  }
  componentWillReceiveProps(nextProps) {
    const { match, limit, readLocales } = this.props;
    if (
      readLocales !== nextProps.readLocales ||
      match.params.name !== nextProps.match.params.name
    ) {
      if (
        readLocales !== nextProps.readLocales ||
        (nextProps.feed &&
          nextProps.feed.objectPosts &&
          !nextProps.feed.objectPosts[nextProps.match.params.name])
      ) {
        this.props.getObjectPosts({
          object: nextProps.match.params.name,
          username: nextProps.match.params.name,
          readLanguages: nextProps.readLocales,
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
