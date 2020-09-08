import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getWobjectFollowers } from '../../waivioApi/ApiClient';
import UserDynamicList from '../user/UserDynamicList';
import { getAuthenticatedUserName, getAuthorizationUserFollowSort } from '../reducers';

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

  fetcher = async () => {
    const { match } = this.props;
    const skip = 0;
    const response = await getWobjectFollowers(
      match.params.name,
      skip,
      WobjFollowers.limit,
      this.props.sort,
      this.props.user,
    );
    console.log(skip);
    return { users: response.wobjectFollowers, hasMore: response.length === WobjFollowers.limit };
  };

  render() {
    return <UserDynamicList limit={WobjFollowers.limit} fetcher={this.fetcher} />;
  }
}

export default WobjFollowers;
