import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getWobjectFollowers } from '../../waivioApi/ApiClient';
import UserDynamicList from '../user/UserDynamicList';
import { changeSorting } from '../../store/authStore/authActions';
import { getAuthorizationUserFollowSort } from '../../store/authStore/authSelectors';

@withRouter
@connect(
  state => ({
    sort: getAuthorizationUserFollowSort(state),
  }),
  {
    handleChange: changeSorting,
  },
)
class WobjFollowers extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    handleChange: PropTypes.func.isRequired,
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

  async fetcher(skip, authUser) {
    const response = await getWobjectFollowers(
      this.props.match.params.name,
      skip.length,
      WobjFollowers.limit,
      this.props.sort,
      authUser,
    );

    WobjFollowers.skip += WobjFollowers.limit;

    return {
      users: response.wobjectFollowers,
      hasMore: response.wobjectFollowers.length === WobjFollowers.limit,
    };
  }

  render() {
    return (
      <UserDynamicList
        limit={WobjFollowers.limit}
        fetcher={this.fetcher}
        sort={this.props.sort}
        handleChange={this.props.handleChange}
      />
    );
  }
}

export default WobjFollowers;
