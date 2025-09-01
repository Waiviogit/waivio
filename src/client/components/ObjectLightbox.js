import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Icon } from 'antd';
import { get, has, isEmpty } from 'lodash';
import ObjectAvatar from './ObjectAvatar';
import AppendModal from '../object/AppendModal/AppendModal';
import { objectFields } from '../../common/constants/listOfFields';
import DEFAULTS from '../object/const/defaultValues';
import { getProxyImageURL } from '../../common/helpers/image';
import { getObjectAlbums } from '../../store/galleryStore/gallerySelectors';
import { getRelatedAlbum } from '../../store/galleryStore/galleryActions';
import LightboxWithAppendForm from '../widgets/LightboxTools/LightboxWithAppendForm';

@withRouter
@connect(state => ({
  albums: getObjectAlbums(state),
  relatedAlbum: getRelatedAlbum(state),
}))
export default class ObjectLightbox extends Component {
  static propTypes = {
    wobject: PropTypes.shape(),
    albums: PropTypes.arrayOf(PropTypes.shape({})),
    relatedAlbum: PropTypes.shape({}),
    size: PropTypes.number,
    accessExtend: PropTypes.bool,
  };

  static defaultProps = {
    wobject: {},
    accessExtend: false,
    size: 100,
  };

  state = {
    photoIndex: 0,
    open: false,
  };

  handleAvatarClick = () => this.setState({ open: true });

  handleCloseRequest = () => this.setState({ open: false, photoIndex: 0 });

  render() {
    const { wobject, size, accessExtend, relatedAlbum } = this.props;
    const { photoIndex } = this.state;
    const objectName = wobject.name || wobject.default_name;
    let currentImage = wobject.avatar || get(wobject, ['parent', 'avatar']);
    const album = this.props.albums?.find(alb =>
      alb?.items?.some(pic => pic.body === wobject.avatar),
    );
    const parentAvatar =
      !isEmpty(wobject.parent) && has(wobject.parent, 'avatar')
        ? { body: wobject?.parent?.avatar }
        : {};
    const pics =
      !has(wobject, 'avatar') && !isEmpty(parentAvatar)
        ? [parentAvatar, ...get(wobject, 'preview_gallery', []), ...get(relatedAlbum, 'items', [])]
        : [...get(wobject, 'preview_gallery', []), ...get(relatedAlbum, 'items', [])];

    if (currentImage) currentImage = getProxyImageURL(currentImage, 'preview');
    else currentImage = DEFAULTS.AVATAR;

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
            {this.state.open && (!isEmpty(pics) || !isEmpty(parentAvatar)) && (
              <LightboxWithAppendForm
                onCloseRequest={this.handleCloseRequest}
                onMovePrevRequest={() =>
                  this.setState({ photoIndex: (photoIndex - 1) % pics.length })
                }
                onMoveNextRequest={() =>
                  this.setState({ photoIndex: (photoIndex + 1) % pics.length })
                }
                wobject={wobject}
                album={album}
                albums={this.props.albums}
                pics={pics}
                photoIndex={photoIndex}
              />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
