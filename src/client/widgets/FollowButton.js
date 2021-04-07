import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withAuthAction from '../auth/withAuthActions';
import { bellNotifications } from '../store/userStore/userActions';
import { wobjectBellNotification } from '../object/wobjActions';
import Follow from '../components/Button/Follow';
import { getAuthenticatedUserName } from '../store/authStore/authSelectors';

@withAuthAction
@connect(
  state => ({
    authenticatedUserName: getAuthenticatedUserName(state),
  }),
  {
    bellNotifications,
    wobjectBellNotification,
  },
)
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
    bellNotifications: PropTypes.func,
    wobjectBellNotification: PropTypes.func,
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
    bellNotifications: () => {},
    wobjectBellNotification: () => {},
  };

  constructor(props) {
    super(props);

    this.handleFollowClick = this.handleFollowClick.bind(this);
    this.followClick = this.followClick.bind(this);
  }

  followClick() {
    const { following, followingType, user, top, wobj, authenticatedUserName } = this.props;

    switch (followingType) {
      case 'wobject':
        if (following) {
          this.props.unfollowObject(wobj.author_permlink, wobj.name, wobj.object_type);
          if (wobj.bell) {
            this.props.wobjectBellNotification(wobj.author_permlink);
          }
        } else {
          this.props.followObject(wobj.author_permlink, wobj.name, wobj.object_type);
        }
        break;
      case 'user':
        if (following) {
          this.props.unfollowUser(user.name, top);
          if (user.bell) {
            this.props.bellNotifications(authenticatedUserName, user.name);
          }
        } else {
          this.props.followUser(user.name, top);
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
