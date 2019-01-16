import { Icon, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
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
    ApiClient.getWobjectGallery(match.params.name).then(albums =>
      this.setState({ loading: false, albums }),
    );
  }

  render() {
    const { match } = this.props;
    const { loading, albums } = this.state;
    if (loading) return <Loading center />;
    const empty = albums.length === 0;

    return (
      <React.Fragment>
        <div className="ObjectGallery">
          <div className="ObjectGallery__empty">
            <div className="ObjectGallery__addAlbum">
              <a role="presentation" onClick={this.handleToggleModal}>
                <Icon type="plus-circle" className="proposition-line__icon" />
              </a>
              <FormattedMessage id="add_new_album" defaultMessage="Add new album" />
            </div>
          </div>
          {empty && (
            <div className="ObjectGallery__emptyText">
              <FormattedMessage id="gallery_list_empty" defaultMessage="Nothing is there" />
            </div>
          )}
          {!empty && (
            <div className="ObjectGallery__cardWrap">
              <Row gutter={24}>
                {albums.map(album => (
                  <Col span={12} key={album.body + album.weight}>
                    <Link
                      replace
                      to={`/object/${match.params.name}/${match.params.defaultName}/gallery/album/${
                        album.id
                      }`}
                      className="GalleryAlbum"
                    >
                      <GalleryAlbum album={album} handleOpenLightbox={this.handleOpenLightbox} />
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}
