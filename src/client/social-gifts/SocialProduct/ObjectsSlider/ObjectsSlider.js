import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { Carousel, Icon } from 'antd';
import ShopObjectCard from '../../ShopObjectCard/ShopObjectCard';
import { isTabletOrMobile } from '../socialProductHelper';
import useAdLevelData from '../../../../hooks/useAdsense';
import GoogleAds from '../../../adsenseAds/GoogleAds';
import { getSettingsAds } from '../../../../store/websiteStore/websiteSelectors';

export const injectAdsIntoItems = (items, renderAd, everyN = 5) =>
  items.flatMap((item, index) => {
    const elements = [item];

    if ((index + 1) % everyN === 0 && index !== items.length - 1) {
      elements.push(renderAd(index));
    }

    return elements;
  });

const ObjectsSlider = ({ title, objects, name }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideWidth = 270;
  const slidesToShow = Math.floor(typeof window !== 'undefined' && window.innerWidth / slideWidth);
  const { frequency } = useAdLevelData();
  const unitCode = useSelector(getSettingsAds)?.displayUnitCode || '';
  const processedItems = useMemo(() => {
    if (!['similar', 'related'].includes(name) || !frequency || isEmpty(unitCode)) {
      return objects.map((item, index) => (
        <ShopObjectCard key={item.author_permlink || index} wObject={item} isSocialProduct />
      ));
    }

    return injectAdsIntoItems(
      objects.map((item, index) => (
        <ShopObjectCard key={item.author_permlink || index} wObject={item} isSocialProduct />
      )),
      index => <GoogleAds key={`ad-${index}`} />,
      frequency,
    );
  }, [objects, name, frequency]);

  const carouselSettings = {
    dots: false,
    arrows: !isTabletOrMobile,
    lazyLoad: false,
    rows: 1,
    nextArrow:
      currentSlide >= processedItems.length - slidesToShow ? null : <Icon type="caret-right" />,
    prevArrow: currentSlide === 0 ? null : <Icon type="caret-left" />,
    slidesToScroll: !isTabletOrMobile ? slidesToShow : 1,
    swipeToSlide: isTabletOrMobile,
    infinite: false,
    slidesToShow: isTabletOrMobile ? 2 : slidesToShow,
  };

  return (
    !isEmpty(processedItems) && (
      <div className="SocialProduct__addOn-section">
        <div className="SocialProduct__heading">{title}</div>
        <div className={`Slider__wrapper-${name}`}>
          <Carousel {...carouselSettings} beforeChange={(_, next) => setCurrentSlide(next)}>
            {processedItems}
          </Carousel>
        </div>
      </div>
    )
  );
};

ObjectsSlider.propTypes = {
  objects: PropTypes.arrayOf().isRequired,
  title: PropTypes.string,
  name: PropTypes.string,
};

export default ObjectsSlider;
