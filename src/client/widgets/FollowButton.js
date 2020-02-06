import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getAuthenticatedUserName,
  getFollowingList,
  getFollowingObjectsList,
  getPendingFollows,
  getPendingFollowingObjects,
} from '../reducers';
import { followUser, unfollowUser } from '../user/userActions';
import { followObject, unfollowObject } from '../object/wobjActions';
import withAuthAction from '../auth/withAuthActions';
import Follow from '../components/Button/Follow';

@withAuthAction
@connect(
  (state, ownProps) => ({
    authenticatedUserName: getAuthenticatedUserName(state),
    followingList:
      ownProps.followingType === 'user' ? getFollowingList(state) : getFollowingObjectsList(state),
    pendingFollows:
      ownProps.followingType === 'user'
        ? getPendingFollows(state)
        : getPendingFollowingObjects(state),
  }),
  dispatch =>
    bindActionCreators(
      {
        followUser,
        followObject,
        unfollowUser,
        unfollowObject,
      },
      dispatch,
    ),
)
class FollowButton extends React.Component {
  static propTypes = {
    secondary: PropTypes.bool,
    following: PropTypes.string.isRequired,
    followingType: PropTypes.oneOf(['user', 'wobject']),
    authenticatedUserName: PropTypes.string,
    followingList: PropTypes.arrayOf(PropTypes.string),
    pendingFollows: PropTypes.arrayOf(PropTypes.string).isRequired,
    onActionInitiated: PropTypes.func,
    followUser: PropTypes.func,
    followObject: PropTypes.func,
    unfollowUser: PropTypes.func,
    unfollowObject: PropTypes.func,
  };

  static defaultProps = {
    secondary: false,
    followingType: 'user',
    authenticatedUserName: undefined,
    followingList: [],
    pendingFollows: [],
    followUser: () => {},
    onActionInitiated: () => {},
    followObject: () => {},
    unfollowUser: () => {},
    unfollowObject: () => {},
  };

  constructor(props) {
    super(props);

    this.handleFollowClick = this.handleFollowClick.bind(this);
    this.followClick = this.followClick.bind(this);
  }

  followClick() {
    const { following, followingType } = this.props;
    const isFollowed = this.props.followingList.includes(following);

    switch (followingType) {
      case 'wobject':
        if (isFollowed) {
          this.props.unfollowObject(following);
        } else {
          this.props.followObject(following);
        }
        break;
      case 'user':
        if (isFollowed) {
          this.props.unfollowUser(following);
        } else {
          this.props.followUser(following);
        }
        break;
      default:
    }
  }

  handleFollowClick() {
    this.props.onActionInitiated(this.followClick);
  }

  render() {
    const {
      authenticatedUserName,
      following,
      followingList,
      pendingFollows,
      secondary,
    } = this.props;
    const followed = followingList.includes(following);
    const pending = pendingFollows.includes(following);

    if (authenticatedUserName === following) return null;

    return (
      <Follow
        isFollowed={followed}
        pending={pending}
        disabled={Boolean(pendingFollows.length) && !pending}
        onClick={this.handleFollowClick}
        secondary={secondary}
      />
    );
  }
}

export default FollowButton;
