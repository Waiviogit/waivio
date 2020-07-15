import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import Avatar from './Avatar';
import { guestUserRegex } from '../helpers/regexHelpers';

export default class AvatarLightbox extends React.Component {
  static propTypes = {
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

  handleAvatarClick = () => this.setState({ open: true });

  handleCloseRequest = () => this.setState({ open: false });

  render() {
    const { username, size, isActive } = this.props;
    const lightboxSrc =
      username && guestUserRegex.test(username)
        ? `https://waivio.nyc3.digitaloceanspaces.com/avatar/${username}`
        : `https://images.hive.blog/u/${username}/avatar/large`;

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
          <Lightbox mainSrc={lightboxSrc} onCloseRequest={this.handleCloseRequest} />
        )}
      </div>
    );
  }
}
