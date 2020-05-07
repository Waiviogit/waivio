import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { guestUserRegex } from '../helpers/regexHelpers';
import Avatar from './Avatar';

export default class AvatarLightbox extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    username: PropTypes.string,
    size: PropTypes.number,
    isActive: PropTypes.bool,
  };

  static defaultProps = {
    username: undefined,
    size: 100,
    isActive: false,
  };

  state = {
    open: false,
  };

  getAvatarUrl = () => {
    const { username, user } = this.props;
    const lastAccountUpdate = !isEmpty(user)
      ? moment(user.updatedAt || user.last_account_update).unix()
      : '';
    if (guestUserRegex.test(username)) {
      return `https://waivio.nyc3.digitaloceanspaces.com/avatar/${username}?${lastAccountUpdate}`;
    }
    return `https://images.hive.blog/u/${username}/avatar/large`;
  };

  handleAvatarClick = () => this.setState({ open: true });

  handleCloseRequest = () => this.setState({ open: false });

  render() {
    const { username, size, isActive } = this.props;
    const avatarUrl = this.getAvatarUrl();
    return (
      <div
        className="UserHeader__container--wrap"
        role="presentation"
        onClick={this.handleAvatarClick}
      >
        <Avatar username={username} size={size} />
        {isActive && (
          <img
            src="/images/icons/online.png"
            alt="hive"
            className="UserHeader__container--active"
            title="Active now"
          />
        )}
        {this.state.open && (
          <Lightbox mainSrc={avatarUrl} onCloseRequest={this.handleCloseRequest} />
        )}
      </div>
    );
  }
}
