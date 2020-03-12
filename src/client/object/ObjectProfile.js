import { isEmpty, some } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon, Switch } from 'antd';
import Feed from '../feed/Feed';
import {
  getFeed,
  getIsAuthenticated,
  getObject,
  getSuitableLanguage,
  getLocale,
} from '../reducers';
import {
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../helpers/stateHelpers';
import {
  getMoreObjectPosts,
  getObjectPosts,
  getObjectPostsWithForecasts,
} from '../feed/feedActions';
import { getClientWObj } from '../adapters';
import { showPostModal } from '../app/appActions';
import PostModal from '../post/PostModalContainer';
import IconButton from '../components/IconButton';
import PostChart from '../../investarena/components/PostChart';
import { getIsLoadingPlatformState } from '../../investarena/redux/selectors/platformSelectors';
import { getDataCreatedAt, getDataForecast } from '../../investarena/helpers/diffDateTime';
import { supportedObjectTypes } from '../../investarena/constants/objectsInvestarena';
import PostQuotation from '../../investarena/components/PostQuotation/PostQuotation';
import './ObjectProfile.less';

@withRouter
@connect(
  state => ({
    feed: getFeed(state),
    object: getObject(state),
    isAuthenticated: getIsAuthenticated(state),
    isLoadingPlatform: getIsLoadingPlatformState(state),
    usedLocale: getSuitableLanguage(state),
    locale: getLocale(state),
  }),
  {
    getObjectPosts,
    getMoreObjectPosts,
    getObjectPostsWithForecasts,
    showPostModal,
  },
)
class ObjectProfile extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    object: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    getObjectPosts: PropTypes.func.isRequired,
    getMoreObjectPosts: PropTypes.func.isRequired,
    getObjectPostsWithForecasts: PropTypes.func.isRequired,
    limit: PropTypes.number,
    isLoadingPlatform: PropTypes.bool,
    usedLocale: PropTypes.string,
    locale: PropTypes.string,
  };

  static defaultProps = {
    limit: 10,
    location: {},
    isLoadingPlatform: true,
    usedLocale: 'en-US',
    locale: '',
  };

  state = {
    checked: false,
    skip: 0,
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
    const { match, limit, locale } = this.props;
    if (locale !== nextProps.locale) {
      this.props.getObjectPosts({
        object: match.params.name,
        username: match.params.name,
        limit,
      });
    }
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

  onSwitchChange = isAppFilterOn => {
    const { match, limit } = this.props;
    const { name } = match.params;
    const { skip } = this.state;
    this.setState({ checked: isAppFilterOn });

    if (isAppFilterOn) {
      this.props.getObjectPostsWithForecasts(name, true, skip, limit);
      this.setState(prevState => ({ skip: prevState.skip + limit }));
    } else {
      this.props.getObjectPosts({ object: name, username: name, limit });
    }
  };

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
    const { feed, limit, isLoadingPlatform, object, isAuthenticated } = this.props;
    const wobjectname = this.props.match.params.name;
    const content = getFeedFromState('objectPosts', wobjectname, feed);
    const isFetching = getFeedLoadingFromState('objectPosts', wobjectname, feed);
    const hasMore = getFeedHasMoreFromState('objectPosts', wobjectname, feed);
    let createdAt = null;
    let forecast = null;
    const showChart =
      !isLoadingPlatform && object &&
      some(supportedObjectTypes, objectType => objectType === object.object_type);
    const loadMoreContentAction = () => {
      const { skip } = this.state;
      if (this.state.checked) {
        this.props.getObjectPostsWithForecasts(wobjectname, false, skip, limit);
        this.setState(prevState => ({ skip: prevState.skip + limit }));
      } else {
        this.props.getMoreObjectPosts({
          username: wobjectname,
          authorPermlink: wobjectname,
          limit,
        });
      }
    };

    if (showChart) {
      createdAt = getDataCreatedAt();
      forecast = getDataForecast();
    }
    return (
      <React.Fragment>
        <div className="object-profile">
          {showChart && object.chartid && (
            <div className="object-profile__trade">
              <PostChart
                quoteSecurity={object.chartid}
                createdAt={createdAt}
                forecast={forecast}
                recommend={'Buy'}
                toggleModalPost={() => {}}
                tpPrice={null}
                slPrice={null}
                expForecast={null}
                isObjectProfile
              />
              <PostQuotation quoteSecurity={object.chartid} caller="od-op" />
            </div>
          )}
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
          <div className="feed-layout__switcher">
            <div className="feed-layout__text">
              <FormattedMessage id="onlyForecasts" defaultMessage="Only topics with forecasts" />
            </div>
            <Switch
              defaultChecked
              onChange={this.onSwitchChange}
              checked={this.state.checked}
              size="small"
            />
          </div>
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
                defaultMessage="This topic doesn't have any"
              />
            </div>
          )}
        </div>
        {<PostModal />}
      </React.Fragment>
    );
  }
}

export default ObjectProfile;
