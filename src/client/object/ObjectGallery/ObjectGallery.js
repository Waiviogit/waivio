import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Icon, Col, Row } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { getAlbums } from './galleryActions';
import Loading from '../../components/Icon/Loading';
import GalleryAlbum from './GalleryAlbum';
import CreateAlbum from './CreateAlbum';
import { getIsObjectAlbumsLoading, getObjectAlbums, getIsAuthenticated } from '../../reducers';
import IconButton from '../../components/IconButton';

import './ObjectGallery.less';

@injectIntl
@connect(
  state => ({
    loading: getIsObjectAlbumsLoading(state),
    albums: getObjectAlbums(state),
    isAuthenticated: getIsAuthenticated(state),
  }),
  {
    getAlbums,
  },
)
export default class ObjectGallery extends Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    getAlbums: PropTypes.func,
  };

  static defaultProps = {
    getAlbums: () => {},
  };

  state = {
    photoIndex: 0,
    showModal: false,
  };

  componentDidMount() {
    const { match, albums } = this.props;

    if (isEmpty(albums)) this.props.getAlbums(match.params.name);
  }

  handleToggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  render() {
    const { showModal } = this.state;
    const { match, albums, loading, isAuthenticated } = this.props;
    if (loading) return <Loading center />;
    const empty = isEmpty(albums);

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
                    <GalleryAlbum album={album} />
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <div className="ObjectGallery__emptyText">
            <FormattedMessage
              id="gallery_list_empty"
              defaultMessage="There are no photos in this album. There are no photos in this album. Be the first to add one!"
            />
          </div>
        )}
      </div>
    );
  }
}
