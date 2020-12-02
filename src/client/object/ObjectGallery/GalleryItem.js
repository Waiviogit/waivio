import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { getProxyImageURL } from '../../helpers/image';
import './GalleryItem.less';

const GalleryItem = ({ image, handleOpenLightbox, idx }) => {
  const getImagePath = item => getProxyImageURL(item, 'preview');
  return (
    <div className="GalleryItem">
      <Card
        hoverable
        cover={<img alt="" src={getImagePath(image.body)} className="GalleryItem__image" />}
        onClick={() => handleOpenLightbox(idx)}
      />
    </div>
  );
};

GalleryItem.propTypes = {
  image: PropTypes.shape().isRequired,
  handleOpenLightbox: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
};

export default GalleryItem;
