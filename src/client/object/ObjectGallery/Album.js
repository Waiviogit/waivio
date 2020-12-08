import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row } from 'antd';
import Lightbox from 'react-image-lightbox';
import { FormattedMessage } from 'react-intl';
import { getImagePath } from '../../helpers/image';

import AlbumFeed from './AlbumFeed';

import './GalleryAlbum.less';

class Album extends React.Component {
  static propTypes = {
    album: PropTypes.shape(),
    getMoreRelatedAlbum: PropTypes.func,
    permlink: PropTypes.string.isRequired,
  };
  static defaultProps = {
    album: {},
    wobjMainer: {},
    getMoreRelatedAlbum: () => {},
    isFetching: false,
  };
  state = {
    isOpen: false,
    photoIndex: 0,
  };

  handleOpenLightbox = photoIndex => this.setState({ isOpen: true, photoIndex });

  render() {
    const { album, permlink } = this.props;
    const { isOpen, photoIndex } = this.state;
    const pictures = album.items;
    const hasMore = album.hasMore ? album.hasMore : false;
    const getMoreRelatedPhoto = () =>
      album.body === 'Related' ? this.props.getMoreRelatedAlbum(permlink) : () => {};

    return (
      <div className="GalleryAlbum">
        <Card title={album.body}>
          {pictures && pictures.length > 0 ? (
            <Row gutter={24}>
              <AlbumFeed
                hasMore={hasMore}
                handleOpenLightbox={this.handleOpenLightbox}
                pictures={pictures}
                loadMoreContent={getMoreRelatedPhoto}
                isFetching={album.isFetching}
                album={album}
              />
            </Row>
          ) : (
            <div className="ObjectGallery__emptyText">
              <FormattedMessage id="gallery_list_empty" defaultMessage="Nothing is there" />
            </div>
          )}
        </Card>
        {isOpen && (
          <Lightbox
            mainSrc={getImagePath(album, pictures[photoIndex].body, 'preview')}
            nextSrc={getImagePath(
              album,
              pictures[(photoIndex + 1) % pictures.length].body,
              'preview',
            )}
            prevSrc={getImagePath(
              album,
              pictures[(photoIndex + pictures.length - 1) % pictures.length].body,
              'preview',
            )}
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
