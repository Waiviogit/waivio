import { connect } from 'react-redux';
import { Icon, Col, Row, message } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Loading from '../../components/Icon/Loading';
import GalleryAlbum from './GalleryAlbum';
import * as ApiClient from '../../../waivioApi/ApiClient';
import './ObjectGallery.less';
import CreateAlbum from './CreateAlbum';
import { getAuthenticatedUserName, getIsAppendLoading, getObject } from '../../reducers';
import { appendObject } from '../appendActions';
import { getField } from '../../objects/WaivioObject';
import IconButton from '../../components/IconButton';

@connect(
  state => ({
    currentUsername: getAuthenticatedUserName(state),
    wObject: getObject(state),
    loadingAlbum: getIsAppendLoading(state),
  }),
  { appendObject },
)
export default class ObjectGallery extends Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    currentUsername: PropTypes.string.isRequired,
    wObject: PropTypes.shape().isRequired,
    appendObject: PropTypes.func.isRequired,
    loadingAlbum: PropTypes.bool.isRequired,
  };

  state = {
    albums: [],
    loading: true,
    photoIndex: 0,
    showModal: false,
  };

  componentDidMount() {
    const { match } = this.props;
    ApiClient.getWobjectGallery(match.params.name).then(albums =>
      this.setState({ loading: false, albums }),
    );
  }

  handleToggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  handleCreateAlbum = form => {
    const { currentUsername, wObject } = this.props;

    const data = {};
    data.author = currentUsername;
    data.parentAuthor = wObject.author;
    data.parentPermlink = wObject.author_permlink;
    data.body = `@${data.author} created a new album: ${form.galleryAlbum}.`;
    data.title = '';

    data.field = {
      name: 'galleryAlbum',
      body: form.galleryAlbum,
      locale: 'en-US',
    };

    data.permlink = `${data.author}-${Math.random()
      .toString(36)
      .substring(2)}`;
    data.lastUpdated = Date.now();

    data.wobjectName = getField(wObject, 'name');

    this.props
      .appendObject(data)
      .then(() => {
        this.handleToggleModal();

        message.success(`You successfully have created the ${form.galleryAlbum} album`);
      })
      .catch(err => {
        message.error("Couldn't append object.");
        console.log('err', err);
      });
  };

  render() {
    const { match, loadingAlbum } = this.props;
    const { loading, albums, showModal } = this.state;
    if (loading) return <Loading center />;
    const empty = albums.length === 0;

    return (
      <React.Fragment>
        <div className="ObjectGallery">
          <div className="ObjectGallery__empty">
            <div className="ObjectGallery__addAlbum">
              <IconButton
                icon={<Icon type="plus-circle" />}
                onClick={this.handleToggleModal}
                caption={<FormattedMessage id="add_new_album" defaultMessage="Add new album" />}
              />
              <CreateAlbum
                showModal={showModal}
                hideModal={this.handleToggleModal}
                handleSubmit={this.handleCreateAlbum}
                loading={loadingAlbum}
              />
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
