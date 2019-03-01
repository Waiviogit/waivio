import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'antd';
import Lightbox from 'react-image-lightbox';
import { FormattedMessage } from 'react-intl';
import GalleryItem from './GalleryItem';
import './GalleryAlbum.less';

class Album extends React.Component {
  static propTypes = {
    album: PropTypes.shape().isRequired,
  };
  static defaultProps = {
    album: {},
  };
  state = {
    isOpen: false,
    photoIndex: 0,
  };

  handleOpenLightbox = photoIndex => this.setState({ isOpen: true, photoIndex });

  render() {
    const { album } = this.props;
    const { isOpen, photoIndex } = this.state;
    return (
      <div className="GalleryAlbum">
        <Card title={album.body}>
          {album.items && album.items.length > 0 ? (
            <Row gutter={24}>
              {album.items.map((image, idx) => (
                <Col span={12} key={image.body}>
                  <GalleryItem
                    image={image}
                    handleOpenLightbox={this.handleOpenLightbox}
                    idx={idx}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="ObjectGallery__emptyText">
              <FormattedMessage id="gallery_list_empty" defaultMessage="Nothing is there" />
            </div>
          )}
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

export default Album;
