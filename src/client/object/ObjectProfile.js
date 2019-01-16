import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';

import Feed from '../feed/Feed';
import { getFeed, getObject } from '../reducers';
import {
  getFeedLoadingFromState,
  getFeedFetchedFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../helpers/stateHelpers';
import { getObjectPosts, getMoreObjectPosts } from '../feed/feedActions';
import { showPostModal } from '../app/appActions';
import PostModal from '../post/PostModalContainer';
import './ObjectProfile.less';

@withRouter
@connect(
  state => ({
    feed: getFeed(state),
    object: getObject(state),
  }),
  {
    getObjectPosts,
    getMoreObjectPosts,
    showPostModal,
  },
)
export default class ObjectProfile extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    object: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
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
      username: name,
      limit,
    });
  }

  handleCreatePost = () => {
    const { history, object } = this.props;
    history.push(`/editor?object=${object.author_permlink}`);
  };

  render() {
    const { feed, limit } = this.props;
    const wobjectname = this.props.match.params.name;
    const content = getFeedFromState('objectPosts', wobjectname, feed);
    const isFetching = getFeedLoadingFromState('objectPosts', wobjectname, feed);
    const fetched = getFeedFetchedFromState('objectPosts', wobjectname, feed);
    const hasMore = getFeedHasMoreFromState('objectPosts', wobjectname, feed);
    const loadMoreContentAction = () => {
      this.props.getMoreObjectPosts({
        username: wobjectname,
        authorPermlink: wobjectname,
        limit,
      });
    };

    return (
      <React.Fragment>
        <div className="profile">
          <div className="wobj-history__add">
            <a role="presentation" onClick={this.handleCreatePost}>
              <Icon type="plus-circle" className="proposition-line__icon" />
            </a>
            <FormattedMessage id="add_new_proposition" defaultMessage="Add" />
          </div>
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadMoreContent={loadMoreContentAction}
            showPostModal={this.props.showPostModal}
          />
          {_.isEmpty(content) && fetched && (
            <div className="ObjectProfile__empty">
              <FormattedMessage
                id="empty_object_profile"
                defaultMessage="This object doesn't have any reviews."
              />
            </div>
          )}
        </div>
        {<PostModal />}
      </React.Fragment>
    );
  }
}
