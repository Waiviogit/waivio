import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { has, setWith, isEmpty, get } from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from '../../components/Icon/Loading';
import Album from './Album';
import CreateImage from './CreateImage';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsObjectAlbumsLoading,
  getObject,
  getObjectAlbums,
  getRelatedPhotos,
} from '../../store/reducers';
import withEditor from '../../components/Editor/withEditor';
import { getAlbums, getRelatedAlbum, getMoreRelatedAlbum } from './galleryActions';

import './ObjectGallery.less';

@withEditor
@withRouter
@connect(
  state => ({
    currentUsername: getAuthenticatedUserName(state),
    wObject: getObject(state),
    loading: getIsObjectAlbumsLoading(state),
    albums: getObjectAlbums(state),
    isAuthenticated: getIsAuthenticated(state),
    relatedAlbum: getRelatedPhotos(state),
  }),
  { getAlbums, getRelatedAlbum, moreRelatedAlbum: getMoreRelatedAlbum },
)
export default class ObjectGalleryAlbum extends Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    loading: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    onImageUpload: PropTypes.func.isRequired,
    onImageInvalid: PropTypes.func.isRequired,
    getAlbums: PropTypes.func.isRequired,
    getRelatedAlbum: PropTypes.func.isRequired,
    moreRelatedAlbum: PropTypes.func,
    relatedAlbum: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    moreRelatedAlbum: () => {},
  };

  state = {
    photoIndex: 0,
    showModal: false,
  };

  componentDidMount() {
    if (isEmpty(this.props.albums)) this.props.getAlbums(this.props.match.params.name);
    if (isEmpty(this.props.relatedAlbum))
      this.props.getRelatedAlbum(this.props.match.params.name, 30);
  }

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
    const { loading, match, albums, isAuthenticated, relatedAlbum, moreRelatedAlbum } = this.props;
    const { showModal } = this.state;
    const albumsForRender = [...albums, relatedAlbum];
    const albumPermlink = match.params.name;

    if (loading) return <Loading center />;

    const albumId = match.params.itemId;
    const allAlbums = this.validatedAlbums(albumsForRender);
    const album = allAlbums.filter(albm => albm.id === albumId);
    const selectedAlbum = album[0];

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
              {get(selectedAlbum, 'body', '') !== 'Related' && (
                <div className="ObjectGallery__addImage">
                  <a role="presentation" onClick={this.handleToggleModal}>
                    <Icon type="plus-circle" className="proposition-line__icon" />
                  </a>
                  <FormattedMessage id="add_new_image" defaultMessage="Add new image" />
                  <CreateImage
                    albums={album}
                    selectedAlbum={selectedAlbum}
                    showModal={showModal}
                    hideModal={this.handleToggleModal}
                    onImageUpload={this.props.onImageUpload}
                    onImageInvalid={this.props.onImageInvalid}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {album && selectedAlbum ? (
          <Album
            key={selectedAlbum.body + selectedAlbum.weight}
            album={selectedAlbum}
            getMoreRelatedAlbum={moreRelatedAlbum}
            permlink={albumPermlink}
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
