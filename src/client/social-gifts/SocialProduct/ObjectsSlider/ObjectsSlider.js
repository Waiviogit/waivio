import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Carousel, Icon } from 'antd';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import ShopObjectCard from '../../ShopObjectCard/ShopObjectCard';
import { isTabletOrMobile } from '../socialProductHelper';

const NextArrow = ({ onClick, currentSlide, slideCount, slidesToShow }) => {
  const hide = currentSlide >= slideCount - slidesToShow;

  return (
    <div
      className={`slick-arrow slick-next ObjectsSlider__arrow ${
        hide ? 'ObjectsSlider__arrow--hidden' : ''
      }`}
      onClick={onClick}
    >
      <Icon type="right" />
    </div>
  );
};

const PrevArrow = ({ onClick, currentSlide }) => {
  const hide = currentSlide <= 0;

  return (
    <div
      className={`slick-arrow slick-prev ObjectsSlider__arrow ${
        hide ? 'ObjectsSlider__arrow--hidden' : ''
      }`}
      onClick={onClick}
    >
      <Icon type="left" />
    </div>
  );
};

NextArrow.propTypes = {
  onClick: PropTypes.func,
  currentSlide: PropTypes.number,
  slideCount: PropTypes.number,
  slidesToShow: PropTypes.number,
};

PrevArrow.propTypes = {
  onClick: PropTypes.func,
  currentSlide: PropTypes.number,
};

const ObjectsSlider = ({ title, objects, name, defaultSlideWidth = 270 }) => {
  const slidesToShow = Math.floor(
    typeof window !== 'undefined' && window.innerWidth / defaultSlideWidth,
  );
  // const { frequency = 5 } = useAdLevelData();
  // const unitCode = useSelector(getSettingsAds)?.displayUnitCode || '';
  // const isAdInjectable = name === 'similar' || name === 'related';

  // const mixedObjects =
  //   isAdInjectable && frequency && unitCode
  //     ? objects.reduce((acc, obj, idx) => {
  //         if (idx > 0 && idx % frequency === 0) {
  //           acc.push({ isAd: true, key: `ad-${idx}` });
  //         }
  //         acc.push(obj);
  //
  //         return acc;
  //       }, [])
  //     : objects;

  const carouselSettings = useMemo(
    () => ({
      dots: false,
      arrows: !isTabletOrMobile,
      lazyLoad: false,
      rows: 1,
      nextArrow: <Icon type="caret-right" />,
      prevArrow: <Icon type="caret-left" />,
      slidesToScroll: !isTabletOrMobile ? slidesToShow : 1,
      swipeToSlide: isTabletOrMobile,
      infinite: false,
      // eslint-disable-next-line no-nested-ternary
      slidesToShow: isMobile() ? 1 : isTabletOrMobile ? 2 : slidesToShow,
    }),
    [slidesToShow, isMobile()],
  );

  return (
    !isEmpty(objects) && (
      <div className="SocialProduct__addOn-section">
        <div className="SocialProduct__heading">{title}</div>
        <div className={`Slider__wrapper-${name}`}>
          <Carousel {...carouselSettings}>
            {objects.map(
              (item, idx) => (
                // item?.isAd ? (
                //   <GoogleAds inShop key={item.key || `ad-${idx}`} />
                // ) : (
                <ShopObjectCard key={item.author_permlink || idx} wObject={item} isSocialProduct />
              ),
              // ),
            )}
          </Carousel>
        </div>
      </div>
    )
  );
};

ObjectsSlider.propTypes = {
  objects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  title: PropTypes.string,
  name: PropTypes.string,
  defaultSlideWidth: PropTypes.number,
};

export default ObjectsSlider;
