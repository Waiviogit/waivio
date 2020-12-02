import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import './GalleryItem.less';

const GalleryItem = ({ image, handleOpenLightbox, idx, getImagePath }) => (
  <div className="GalleryItem">
    <Card
      hoverable
      cover={<img alt="" src={getImagePath(image.body)} className="GalleryItem__image" />}
      onClick={() => handleOpenLightbox(idx)}
    />
  </div>
);

GalleryItem.propTypes = {
  image: PropTypes.shape().isRequired,
  handleOpenLightbox: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
  getImagePath: PropTypes.func.isRequired,
};

export default GalleryItem;
