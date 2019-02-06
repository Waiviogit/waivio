import { Icon } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from '../../components/Icon/Loading';
import Album from './Album';
import * as ApiClient from '../../../waivioApi/ApiClient';
import './ObjectGallery.less';
import CreateImage from './CreateImage';
import { getAuthenticatedUserName, getIsAppendLoading, getObject } from '../../reducers';
import withEditor from '../../components/Editor/withEditor';

@withEditor
@connect(state => ({
  currentUsername: getAuthenticatedUserName(state),
  wObject: getObject(state),
  loadingImage: getIsAppendLoading(state),
}))
export default class ObjectGalleryAlbum extends Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    loadingImage: PropTypes.bool.isRequired,
  };

  state = {
    albums: [],
    loading: true,
    photoIndex: 0,
    albumId: null,
    showModal: false,
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
    }));

  render() {
    const { match, loadingImage } = this.props;
    const { loading, albums, albumId, showModal } = this.state;
    if (loading) return <Loading center />;
    const album = _.filter(albums, _.iteratee(['id', albumId]));
    return (
      <React.Fragment>
        <div className="ObjectGallery">
          <div className="ObjectGallery__empty">
            <div className="ObjectGallery__addImageWrap">
              <div className="ObjectGallery__addImage">
                <Link replace to={`/object/@${match.params.name}/gallery`}>
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
                  loading={loadingImage}
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
      </React.Fragment>
    );
  }
}
