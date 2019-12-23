import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getFollowers } from '../helpers/apiHelpers';
import UserDynamicList from './UserDynamicList';
import { isGuestUser } from '../reducers';
import { getFollowersFromAPI, getUserAccount } from '../../waivioApi/ApiClient';

const UserFollowers = ({ match }) => {
  const isGuest = useSelector(isGuestUser);

  const limit = 50;

  let skip = 0;

  const fetcher = async previous => {
    const startFrom =
      previous[previous.length - 1] && previous[previous.length - 1].name
        ? previous[previous.length - 1].name
        : '';
    if (isGuest) {
      const response = await getFollowersFromAPI(match.params.name, 'blog', limit, skip);
      const users = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const user of response) {
        // eslint-disable-next-line no-await-in-loop
        const userData = await getUserAccount(user);
        users.push(userData);
      }
      skip += limit;
      return users;
    }
    return getFollowers(match.params.name, startFrom, 'blog', limit);
  };

  return <UserDynamicList limit={limit} fetcher={fetcher} />;
};

UserFollowers.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default UserFollowers;
