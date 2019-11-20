import { isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';

import Feed from '../feed/Feed';
import { getFeed, getIsAuthenticated, getObject, getSuitableLanguage } from '../reducers';
import {
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../helpers/stateHelpers';
import { getClientWObj } from '../adapters';
import { getObjectPosts, getMoreObjectPosts } from '../feed/feedActions';
import { showPostModal } from '../app/appActions';
import PostModal from '../post/PostModalContainer';
import IconButton from '../components/IconButton';
import './ObjectProfile.less';

@withRouter
@connect(
  state => ({
    feed: getFeed(state),
    object: getObject(state),
    isAuthenticated: getIsAuthenticated(state),
    usedLocale: getSuitableLanguage(state),
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
    isAuthenticated: PropTypes.bool.isRequired,
    getObjectPosts: PropTypes.func,
    getMoreObjectPosts: PropTypes.func,
    usedLocale: PropTypes.string,
  };

  static defaultProps = {
    limit: 10,
    location: {},
    getObjectPosts: () => {},
    getMoreObjectPosts: () => {},
    usedLocale: 'en-US',
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

  handleCreatePost = () => {
    const { history, object, usedLocale } = this.props;
    if (object && object.author_permlink) {
      let redirectUrl = `/editor?object=[${object.name}](${object.author_permlink})`;
      if (!isEmpty(object.parent)) {
        const parentObject = getClientWObj(object.parent, usedLocale);
        redirectUrl += `&object=[${parentObject.name}](${parentObject.author_permlink})`;
      }
      history.push(redirectUrl);
    }
  };

  render() {
    const { feed, limit, isAuthenticated } = this.props;
    const wobjectname = this.props.match.params.name;
    const content = getFeedFromState('objectPosts', wobjectname, feed);
    const isFetching = getFeedLoadingFromState('objectPosts', wobjectname, feed);
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
        <div className="object-profile">
          {isAuthenticated && (
            <div className="object-profile__row justify-end">
              <IconButton
                icon={<Icon type="plus-circle" />}
                onClick={this.handleCreatePost}
                caption={
                  <FormattedMessage id="write_new_review" defaultMessage="Write new review" />
                }
              />
            </div>
          )}
          {!isEmpty(content) || isFetching ? (
            <Feed
              content={content}
              isFetching={isFetching}
              hasMore={hasMore}
              loadMoreContent={loadMoreContentAction}
              showPostModal={this.props.showPostModal}
            />
          ) : (
            <div className="object-profile__row justify-center">
              <FormattedMessage
                id="empty_object_profile"
                defaultMessage="This object doesn't have any"
              />
            </div>
          )}
        </div>
        {<PostModal />}
      </React.Fragment>
    );
  }
}
