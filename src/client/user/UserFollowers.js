import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import UserDynamicList from './UserDynamicList';
import { getFollowersFromAPI } from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../reducers';

const UserFollowers = ({ match }) => {
  const limit = 50;
  let skip = 0;
  const sort = useSelector(state => state.auth.sort);
  const authUser = useSelector(getAuthenticatedUserName);

  const fetcher = async () => {
    const response = await getFollowersFromAPI(match.params.name, limit, skip, sort, authUser);
    const users = response.followers;
    skip += limit;
    return { users, hasMore: response.hasMore };
  };

  return <UserDynamicList limit={limit} fetcher={fetcher} />;
};

UserFollowers.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default UserFollowers;
