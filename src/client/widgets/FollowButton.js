import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAuthenticatedUserName } from '../reducers';
import withAuthAction from '../auth/withAuthActions';
import Follow from '../components/Button/Follow';

@withAuthAction
@connect(state => ({
  authenticatedUserName: getAuthenticatedUserName(state),
}))
class FollowButton extends React.Component {
  static propTypes = {
    secondary: PropTypes.bool,
    following: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    followingType: PropTypes.oneOf(['user', 'wobject']),
    authenticatedUserName: PropTypes.string,
    pendingFollows: PropTypes.arrayOf(PropTypes.string).isRequired,
    onActionInitiated: PropTypes.func,
    followUser: PropTypes.func,
    followObject: PropTypes.func,
    unfollowUser: PropTypes.func,
    unfollowObject: PropTypes.func,
    user: PropTypes.shape(),
    top: PropTypes.bool,
    wobj: PropTypes.shape(),
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
    user: {},
    top: false,
    wobj: {},
    following: false,
  };

  constructor(props) {
    super(props);

    this.handleFollowClick = this.handleFollowClick.bind(this);
    this.followClick = this.followClick.bind(this);
  }

  followClick() {
    console.log(this.props.following);
    const { following, followingType, user, top, wobj } = this.props;

    switch (followingType) {
      case 'wobject':
        if (following) {
          this.props.unfollowObject(wobj.author_permlink, wobj.name, wobj.object_type);
        } else {
          this.props.followObject(wobj.author_permlink, wobj.name, wobj.object_type);
        }
        break;
      case 'user':
        if (following) {
          this.props.unfollowUser(user.name, top);
        } else {
          this.props.followUser(user.name, top);
        }
        break;
      default:
    }
    console.log(this.props.following);
  }

  handleFollowClick() {
    this.props.onActionInitiated(this.followClick);
  }

  render() {
    const {
      authenticatedUserName,
      following,
      pendingFollows,
      followingType,
      secondary,
      user,
      wobj,
    } = this.props;
    const pending = followingType === 'user' ? user.pending : wobj.pending;

    if (authenticatedUserName === following || authenticatedUserName === user.name) return null;
    return (
      <Follow
        isFollowed={following}
        pending={pending}
        disabled={Boolean(pendingFollows.length) && !pending}
        onClick={this.handleFollowClick}
        secondary={secondary}
      />
    );
  }
}

export default FollowButton;
