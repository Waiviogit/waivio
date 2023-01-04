import React, { useEffect, useRef } from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { Carousel, Icon } from 'antd';
import { Link } from 'react-router-dom';

import './PicturesCarousel.less';
import { isMobile } from '../../common/helpers/apiHelpers';

const PicturesCarousel = ({
  onOptionPicClick,
  albums,
  isOptionsType,
  activePicture,
  pics,
  objectID,
}) => {
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
  const albumsLink = albums?.map(album => album.id);

  const getOptionUrl = pic => {
    if (!albumsLink.includes(pic.id)) return `/object/${objectID}/gallery`;
    if (isOptionsType) {
      if (pic.name === 'galleryItem' || (pic.name === 'options' && objectID === pic.parentPermlink))
        return `/object/${objectID}/gallery/album/${pic.id}`;
      if (pic.name === 'galleryItem' || (pic.name === 'options' && objectID !== pic.parentPermlink))
        return isMobile() ? `/object/${pic.id}/about` : `/object/${pic.id}`;
    }
    if (pic.name === 'avatar') return `/object/${objectID}/gallery`;

    return `/object/${objectID}/gallery/album/${pic.id}`;
  };

  return pics ? (
    <div className="PicturesCarousel">
      <Carousel {...settings} ref={slider}>
        {map(pics, pic => (
          <Link key={pic.id} to={getOptionUrl(pic)} className="PicturesCarousel__imageWrap">
            <img
              onClick={() => onOptionPicClick(pic)}
              src={pic.body}
              alt="pic"
              className="PicturesCarousel__image"
            />
          </Link>
        ))}
      </Carousel>
    </div>
  ) : (
    <div />
  );
};

PicturesCarousel.propTypes = {
  pics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  objectID: PropTypes.string.isRequired,
  activePicture: PropTypes.shape(),
  isOptionsType: PropTypes.bool,
  onOptionPicClick: PropTypes.func,
};
PicturesCarousel.defaultProps = {
  activePicture: {},
  isOptionsType: false,
  onOptionPicClick: () => {},
};

export default PicturesCarousel;
