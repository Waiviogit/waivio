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
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../helpers/stateHelpers';
import { getObjectPosts, getMoreObjectPosts } from '../feed/feedActions';
import { showPostModal } from '../app/appActions';
import PostModal from '../post/PostModalContainer';
import IconButton from '../components/IconButton';
import './ObjectProfile.less';
import PostChart from "../../investarena/components/PostChart";
import {getIsLoadingPlatformState} from "../../investarena/redux/selectors/platformSelectors";
import {getDataCreatedAt, getDataForecast} from "../../investarena/helpers/diffDateTime";

@withRouter
@connect(
  state => ({
    feed: getFeed(state),
    object: getObject(state),
    isLoadingPlatform: getIsLoadingPlatformState(state)
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
    isLoadingPlatform: PropTypes.bool,
    getObjectPosts: PropTypes.func,
    getMoreObjectPosts: PropTypes.func,
  };

  static defaultProps = {
    limit: 10,
    location: {},
    isLoadingPlatform: true,
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
    const { feed, limit, isLoadingPlatform } = this.props;
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
    const createdAt = getDataCreatedAt();
    const forecast = getDataForecast();

    return (
      <React.Fragment>
        <div className="object-profile">
          {!isLoadingPlatform && <PostChart
            quoteSecurity={'AUDCAD'}
            expiredBars={[]}
            createdAt={createdAt}
            forecast={forecast}
            recommend={'Buy'}
            expiredByTime={undefined}
            expiredTimeScale={undefined}
            toggleModalPost={() => {}}
            tpPrice={null}
            slPrice={null}
            expiredAt={undefined}
            isObjectProfile
          />}
          <div className="object-profile__row align-right">
            <IconButton
              icon={<Icon type="plus-circle" />}
              onClick={this.handleCreatePost}
              caption={<FormattedMessage id="write_new_review" defaultMessage="Write new review" />}
            />
          </div>
          {!_.isEmpty(content) || isFetching ? (
            <Feed
              content={content}
              isFetching={isFetching}
              hasMore={hasMore}
              loadMoreContent={loadMoreContentAction}
              showPostModal={this.props.showPostModal}
            />
          ) : (
            <div className="object-profile__row align-center">
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
