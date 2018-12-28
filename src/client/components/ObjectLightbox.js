import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import ObjectAvatar, { getObjectUrl } from './ObjectAvatar';

export default class ObjectLightbox extends Component {
  static propTypes = {
    wobject: PropTypes.shape(),
    size: PropTypes.number,
    isActive: PropTypes.bool,
  };

  static defaultProps = {
    wobject: undefined,
    size: 100,
    isActive: false,
  };

  state = {
    open: false,
  };

  handleAvatarClick = () => this.setState({ open: true });

  handleCloseRequest = () => this.setState({ open: false });

  render() {
    const { wobject, size, isActive } = this.props;
    let imageUrl = getObjectUrl(wobject);
    let isFieldAvatarImage = true;
    if (!imageUrl) {
      imageUrl =
        'https://cdn.steemitimages.com/DQmVEdTitcDnsjgtFnqz3MBnCGZgg67qcyCZQkCfWQTEwzY/plus-1270001_640.png';
      isFieldAvatarImage = false;
    }

    return (
      <React.Fragment>
        {isFieldAvatarImage ? (
          <a role="presentation" onClick={this.handleAvatarClick}>
            <ObjectAvatar item={wobject} size={size} />
            {isActive && <div className="UserHeader__container--active" />}
          </a>
        ) : (
          <Link to={{ pathname: `/wobject/editor/@${wobject.author_permlink}/avatarImage` }}>
            <Icon type="plus-circle" className="ObjectHeader__avatar-image" />
          </Link>
        )}
        {this.state.open && (
          <Lightbox mainSrc={imageUrl} onCloseRequest={this.handleCloseRequest} />
        )}
      </React.Fragment>
    );
  }
}
