import React from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { Carousel, Icon } from 'antd';
import { Link } from 'react-router-dom';

import './PicturesCarousel.less';

const PicturesCarousel = ({ pics, objectID }) => {
  const settings = {
    dots: false,
    arrows: true,
    lazyLoad: true,
    nextArrow: <Icon type="right" style={{ fontSize: '20px' }} />,
    prevArrow: <Icon type="left" style={{ fontSize: '20px' }} />,
  };

  return pics ? (
    <div className="PicturesCarousel">
      <Carousel {...settings}>
        {map(pics, pic => (
          <Link
            key={pic.id}
            to={{ pathname: `/object/${objectID}/gallery/album/${pic.id}` }}
            className="PicturesCarousel__imageWrap"
          >
            <img src={pic.body} alt="pic" className="PicturesCarousel__image" />
          </Link>
        ))}
      </Carousel>
    </div>
  ) : null;
};

PicturesCarousel.propTypes = {
  pics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  objectID: PropTypes.string.isRequired,
};

export default PicturesCarousel;
