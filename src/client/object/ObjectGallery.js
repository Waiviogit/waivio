import PropTypes from 'prop-types';
import { Card, Icon, message } from 'antd';
import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Loading from '../components/Icon/Loading';
import GalleryCard from './GalleryCard';
import * as ApiClient from '../../waivioApi/ApiClient';
import './ObjectGallery.less';
import CreateAlbum from './CreateAlbum';
import { getAuthenticatedUserName, getIsAppendLoading, getObject } from '../reducers';
import { appendObject } from './appendActions';
import { getField } from '../objects/WaivioObject';

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
    images: [],
    loading: true,
    photoIndex: 0,
    isOpen: false,
    showModal: false,
  };

  componentDidMount() {
    const { match } = this.props;

    ApiClient.getWobjectGallery(match.params.name).then(images =>
      this.setState({ loading: false, images }),
    );
  }

  handleOpenLightbox = photoIndex => this.setState({ isOpen: true, photoIndex });

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
    const { loading, images, photoIndex, isOpen, showModal } = this.state;
    const { loadingAlbum } = this.props;

    if (loading) return <Loading center />;
    const empty = images.length === 0;

    return (
      <React.Fragment>
        <div className="ObjectGallery">
          {!empty && (
            <Card title="Album">
              {images.map((image, idx) => (
                <Card.Grid>
                  <GalleryCard
                    key={image.weight} // TODO: temp solution
                    image={image}
                    handleOpenLightbox={this.handleOpenLightbox}
                    idx={idx}
                  />
                </Card.Grid>
              ))}
            </Card>
          )}
        </div>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex].body}
            nextSrc={images[(photoIndex + 1) % images.length].body}
            prevSrc={images[(photoIndex + images.length - 1) % images.length].body}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
          />
        )}
        {empty && (
          <div className="ObjectGallery__empty">
            <FormattedMessage id="gallery_list_empty" defaultMessage="Nothing is there" />
            <div className="ObjectGallery__addAlbum">
              <a role="presentation" onClick={this.handleToggleModal}>
                <Icon type="plus-circle" className="proposition-line__icon" />
              </a>
              <FormattedMessage
                id="add_new_album"
                defaultMessage="Add new album"
                onClick={this.handleToggleModal}
              />
              <CreateAlbum
                showModal={showModal}
                hideModal={this.handleToggleModal}
                handleSubmit={this.handleCreateAlbum}
                loading={loadingAlbum}
              />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
