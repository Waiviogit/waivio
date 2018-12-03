import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import Feed from '../feed/Feed';
import { getIsAuthenticated, getAuthenticatedUser, getFeed } from '../reducers';
import {
  getFeedLoadingFromState,
  getFeedFetchedFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../helpers/stateHelpers';
import { getObjectPosts, getMoreObjectPosts } from '../feed/feedActions';
import { showPostModal } from '../app/appActions';
import PostModal from '../post/PostModalContainer';

@withRouter
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    feed: getFeed(state),
  }),
  {
    getObjectPosts,
    getMoreObjectPosts,
    showPostModal,
  },
)
export default class ObjectProfile extends React.Component {
  static propTypes = {
    authenticatedUser: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    limit: PropTypes.number,
    getObjectPosts: PropTypes.func,
    getMoreObjectPosts: PropTypes.func,
  };

  static defaultProps = {
    limit: 10,
    location: {},
    getObjectPosts: () => {},
    getMoreObjectPosts: () => {},
  };

  componentDidMount() {
    const { match, limit } = this.props;
    const { name } = match.params;

    this.props.getObjectPosts({
      object: name,
      username: this.props.authenticatedUser.name,
      limit,
    });
  }

  render() {
    const { authenticatedUser, feed, limit } = this.props;
    const wobjectname = this.props.match.params.name;
    const content = getFeedFromState('objectPosts', authenticatedUser.name, feed);
    const isFetching = getFeedLoadingFromState('objectPosts', authenticatedUser.name, feed);
    const fetched = getFeedFetchedFromState('objectPosts', authenticatedUser.name, feed);
    const hasMore = getFeedHasMoreFromState('objectPosts', authenticatedUser.name, feed);
    const loadMoreContentAction = () => {
      this.props.getMoreObjectPosts({
        tag: wobjectname,
        username: authenticatedUser.name,
        limit,
      });
    };

    return (
      <div>
        <div className="profile">
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadMoreContent={loadMoreContentAction}
            showPostModal={this.props.showPostModal}
          />
          {_.isEmpty(content) &&
            fetched && (
              <div className="text-center">
                <h3>
                  <FormattedMessage
                    id="empty_object_profile"
                    defaultMessage="This object doesn't have any story published yet."
                  />
                </h3>
              </div>
            )}
        </div>
        {<PostModal />}
      </div>
    );
  }
}
