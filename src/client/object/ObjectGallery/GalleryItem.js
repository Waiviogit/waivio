import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { getImagePath } from '../../../common/helpers/image';
import './GalleryItem.less';

const GalleryItem = ({ image, handleOpenLightbox, idx, album }) => (
  <div className="GalleryItem">
    <Card
      hoverable
      cover={
        <img
          alt=""
          src={getImagePath(album, image.body, 'preview')}
          className="GalleryItem__image"
        />
      }
      onClick={() => handleOpenLightbox(idx)}
    />
  </div>
);

GalleryItem.propTypes = {
  image: PropTypes.shape().isRequired,
  handleOpenLightbox: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
  album: PropTypes.shape().isRequired,
};

export default GalleryItem;
