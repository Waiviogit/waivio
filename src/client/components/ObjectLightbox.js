import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import { Link, withRouter } from 'react-router-dom';
import { Icon } from 'antd';
import { get, isEmpty } from 'lodash';
import ObjectAvatar from './ObjectAvatar';
import AppendModal from '../object/AppendModal/AppendModal';
import { objectFields } from '../../common/constants/listOfFields';
import DEFAULTS from '../object/const/defaultValues';
import { getProxyImageURL } from '../../common/helpers/image';
import LightboxHeader from '../widgets/LightboxTools/LightboxHeader';
import { getObjectAlbums } from '../../store/galleryStore/gallerySelectors';
import { getRelatedAlbum } from '../../store/galleryStore/galleryActions';
import LightboxFooter from '../widgets/LightboxTools/LightboxFooter';

@withRouter
@connect(state => ({
  albums: getObjectAlbums(state),
  relatedAlbum: getRelatedAlbum(state),
}))
export default class ObjectLightbox extends Component {
  static propTypes = {
    wobject: PropTypes.shape(),
    albums: PropTypes.arrayOf(),
    relatedAlbum: PropTypes.shape(),
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
    const pics = [...get(wobject, 'preview_gallery', []), ...get(relatedAlbum, 'items', [])];
    const creator = album?.items?.find(pic => pic.body === wobject.avatar).creator;

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
            {this.state.open && !isEmpty(pics) && (
              <Lightbox
                wrapperClassName="LightboxTools"
                imageTitle={
                  <LightboxHeader
                    objName={wobject.name}
                    albumName={album?.body}
                    userName={creator}
                  />
                }
                imageCaption={<LightboxFooter post={pics[photoIndex]} />}
                mainSrc={pics[photoIndex]?.body}
                nextSrc={pics.length <= 1 ? null : pics[(photoIndex + 1) % pics.length]?.body}
                prevSrc={pics.length <= 1 ? null : pics[(photoIndex - 1) % pics.length]?.body}
                onMovePrevRequest={() =>
                  this.setState({ photoIndex: (photoIndex - 1) % pics.length })
                }
                onMoveNextRequest={() =>
                  this.setState({ photoIndex: (photoIndex + 1) % pics.length })
                }
                onCloseRequest={this.handleCloseRequest}
              />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
