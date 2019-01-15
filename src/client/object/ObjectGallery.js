import { Card, Icon } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import { FormattedMessage } from 'react-intl';
import Loading from '../components/Icon/Loading';
import GalleryCard from './GalleryCard';
import * as ApiClient from '../../waivioApi/ApiClient';
import './ObjectGallery.less';

export default class ObjectGallery extends Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
  };

  state = {
    images: [],
    loading: true,
    photoIndex: 0,
    isOpen: false,
  };

  componentDidMount() {
    const { match } = this.props;

    ApiClient.getWobjectGallery(match.params.name).then(images =>
      this.setState({ loading: false, images }),
    );
  }

  handleOpenLightbox = photoIndex => this.setState({ isOpen: true, photoIndex });

  render() {
    const { loading, images, photoIndex, isOpen } = this.state;
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
              <FormattedMessage id="add_new_album" defaultMessage="Add new album" />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
