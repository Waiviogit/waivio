import { max } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import './GalleryAlbum.less';
import { calculateApprovePercent } from '../../helpers/wObjectHelper';

const GalleryAlbum = ({ album, wobjMainers }) => {
  const filterItems =
    album.items &&
    album.items.filter(
      item => calculateApprovePercent(item.active_votes, item.weight, wobjMainers) >= 70,
    );
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
  wobjMainers: PropTypes.shape().isRequired,
};

export default GalleryAlbum;
