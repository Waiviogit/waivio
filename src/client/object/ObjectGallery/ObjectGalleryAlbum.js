import { Icon, message } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';
import Loading from '../../components/Icon/Loading';
import Album from './Album';
import * as ApiClient from '../../../waivioApi/ApiClient';
import './ObjectGallery.less';
import CreateImage from './CreateImage';
import { getAuthenticatedUserName, getIsAppendLoading, getObject } from '../../reducers';
import { appendObject } from '../appendActions';
import { isValidImage } from '../../helpers/image';
import withEditor from '../../components/Editor/withEditor';
import { ALLOWED_IMG_FORMATS, MAX_IMG_SIZE } from '../../../common/constants/validation';
import { getField } from '../../objects/WaivioObject';

@withEditor
@connect(
  state => ({
    currentUsername: getAuthenticatedUserName(state),
    wObject: getObject(state),
    loadingImage: getIsAppendLoading(state),
  }),
  { appendObject },
)
export default class ObjectGalleryAlbum extends Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    onImageInvalid: PropTypes.func.isRequired,
    onImageUpload: PropTypes.func.isRequired,
    currentUsername: PropTypes.string.isRequired,
    wObject: PropTypes.shape().isRequired,
    appendObject: PropTypes.bool.isRequired,
    loadingImage: PropTypes.bool.isRequired,
  };

  state = {
    albums: [],
    loading: true,
    photoIndex: 0,
    albumId: null,
    showModal: false,
    imageUploading: false,
    currentImage: [],
  };

  componentDidMount() {
    const { match } = this.props;
    ApiClient.getWobjectGallery(match.params.name).then(albums =>
      this.setState({ loading: false, albums, albumId: match.params.albumId }),
    );
  }

  handleToggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      currentImage: [],
    }));

  handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      if (!isValidImage(e.target.files[0], MAX_IMG_SIZE.avatar, ALLOWED_IMG_FORMATS)) {
        this.props.onImageInvalid(MAX_IMG_SIZE.avatar, `(${ALLOWED_IMG_FORMATS.join(', ')}) `);
        return;
      }

      this.setState({
        imageUploading: true,
        currentImage: [],
      });

      this.props.onImageUpload(e.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          imageUploading: false,
        }),
      );
    }
  };

  disableAndInsertImage = (image, imageName = 'image') => {
    const newImage = {
      src: image,
      name: imageName,
      id: uuidv4(),
    };
    this.setState({ imageUploading: false, currentImage: [newImage] });
  };

  handleRemoveImage = () => {
    this.setState({ currentImage: [] });
  };

  handleCreateImage = form => {
    const { currentUsername, wObject } = this.props;
    const { albums } = this.state;
    const album = _.filter(albums, _.iteratee(['id', form.id]));

    const data = {};
    data.author = currentUsername;
    data.parentAuthor = wObject.author;
    data.parentPermlink = wObject.author_permlink;
    data.body = `@${data.author} added a new image to album ${album[0].body} <br /> ${form.image}`;
    data.title = '';

    data.field = {
      name: 'galleryItem',
      body: form.image,
      locale: 'en-US',
      id: form.id,
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

        message.success(`You successfully have added the image to album ${album[0].body}`);
      })
      .catch(err => {
        message.error("Couldn't add the image to album.");
        console.log('err', err);
      });
  };

  render() {
    const { match, loadingImage } = this.props;
    const { loading, albums, albumId, showModal, currentImage, imageUploading } = this.state;
    if (loading) return <Loading center />;
    const album = _.filter(albums, _.iteratee(['id', albumId]));
    return (
      <React.Fragment>
        <div className="ObjectGallery">
          <div className="ObjectGallery__empty">
            <div className="ObjectGallery__addImageWrap">
              <div className="ObjectGallery__addImage">
                <Link
                  replace
                  to={`/object/${match.params.name}/${match.params.defaultName}/gallery`}
                >
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
                  handleSubmit={this.handleCreateImage}
                  loading={loadingImage}
                  currentImage={currentImage}
                  imageUploading={imageUploading}
                  handleImageChange={this.handleImageChange}
                  handleRemoveImage={this.handleRemoveImage}
                />
              </div>
            </div>
          </div>
          {!album && !album[0] && (
            <div className="ObjectGallery__emptyText">
              <FormattedMessage id="gallery_list_empty" defaultMessage="Nothing is there" />
            </div>
          )}
          {album && album[0] && (
            <Album
              key={album[0].body + album[0].weight}
              album={album[0]}
              handleOpenLightbox={this.handleOpenLightbox}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}
