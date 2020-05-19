import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'antd';
import Lightbox from 'react-image-lightbox';
import { FormattedMessage } from 'react-intl';
import GalleryItem from './GalleryItem';
import './GalleryAlbum.less';
import { calculateApprovePercent } from '../../helpers/wObjectHelper';

class Album extends React.Component {
  static propTypes = {
    album: PropTypes.shape(),
    wobjMainer: PropTypes.shape(),
  };
  static defaultProps = {
    album: {},
    wobjMainer: {},
  };
  state = {
    isOpen: false,
    photoIndex: 0,
  };

  handleOpenLightbox = photoIndex => this.setState({ isOpen: true, photoIndex });

  render() {
    const { album, wobjMainer } = this.props;
    const { isOpen, photoIndex } = this.state;
    const pictures =
      album.items &&
      album.items.filter(
        picture => calculateApprovePercent(picture.active_votes, picture.weight, wobjMainer) >= 70,
      );
    return (
      <div className="GalleryAlbum">
        <Card title={album.body}>
          {pictures && pictures.length > 0 ? (
            <Row gutter={24}>
              {pictures.map((image, idx) => (
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
            mainSrc={pictures[photoIndex].body}
            nextSrc={pictures[(photoIndex + 1) % pictures.length].body}
            prevSrc={pictures[(photoIndex + pictures.length - 1) % pictures.length].body}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + pictures.length - 1) % pictures.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % pictures.length,
              })
            }
          />
        )}
      </div>
    );
  }
}

export default Album;
