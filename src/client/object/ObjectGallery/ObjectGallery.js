import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Icon, Col, Row } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getAlbums } from './galleryActions';
import Loading from '../../components/Icon/Loading';
import GalleryAlbum from './GalleryAlbum';
import CreateAlbum from './CreateAlbum';
import {
  getIsObjectAlbumsLoading,
  getObjectAlbums,
  getIsAuthenticated,
  getObjectAdmins,
  getObjectModerators,
} from '../../reducers';
import IconButton from '../../components/IconButton';

import './ObjectGallery.less';

@injectIntl
@connect(
  state => ({
    loading: getIsObjectAlbumsLoading(state),
    albums: getObjectAlbums(state),
    isAuthenticated: getIsAuthenticated(state),
    moderatorsList: getObjectAdmins(state),
    adminsList: getObjectModerators(state),
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
    adminsList: PropTypes.arrayOf(PropTypes.string).isRequired,
    moderatorsList: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    getAlbums: () => {},
  };

  state = {
    photoIndex: 0,
    showModal: false,
  };

  componentDidMount() {
    const { match } = this.props;
    this.props.getAlbums(match.params.name);
  }

  handleToggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  render() {
    const { showModal } = this.state;
    const { match, albums, loading, isAuthenticated, adminsList, moderatorsList } = this.props;
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
                    <GalleryAlbum
                      album={album}
                      wobjMainers={{
                        admins: adminsList,
                        moderators: moderatorsList,
                      }}
                    />
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
