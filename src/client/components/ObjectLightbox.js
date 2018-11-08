import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import ObjectAvatar, { getObjectUrl } from './ObjectAvatar';

export default class ObjectLightbox extends Component {
  static propTypes = {
    username: PropTypes.shape(),
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
    let image = getObjectUrl(username);

    if (!image) {
      image = 'https://steemitimages.com/u/waivio/avatar/large';
    }

    return (
      <div>
        <a role="presentation" onClick={this.handleAvatarClick}>
          <ObjectAvatar item={username} size={size} />
          {isActive && <div className="UserHeader__container--active" />}
        </a>
        {this.state.open && <Lightbox mainSrc={image} onCloseRequest={this.handleCloseRequest} />}
      </div>
    );
  }
}
