import { Icon } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from '../../components/Icon/Loading';
import Album from './Album';
import './ObjectGallery.less';
import CreateImage from './CreateImage';
import {
  getAuthenticatedUserName,
  getIsObjectAlbumsLoading,
  getObject,
  getObjectAlbums,
} from '../../reducers';
import withEditor from '../../components/Editor/withEditor';

@withEditor
@connect(state => ({
  currentUsername: getAuthenticatedUserName(state),
  wObject: getObject(state),
  loading: getIsObjectAlbumsLoading(state),
  albums: getObjectAlbums(state),
}))
export default class ObjectGalleryAlbum extends Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    loading: PropTypes.bool.isRequired,
  };

  state = {
    photoIndex: 0,
    showModal: false,
  };

  handleToggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  render() {
    const { loading, match, albums } = this.props;
    const { showModal } = this.state;

    if (loading) return <Loading center />;

    const albumId = match.params.albumId;
    const album = _.filter(albums, _.iteratee(['id', albumId]));

    return (
      <div className="ObjectGallery">
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
              />
            </div>
          </div>
        </div>
        {album && album[0] ? (
          <Album key={album[0].body + album[0].weight} album={album[0]} />
        ) : (
          <div className="ObjectGallery__emptyText">
            <FormattedMessage id="gallery_list_empty" defaultMessage="Nothing is there" />
          </div>
        )}
      </div>
    );
  }
}
