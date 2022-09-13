import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserDynamicList from './UserDynamicList';
import { getFollowingsFromAPI, getWobjectFollowing } from '../../waivioApi/ApiClient';
import { notify } from '../app/Notification/notificationActions';
import {
  getAuthenticatedUserName,
  getAuthorizationUserFollowSort,
  isGuestUser,
} from '../../store/authStore/authSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import { getLocale } from '../../store/settingsStore/settingsSelectors';
import { changeSorting } from '../../store/authStore/authActions';

import './UserFollowing.less';

@connect(
  (state, ownProps) => ({
    user: getUser(state, ownProps.match.params.name),
    authUser: getAuthenticatedUserName(state),
    isGuest: isGuestUser(state),
    sort: getAuthorizationUserFollowSort(state),
    locale: getLocale(state),
  }),
  {
    handleChange: changeSorting,
    notify,
  },
)
export default class UserFollowing extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    authUser: PropTypes.string,
    sort: PropTypes.string,
    locale: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
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
    return (
      <div className="UserFollowing ">
        <UserDynamicList
          limit={UserFollowing.limit}
          fetcher={this.fetcher}
          sort={this.props.sort}
          handleChange={this.props.handleChange}
        />
      </div>
    );
  }
}
