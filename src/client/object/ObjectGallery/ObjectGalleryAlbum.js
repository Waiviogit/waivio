import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { has, setWith } from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from '../../components/Icon/Loading';
import Album from './Album';
import CreateImage from './CreateImage';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsObjectAlbumsLoading,
  getObject,
  getObjectAdmins,
  getObjectAlbums,
  getObjectModerators,
} from '../../reducers';
import withEditor from '../../components/Editor/withEditor';
import { calculateApprovePercent } from '../../helpers/wObjectHelper';

import './ObjectGallery.less';

@withEditor
@connect(state => ({
  currentUsername: getAuthenticatedUserName(state),
  wObject: getObject(state),
  loading: getIsObjectAlbumsLoading(state),
  albums: getObjectAlbums(state),
  isAuthenticated: getIsAuthenticated(state),
  moderatorsList: getObjectAdmins(state),
  adminsList: getObjectModerators(state),
}))
export default class ObjectGalleryAlbum extends Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    loading: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    onImageUpload: PropTypes.func.isRequired,
    onImageInvalid: PropTypes.func.isRequired,
    admins: PropTypes.arrayOf(PropTypes.string).isRequired,
    moderators: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  state = {
    photoIndex: 0,
    showModal: false,
  };

  handleToggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  validatedAlbums = albums =>
    albums.map(album => {
      if (!has(album, 'active_votes') && !has(album, 'weight')) {
        setWith(album, '[active_votes]', []);
        setWith(album, '[weight]', 0);
      }
      return album;
    });

  render() {
    const { loading, match, albums, isAuthenticated, admins, moderators } = this.props;
    const { showModal } = this.state;

    if (loading) return <Loading center />;

    const albumId = match.params.itemId;
    const allAlbums = this.validatedAlbums(albums);
    const album = allAlbums.filter(
      albm =>
        albm.id === albumId &&
        calculateApprovePercent(albm.active_votes, albm.weight, { admins, moderators }),
    );

    return (
      <div className="ObjectGallery">
        {isAuthenticated && (
          <div className="ObjectGallery__empty">
            <div className="ObjectGallery__addImageWrap">
              <div className="ObjectGallery__addImage">
                <Link replace to={`/object/${match.params.name}/gallery`}>
                  <Icon type="arrow-left" />
                </Link>
                <FormattedMessage id="back_to_albums" defaultMessage="Back to albums" />
              </div>
              <div className="ObjectGallery__addImage">
                <a role="presentation" onClick={this.handleToggleModal}>
                  <Icon type="plus-circle" className="proposition-line__icon" />
                </a>
                <FormattedMessage id="add_new_image" defaultMessage="Add new image" />
                <CreateImage
                  albums={albums}
                  selectedAlbum={album[0]}
                  showModal={showModal}
                  hideModal={this.handleToggleModal}
                  onImageUpload={this.props.onImageUpload}
                  onImageInvalid={this.props.onImageInvalid}
                />
              </div>
            </div>
          </div>
        )}
        {album && album[0] ? (
          <Album
            key={album[0].body + album[0].weight}
            album={album[0]}
            wobjMainer={{ admins, moderators }}
          />
        ) : (
          <div className="ObjectGallery__emptyText">
            <FormattedMessage id="gallery_list_empty" defaultMessage="Nothing is there" />
          </div>
        )}
      </div>
    );
  }
}
