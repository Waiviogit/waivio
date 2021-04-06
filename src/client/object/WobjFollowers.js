import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getWobjectFollowers } from '../../waivioApi/ApiClient';
import UserDynamicList from '../user/UserDynamicList';
import {
  getAuthenticatedUserName,
  getAuthorizationUserFollowSort,
} from '../store/authStore/authSelectors';

@connect(state => ({
  user: getAuthenticatedUserName(state),
  sort: getAuthorizationUserFollowSort(state),
}))
class WobjFollowers extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    user: PropTypes.string.isRequired,
    sort: PropTypes.string,
  };

  static defaultProps = {
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
    const response = await getWobjectFollowers(
      this.props.match.params.name,
      this.skip,
      WobjFollowers.limit,
      this.props.sort,
      this.props.user,
    );

    WobjFollowers.skip += WobjFollowers.limit;

    return { users: response.wobjectFollowers, hasMore: response.length === WobjFollowers.limit };
  }

  render() {
    return <UserDynamicList limit={WobjFollowers.limit} fetcher={this.fetcher} />;
  }
}

export default WobjFollowers;
