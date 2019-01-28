import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import './GalleryAlbum.less';

const GalleryAlbum = ({ album }) => {
  const albumItem = _.max(album.items, item => item.weight) || {
    body: '/images/icons/no-image.png',
  };
  return (
    <div className="GalleryAlbum">
      <Card
        hoverable
        cover={<img alt="example" src={albumItem.body} className="GalleryAlbum__image" />}
      >
        <Card.Meta title={`${album.body} (${album.items ? album.items.length : 0})`} />
      </Card>
    </div>
  );
};
GalleryAlbum.propTypes = {
  album: PropTypes.shape().isRequired,
};
GalleryAlbum.defaultProps = {
  album: {},
};
export default GalleryAlbum;
