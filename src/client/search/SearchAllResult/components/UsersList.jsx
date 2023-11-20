import { map, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import UserCard from '../../../components/UserCard';
import {
  getExpertsUsersResults,
  getLoadingExpertsUsersResults,
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
      user={user}
      key={user.name}
      unfollow={props.unfollowSearchUser}
      follow={props.followSearchUser}
      handleClick={props.handleItemClick}
    />
  ));
};

UsersList.propTypes = {
  usersLoading: PropTypes.bool,
  searchByUser: PropTypes.arrayOf(PropTypes.string),
  unfollowSearchUser: PropTypes.func,
  followSearchUser: PropTypes.func,
  handleItemClick: PropTypes.func,
};
UsersList.defaultProps = {
  usersLoading: false,
  searchByUser: '',
  unfollowSearchUser: () => {},
  followSearchUser: () => {},
  handleItemClick: () => {},
};

export default connect(
  state => ({
    searchByUser: getExpertsUsersResults(state),
    usersLoading: getLoadingExpertsUsersResults(state),
  }),
  {
    unfollowSearchUser,
    followSearchUser,
  },
)(UsersList);
