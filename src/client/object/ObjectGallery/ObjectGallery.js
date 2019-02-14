import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Icon, Col, Row, message } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import Loading from '../../components/Icon/Loading';
import GalleryAlbum from './GalleryAlbum';
import './ObjectGallery.less';
import CreateAlbum from './CreateAlbum';
import {
  getAuthenticatedUserName,
  getIsObjectAlbumsLoading,
  getObject,
  getObjectAlbums,
  getIsAppendLoading,
} from '../../reducers';
import * as appendActions from '../appendActions';
import * as galleryActions from './galleryActions';
import IconButton from '../../components/IconButton';
import { prepareAlbumData, prepareAlbumToStore } from '../../helpers/wObjectHelper';

@injectIntl
@connect(
  state => ({
    currentUsername: getAuthenticatedUserName(state),
    wObject: getObject(state),
    loadingAlbum: getIsAppendLoading(state),
    loading: getIsObjectAlbumsLoading(state),
    albums: getObjectAlbums(state),
  }),
  dispatch =>
    bindActionCreators(
      {
        getAlbums: galleryActions.getAlbums,
        addAlbumToStore: album => galleryActions.addAlbumToStore(album),
        appendObject: wObject => appendActions.appendObject(wObject),
      },
      dispatch,
    ),
)
export default class ObjectGallery extends Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    currentUsername: PropTypes.string.isRequired,
    wObject: PropTypes.shape().isRequired,
    appendObject: PropTypes.func.isRequired,
    loadingAlbum: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    intl: PropTypes.shape().isRequired,
    albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    getAlbums: PropTypes.func.isRequired,
    addAlbumToStore: PropTypes.func.isRequired,
  };

  state = {
    photoIndex: 0,
    showModal: false,
  };

  componentDidMount() {
    const { getAlbums, match } = this.props;
    getAlbums(match.params.name);
  }

  handleToggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  handleCreateAlbum = async form => {
    const { currentUsername, wObject, appendObject, intl, addAlbumToStore } = this.props;
    const data = prepareAlbumData(form, currentUsername, wObject);
    const album = prepareAlbumToStore(data);

    try {
      const { author } = await appendObject(data);
      await addAlbumToStore({ ...album, author });
      this.handleToggleModal();
      message.success(
        intl.formatMessage(
          {
            id: 'gallery_add_album_success',
            defaultMessage: 'You successfully have created the {albumName} album',
          },
          {
            albumName: form.galleryAlbum,
          },
        ),
      );
    } catch (err) {
      message.error(
        intl.formatMessage({
          id: 'gallery_add_album_failure',
          defaultMessage: "Couldn't create the album.",
        }),
      );
      console.log('err', err);
    }
  };

  render() {
    const { showModal } = this.state;
    const { match, loadingAlbum, albums, loading } = this.props;
    if (loading) return <Loading center />;
    const empty = albums.length === 0;

    return (
      <div className="ObjectGallery">
        <div className="ObjectGallery__empty">
          <div className="ObjectGallery__addAlbum">
            <IconButton
              icon={<Icon type="plus-circle" />}
              onClick={this.handleToggleModal}
              caption={<FormattedMessage id="add_new_album" defaultMessage="Add new album" />}
            />
            {showModal && (
              <CreateAlbum
                showModal={showModal}
                hideModal={this.handleToggleModal}
                handleSubmit={this.handleCreateAlbum}
                loading={loadingAlbum}
              />
            )}
          </div>
        </div>
        {!empty ? (
          <div className="ObjectGallery__cardWrap">
            <Row gutter={24}>
              {albums.map(album => (
                <Col span={12} key={album.id}>
                  <Link
                    replace
                    to={`/object/@${match.params.name}/gallery/album/${album.id}`}
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
