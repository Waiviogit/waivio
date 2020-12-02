import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'antd';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import GalleryItem from './GalleryItem';
import Loading from '../../components/Icon/Loading';
import './GalleryAlbum.less';

const AlbumFeed = ({
  pictures,
  loadMoreContent,
  hasMore,
  handleOpenLightbox,
  isFetching,
  getImagePath,
}) => (
  <ReduxInfiniteScroll
    loadMore={loadMoreContent}
    hasMore={hasMore}
    elementIsScrollable={false}
    loader={<Loading />}
    loadingMore={isFetching}
    threshold={1500}
  >
    {pictures.map((image, idx) => (
      <Col span={12} key={image.body}>
        <GalleryItem
          image={image}
          handleOpenLightbox={handleOpenLightbox}
          idx={idx}
          getImagePath={getImagePath}
        />
      </Col>
    ))}
  </ReduxInfiniteScroll>
);

AlbumFeed.propTypes = {
  pictures: PropTypes.shape().isRequired,
  loadMoreContent: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  handleOpenLightbox: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  getImagePath: PropTypes.func.isRequired,
};

AlbumFeed.defaultProps = {
  isFetching: false,
};

export default AlbumFeed;
