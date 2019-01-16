import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import './GalleryItem.less';

const GalleryItem = ({ image, handleOpenLightbox, idx }) => (
  <div className="GalleryItem">
    <Card
      hoverable
      cover={<img alt="" src={image.body} />}
      onClick={() => handleOpenLightbox(idx)}
    />
  </div>
);

GalleryItem.propTypes = {
  image: PropTypes.shape().isRequired,
  handleOpenLightbox: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
};

export default GalleryItem;
