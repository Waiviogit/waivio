import { connect } from 'react-redux';

import {
  getObjectFollowersHasMore,
  getObjectFollowersUsers,
} from '../../../../../store/wObjectStore/wObjectSelectors';
import WobjectSidebarFollowers from './WobjectSidebarFollowers';
import { unfollowUser, followUser } from '../../../../../store/usersStore/usersActions';

const mapStateToProps = state => ({
  followers: getObjectFollowersUsers(state),
  hasMore: getObjectFollowersHasMore(state),
});

const mapDispatchToProps = dispatch => ({
  unfollowUser: payload => dispatch(unfollowUser(payload)),
  followUser: payload => dispatch(followUser(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WobjectSidebarFollowers);
