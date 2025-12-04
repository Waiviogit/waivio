import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Carousel, Icon } from 'antd';
import ExpertCard from './ExpertCard';
import { isTabletOrMobile } from '../../SocialProduct/socialProductHelper';
import { getUsersAvatar } from '../../../../waivioApi/ApiClient';
import { sortByExpertOrder } from '../../../../common/helpers/wObjectHelper';
import './Experts.less';

const Experts = ({ title, experts, name }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expertsArr, setExpertsArr] = useState(experts);
  const slideWidth = 240;
  const slidesToShow = Math.floor(typeof window !== 'undefined' && window.innerWidth / slideWidth);
  const carouselSettings = {
    dots: false,
    dotPosition: 'bottom',
    dotNumber: 5,
    arrows: !isTabletOrMobile,
    lazyLoad: false,
    rows: 1,
    nextArrow: currentSlide >= experts.length - slidesToShow ? null : <Icon type="caret-right" />,
    prevArrow: currentSlide === 0 ? null : <Icon type="caret-left" />,
    slidesToScroll: !isTabletOrMobile ? slidesToShow : 1,
    swipeToSlide: isTabletOrMobile,
    infinite: false,
    slidesToShow: isTabletOrMobile ? 2 : slidesToShow,
  };

  const onSlideChange = (curr, next) => {
    setCurrentSlide(next);
  };

  useEffect(() => {
    setExpertsArr([]);
    if (!isEmpty(experts)) {
      const expertsNames = experts.map(e => e.name);

      getUsersAvatar(expertsNames).then(r => {
        setExpertsArr(sortByExpertOrder(r, experts));
      });
    }

    return () => setExpertsArr([]);
  }, [name, experts]);

  return (
    !isEmpty(experts) && (
      <div className="SocialProduct__addOn-section">
        <div className="SocialProduct__heading">{title}</div>
        <div className={`Slider__wrapper-${name}`}>
          <Carousel {...carouselSettings} beforeChange={onSlideChange}>
            {expertsArr?.map(expert => (
              <ExpertCard key={expert.name} expert={expert} />
            ))}
          </Carousel>
        </div>
      </div>
    )
  );
};

Experts.propTypes = {
  experts: PropTypes.arrayOf().isRequired,
  title: PropTypes.string,
  name: PropTypes.string,
};

export default Experts;
