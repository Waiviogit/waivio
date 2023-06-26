import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Carousel, Icon } from 'antd';
import ShopObjectCard from '../../ShopObjectCard/ShopObjectCard';
import { isTabletOrMobile } from '../SocialProductHelper';

const ObjectsSlider = ({ title, objects, name }) => {
  const slideWidth = 270;
  const slidesToShow = Math.floor(typeof window !== 'undefined' && window.innerWidth / slideWidth);

  const carouselSettings = {
    dots: false,
    dotPosition: 'bottom',
    dotNumber: 5,
    arrows: !isTabletOrMobile,
    lazyLoad: false,
    rows: 1,
    nextArrow: <Icon type="caret-right" />,
    prevArrow: <Icon type="caret-left" />,
    slidesToScroll: !isTabletOrMobile ? slidesToShow : 1,
    swipeToSlide: isTabletOrMobile,
    infinite: false,
    slidesToShow,
  };

  return (
    !isEmpty(objects) && (
      <div className="SocialProduct__addOn-section">
        <div className="SocialProduct__heading">{title}</div>
        <div className={`Slider__wrapper-${name}`}>
          <Carousel {...carouselSettings}>
            {objects?.map(wObject => (
              <ShopObjectCard key={wObject.author_permlink} wObject={wObject} />
            ))}
          </Carousel>
        </div>
      </div>
    )
  );
};

ObjectsSlider.propTypes = {
  objects: PropTypes.arrayOf(),
  title: PropTypes.string,
  name: PropTypes.string,
};

export default ObjectsSlider;
