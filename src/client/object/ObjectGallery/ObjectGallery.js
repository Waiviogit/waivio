import { Icon } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Loading from '../../components/Icon/Loading';
import GalleryAlbum from './GalleryAlbum';
import * as ApiClient from '../../../waivioApi/ApiClient';
import './ObjectGallery.less';

export default class ObjectGallery extends Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
  };

  state = {
    albums: [],
    loading: true,
    photoIndex: 0,
  };

  componentDidMount() {
    const { match } = this.props;
    console.log(match.params.albumId);
    ApiClient.getWobjectGallery(match.params.name).then(albums =>
      this.setState({ loading: false, albums }),
    );
  }

  render() {
    const { loading, albums } = this.state;
    if (loading) return <Loading center />;
    const empty = albums.length === 0;

    return (
      <React.Fragment>
        <div className="ObjectGallery">
          <div className="ObjectGallery__empty">
            {empty && (
              <FormattedMessage id="gallery_list_empty" defaultMessage="Nothing is there" />
            )}
            <div className="ObjectGallery__addAlbum">
              <a role="presentation" onClick={this.handleToggleModal}>
                <Icon type="plus-circle" className="proposition-line__icon" />
              </a>
              <FormattedMessage id="add_new_album" defaultMessage="Add new album" />
            </div>
          </div>
          {!empty &&
            albums.map(album => (
              <GalleryAlbum
                key={album.body + album.weight}
                album={album}
                handleOpenLightbox={this.handleOpenLightbox}
              />
            ))}
        </div>
      </React.Fragment>
    );
  }
}
