import React, { useEffect, useRef } from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { Carousel, Icon } from 'antd';
import { Link } from 'react-router-dom';

import './PicturesCarousel.less';

const PicturesCarousel = ({ activePicture, onClick, pics, objectID }) => {
  const settings = {
    dots: false,
    arrows: true,
    lazyLoad: true,
    nextArrow: <Icon type="right" style={{ fontSize: '20px' }} />,
    prevArrow: <Icon type="left" style={{ fontSize: '20px' }} />,
  };
  const slider = useRef();

  useEffect(() => {
    slider.current.goTo(0);
  }, [activePicture]);

  return pics ? (
    <div className="PicturesCarousel">
      <Carousel {...settings} ref={slider}>
        {map(pics, pic => (
          <Link
            key={pic.id}
            to={{ pathname: `/object/${objectID}/gallery/album/${pic.id}` }}
            className="PicturesCarousel__imageWrap"
          >
            <img
              onClick={() => onClick(pic)}
              src={pic.body}
              alt="pic"
              className="PicturesCarousel__image"
            />
          </Link>
        ))}
      </Carousel>
    </div>
  ) : null;
};

PicturesCarousel.propTypes = {
  pics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  objectID: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  activePicture: PropTypes.shape(),
};
PicturesCarousel.defaultProps = {
  onClick: () => {},
  activePicture: {},
};

export default PicturesCarousel;
