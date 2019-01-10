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
    accessExtend: PropTypes.bool,
  };

  static defaultProps = {
    wobject: undefined,
    accessExtend: false,
    size: 100,
  };

  state = {
    open: false,
  };

  handleAvatarClick = () => this.setState({ open: true });

  handleCloseRequest = () => this.setState({ open: false });

  render() {
    const { wobject, size, accessExtend } = this.props;
    let imageUrl = getObjectUrl(wobject);
    let isFieldAvatarImage = true;
    if (!imageUrl) {
      imageUrl = 'https://steemitimages.com/u/waivio/avatar';
      isFieldAvatarImage = false;
    }

    return (
      <React.Fragment>
        {!isFieldAvatarImage && accessExtend ? (
          <Link to={{ pathname: `/wobject/editor/@${wobject.author_permlink}/avatarImage` }}>
            <Icon type="plus-circle" className="ObjectHeader__avatar-image" />
          </Link>
        ) : (
          <a role="presentation" onClick={this.handleAvatarClick}>
            <ObjectAvatar item={wobject} size={size} />
          </a>
        )}
        {this.state.open && (
          <Lightbox mainSrc={imageUrl} onCloseRequest={this.handleCloseRequest} />
        )}
      </React.Fragment>
    );
  }
}
