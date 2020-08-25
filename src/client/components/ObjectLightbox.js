import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { get } from 'lodash';
import ObjectAvatar from './ObjectAvatar';
import AppendModal from '../object/AppendModal';
import { objectFields } from '../../common/constants/listOfFields';
import DEFAULTS from '../object/const/defaultValues';

export default class ObjectLightbox extends Component {
  static propTypes = {
    wobject: PropTypes.shape(),
    size: PropTypes.number,
    accessExtend: PropTypes.bool,
  };

  static defaultProps = {
    wobject: {},
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
    const imageUrl = wobject.avatar;
    const objectName = wobject.name || wobject.default_name;
    const currentImage = imageUrl || get(wobject, ['parent', 'avatar']) || DEFAULTS.AVATAR;
    console.log(currentImage);
    return (
      <React.Fragment>
        {accessExtend && !currentImage ? (
          <React.Fragment>
            <Link
              to={{
                pathname: `/object/${wobject.author_permlink}/updates/${objectFields.avatar}`,
              }}
              onClick={this.handleAvatarClick}
            >
              <Icon type="plus-circle" className="ObjectHeader__avatar-image" />
            </Link>
            <AppendModal
              objName={objectName}
              showModal={this.state.open}
              hideModal={this.handleCloseRequest}
              field={objectFields.avatar}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <a role="presentation" onClick={this.handleAvatarClick}>
              <ObjectAvatar item={wobject} size={size} />
            </a>
            {this.state.open && (
              <Lightbox mainSrc={currentImage} onCloseRequest={this.handleCloseRequest} />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
