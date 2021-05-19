import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserDynamicList from './UserDynamicList';
import { getFollowersFromAPI } from '../../waivioApi/ApiClient';
import {
  getAuthenticatedUserName,
  getAuthorizationUserFollowSort,
} from '../store/authStore/authSelectors';
import { changeSorting } from '../store/authStore/authActions';

const UserFollowers = ({ match, sort, authUser, handleChange }) => {
  const limit = 50;
  let skip = 0;

  const fetcher = async () => {
    const response = await getFollowersFromAPI(match.params.name, limit, skip, sort, authUser);
    const users = response.followers;

    skip += limit;

    return { users, hasMore: response.hasMore };
  };

  return (
    <UserDynamicList limit={limit} fetcher={fetcher} sort={sort} handleChange={handleChange} />
  );
};

UserFollowers.propTypes = {
  match: PropTypes.shape().isRequired,
  sort: PropTypes.string.isRequired,
  authUser: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    sort: getAuthorizationUserFollowSort(state),
    authUser: getAuthenticatedUserName(state),
  }),
  {
    handleChange: changeSorting,
  },
)(UserFollowers);
