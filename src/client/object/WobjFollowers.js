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

  fetcher = async skip => {
    const { match } = this.props;
    const response = await getWobjectFollowers(
      match.params.name,
      skip.length,
      WobjFollowers.limit,
      this.props.user,
      this.props.sort,
    );
    return { users: response, hasMore: response.length === WobjFollowers.limit };
  };

  render() {
    return <UserDynamicList limit={WobjFollowers.limit} fetcher={this.fetcher} />;
  }
}

export default WobjFollowers;
