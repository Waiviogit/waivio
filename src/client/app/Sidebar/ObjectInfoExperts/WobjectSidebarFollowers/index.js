import { connect } from 'react-redux';

import {
  getObjectFollowersHasMore,
  getObjectFollowersUsers,
} from '../../../../../store/wObjectStore/wObjectSelectors';
import WobjectSidebarFollowers from './WobjectSidebarFollowers';
import { unfollowUser, followUser } from '../../../../../store/usersStore/usersActions';
import { getObjectFollowers } from '../../../../../store/wObjectStore/wobjectsActions';
import { getAuthenticatedUserName } from '../../../../../store/authStore/authSelectors';

const mapStateToProps = state => ({
  followers: getObjectFollowersUsers(state),
  userName: getAuthenticatedUserName(state),
  hasMore: getObjectFollowersHasMore(state),
});

const mapDispatchToProps = dispatch => ({
  unfollowUser: payload => dispatch(unfollowUser(payload)),
  followUser: payload => dispatch(followUser(payload)),
  getObjFollowers: payload => dispatch(getObjectFollowers(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WobjectSidebarFollowers);
