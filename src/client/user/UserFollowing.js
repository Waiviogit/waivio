import React from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';
import UserDynamicList from './UserDynamicList';
import { getFollowingsFromAPI, getWobjectFollowing } from '../../waivioApi/ApiClient';
import ObjectDynamicList from '../object/ObjectDynamicList';
import {
  getAuthenticatedUserName,
  getUser,
  isGuestUser,
  getAuthorizationUserFollowSort,
  getLocale,
} from '../store/reducers';
import { notify } from '../app/Notification/notificationActions';
import './UserFollowing.less';

const TabPane = Tabs.TabPane;

@connect(
  (state, ownProps) => ({
    user: getUser(state, ownProps.match.params.name),
    authUser: getAuthenticatedUserName(state),
    isGuest: isGuestUser(state),
    sort: getAuthorizationUserFollowSort(state),
    locale: getLocale(state),
  }),
  {
    notify,
  },
)
export default class UserFollowing extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    authUser: PropTypes.string,
    sort: PropTypes.string,
    locale: PropTypes.string.isRequired,
  };

  static defaultProps = {
    authUser: '',
    sort: 'recency',
  };

  static limit = 50;

  constructor(props) {
    super(props);

    this.fetcher = this.fetcher.bind(this);
  }
  skip = 0;
  limit = 100;

  async fetcher() {
    const response = await getFollowingsFromAPI(
      this.props.match.params.name,
      this.limit,
      this.skip,
      this.props.authUser,
      this.props.sort,
    );
    const users = response.users;

    UserFollowing.skip += UserFollowing.limit;

    return { users, hasMore: response.hasMore };
  }

  objectFetcher = skip => {
    const { match, authUser, locale } = this.props;

    return getWobjectFollowing(match.params.name, skip, UserFollowing.limit, authUser, locale);
  };

  render() {
    const { user } = this.props;

    return (
      <div className="UserFollowing">
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <React.Fragment>
                <span className="UserFollowing__item">
                  <FormattedMessage id="users" defaultMessage="Users" />
                </span>
                <span className="UserFollowing__badge">
                  <FormattedNumber
                    value={user.users_following_count ? user.users_following_count : 0}
                  />
                </span>
              </React.Fragment>
            }
            key="1"
          >
            <UserDynamicList limit={UserFollowing.limit} fetcher={this.fetcher} />
          </TabPane>
          <TabPane
            tab={
              <React.Fragment>
                <span className="UserFollowing__item">
                  <FormattedMessage id="objects" defaultMessage="Objects" />
                </span>
                <span className="UserFollowing__badge">
                  <FormattedNumber
                    value={user.objects_following_count ? user.objects_following_count : 0}
                  />
                </span>
              </React.Fragment>
            }
            key="2"
          >
            <ObjectDynamicList limit={UserFollowing.limit} fetcher={this.objectFetcher} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
