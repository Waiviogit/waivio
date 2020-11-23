import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserDynamicList from './UserDynamicList';
import { getFollowersFromAPI } from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName, getAuthorizationUserFollowSort } from '../reducers';

@connect(state => ({
  authUser: getAuthenticatedUserName(state),
  sort: getAuthorizationUserFollowSort(state),
}))
export default class UserFollowers extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    authUser: PropTypes.string,
    sort: PropTypes.string,
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
    const response = await getFollowersFromAPI(
      this.props.match.params.name,
      this.limit,
      this.skip,
      this.props.sort,
      this.props.authUser,
    );
    const users = response.followers;
    UserFollowers.skip += UserFollowers.limit;
    return { users, hasMore: response.hasMore };
  }

  render() {
    return <UserDynamicList limit={UserFollowers.limit} fetcher={this.fetcher} />;
  }
}
