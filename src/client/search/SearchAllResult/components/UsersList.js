import { map, isEmpty } from 'lodash';
import UserCard from '../../../components/UserCard';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import {
  getHasMoreUsers,
  getIsStartSearchUser,
  getSearchUsersResults,
} from '../../../../store/searchStore/searchSelectors';
import { followSearchUser, unfollowSearchUser } from '../../../../store/searchStore/searchActions';
import Loading from '../../../components/Icon/Loading';

const UsersList = props => {
  if (props.usersLoading) return <Loading />;
  if (isEmpty(props.searchByUser)) {
    return (
      <div className="SearchAllResult__empty">
        <FormattedMessage id="search_no_result" />
      </div>
    );
  }

  return map(props.searchByUser, user => (
    <UserCard
      user={{ ...user, name: user.account }}
      unfollow={props.unfollowSearchUser}
      follow={props.followSearchUser}
      handleClick={props.handleItemClick}
    />
  ));
};

export default connect(
  state => ({
    searchByUser: getSearchUsersResults(state),
    usersLoading: getIsStartSearchUser(state),
  }),
  {
    unfollowSearchUser,
    followSearchUser,
  },
)(UsersList);
