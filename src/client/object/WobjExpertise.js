import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getWobjectsExpertise } from '../../waivioApi/ApiClient';
import UserDynamicList from '../user/UserDynamicList';
import {
  getAuthenticatedUserName,
  getAuthorizationUserFollowSort,
} from '../store/authStore/authSelectors';

@connect(state => ({
  user: getAuthenticatedUserName(state),
  sort: getAuthorizationUserFollowSort(state),
}))
export default class WobjExpertise extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    user: PropTypes.string.isRequired,
  };

  static limit = 30;

  state = {
    sort: 'rank',
  };

  handleChange = sort => {
    this.setState({
      sort,
    });

    return Promise.resolve();
  };

  fetcher = skip => {
    const { match } = this.props;

    return new Promise(async resolve => {
      const data = await getWobjectsExpertise(
        this.props.user,
        match.params.name,
        skip.length,
        WobjExpertise.limit,
        this.state.sort,
      );

      resolve({ users: data.users, hasMore: data.users.length === WobjExpertise.limit });
    });
  };

  render() {
    return (
      <UserDynamicList
        limit={WobjExpertise.limit}
        fetcher={this.fetcher}
        sort={this.state.sort}
        handleChange={this.handleChange}
      />
    );
  }
}
