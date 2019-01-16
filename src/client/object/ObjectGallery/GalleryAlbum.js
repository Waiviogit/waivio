import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import Lightbox from 'react-image-lightbox';
import './GalleryAlbum.less';
import GalleryItem from './GalleryItem';

class GalleryAlbum extends React.Component {
  static propTypes = {
    album: PropTypes.arrayOf(PropTypes.shape().isRequired),
  };
  static defaultProps = {
    album: [{}],
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
        <Card title={album.body}>
          {album.items.map((image, idx) => (
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
            mainSrc={album.items[photoIndex].body}
            nextSrc={album.items[(photoIndex + 1) % album.items.length].body}
            prevSrc={album.items[(photoIndex + album.items.length - 1) % album.items.length].body}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + album.items.length - 1) % album.items.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % album.items.length,
              })
            }
          />
        )}
      </div>
    );
  }
}

export default GalleryAlbum;
