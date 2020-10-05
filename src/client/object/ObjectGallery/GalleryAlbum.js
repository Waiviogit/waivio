import { max } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import './GalleryAlbum.less';

const GalleryAlbum = ({ album }) => {
  const filterItems = album.items;
  const albumItem = max(filterItems, item => item.weight) || {
    body: '/images/icons/no-image.png',
  };

  return (
    <div className="GalleryAlbum">
      <Card
        hoverable
        cover={<img alt="example" src={albumItem.body} className="GalleryAlbum__image" />}
      >
        <Card.Meta title={`${album.body} (${filterItems ? filterItems.length : 0})`} />
      </Card>
    </div>
  );
};

GalleryAlbum.propTypes = {
  album: PropTypes.shape().isRequired,
};

export default GalleryAlbum;
