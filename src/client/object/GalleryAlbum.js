import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import Lightbox from 'react-image-lightbox';
import './GalleryItem.less';

class GalleryItem extends React.Component() {
  static propTypes = {
    album: PropTypes.arrayOf(PropTypes.shape().isRequired),
  };

  state = {
    isOpen: false,
  };

  handleOpenLightbox = photoIndex => this.setState({ isOpen: true, photoIndex });

  render() {
    const { album } = this.props;
    const { isOpen, photoIndex } = this.state;
    return (
      <div className="GalleryAlbum">
        <Card title={album.name}>
          {album.images.map((image, idx) => (
            <Card.Grid>
              <GalleryItem
                key={image.weight} // TODO: temp solution
                image={image}
                handleOpenLightbox={this.handleOpenLightbox}
                idx={idx}
              />
            </Card.Grid>
          ))}
        </Card>
        {isOpen && (
          <Lightbox
            mainSrc={album.images[photoIndex].body}
            nextSrc={album.images[(photoIndex + 1) % album.images.length].body}
            prevSrc={
              album.images[(photoIndex + album.images.length - 1) % album.images.length].body
            }
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + album.images.length - 1) % album.images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % album.images.length,
              })
            }
          />
        )}
      </div>
    );
  }
}

export default GalleryItem;
