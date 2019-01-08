import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import './GalleryCard.less';

const GalleryCard = ({ image, handleOpenLightbox, idx }) => (
  <div className="GalleryCard">
    <Card
      hoverable
      cover={<img alt="" src={image.body} />}
      onClick={() => handleOpenLightbox(idx)}
    />
  </div>
);

GalleryCard.propTypes = {
  image: PropTypes.shape().isRequired,
  handleOpenLightbox: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
};

export default GalleryCard;
