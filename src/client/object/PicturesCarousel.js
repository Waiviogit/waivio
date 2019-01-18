import React from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { Carousel, Icon } from 'antd';
import { Link } from 'react-router-dom';
import './PicturesCarousel.less';

const Arrow = ({ icon, style, onClick, className }) => (
  <Icon
    type={icon}
    onClick={onClick}
    style={{ ...style, fontSize: '20px' }}
    className={className}
  />
);

Arrow.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.string.isRequired,
  style: PropTypes.shape(),
  className: PropTypes.string,
};

Arrow.defaultProps = {
  onClick: () => {},
  style: {},
  className: '',
};

const PicturesCarousel = ({ pics, objectID }) => {
  const settings = {
    arrows: true,
    lazyLoad: true,
    nextArrow: <Arrow icon="right" />,
    prevArrow: <Arrow icon="left" />,
  };

  return (
    pics && (
      <div className="PicturesCarousel">
        <Carousel {...settings}>
          {map(pics, pic => (
            <Link
              key={pic.id}
              to={{ pathname: `/object/@${objectID}/gallery/album/${pic.id}` }}
              className="PicturesCarousel__imageWrap"
            >
              <img src={pic.body} alt="pic" className="PicturesCarousel__image" />
            </Link>
          ))}
        </Carousel>
      </div>
    )
  );
};

PicturesCarousel.propTypes = {
  pics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  objectID: PropTypes.string.isRequired,
};

export default PicturesCarousel;
