import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Icon, Col, Row } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import Loading from '../../components/Icon/Loading';
import GalleryAlbum from './GalleryAlbum';
import './ObjectGallery.less';
import CreateAlbum from './CreateAlbum';
import { getIsObjectAlbumsLoading, getObjectAlbums, getIsAuthenticated } from '../../reducers';
import IconButton from '../../components/IconButton';

@injectIntl
@connect(state => ({
  loading: getIsObjectAlbumsLoading(state),
  albums: getObjectAlbums(state),
  isAuthenticated: getIsAuthenticated(state),
}))
export default class ObjectGallery extends Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
    const { showModal } = this.state;
    const { match, albums, loading, isAuthenticated } = this.props;
    if (loading) return <Loading center />;
    const empty = albums.length === 0;

    return (
      <div className="ObjectGallery">
        {isAuthenticated && (
          <div className="ObjectGallery__empty">
            <div className="ObjectGallery__addAlbum">
              <IconButton
                icon={<Icon type="plus-circle" />}
                onClick={this.handleToggleModal}
                caption={<FormattedMessage id="add_new_album" defaultMessage="Add new album" />}
              />
              {showModal && (
                <CreateAlbum showModal={showModal} hideModal={this.handleToggleModal} />
              )}
            </div>
          </div>
        )}
        {!empty ? (
          <div className="ObjectGallery__cardWrap">
            <Row gutter={24}>
              {albums.map(album => (
                <Col span={12} key={album.id}>
                  <Link
                    replace
                    to={`/object/${match.params.name}/gallery/album/${album.id}`}
                    className="GalleryAlbum"
                  >
                    <GalleryAlbum album={album} handleOpenLightbox={this.handleOpenLightbox} />
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <div className="ObjectGallery__emptyText">
            <FormattedMessage id="gallery_list_empty" defaultMessage="Nothing is there" />
          </div>
        )}
      </div>
    );
  }
}
