import { max, get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { getProxyImageURL } from '../../helpers/image';
import './GalleryAlbum.less';

const GalleryAlbum = ({ album }) => {
  const filterItems = album.items;
  const albumItem = max(filterItems, item => item.weight) || {
    body: '/images/icons/no-image.png',
  };
  const getRelatedAlbumCount = item => get(item, 'count');
  const getAlbumCount = filterItems ? filterItems.length : 0;
  const albumCount = getRelatedAlbumCount(album) ? getRelatedAlbumCount(album) : getAlbumCount;
  const getImagePath = item => getProxyImageURL(item, 'preview');

  return (
    <div className="GalleryAlbum">
      <Card
        hoverable
        cover={
          <img alt="example" src={getImagePath(albumItem.body)} className="GalleryAlbum__image" />
        }
      >
        <Card.Meta title={`${album.body} (${albumCount})`} />
      </Card>
    </div>
  );
};

GalleryAlbum.propTypes = {
  album: PropTypes.shape().isRequired,
};

export default GalleryAlbum;
