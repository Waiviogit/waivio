import React from 'react';
import PropTypes from 'prop-types';
import { getWobjectFollowers } from '../../waivioApi/ApiClient';
import UserDynamicList from '../user/UserDynamicList';

export default class WobjFollowers extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
  };

  static limit = 50;

  fetcher = async skip => {
    const { match } = this.props;
    const response = await getWobjectFollowers(match.params.name, skip.length, WobjFollowers.limit);
    return { users: response, hasMore: skip.length === WobjFollowers.limit };
  };

  render() {
    return <UserDynamicList limit={WobjFollowers.limit} fetcher={this.fetcher} />;
  }
}
