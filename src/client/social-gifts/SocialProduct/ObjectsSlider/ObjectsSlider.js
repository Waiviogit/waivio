import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Carousel, Icon } from 'antd';
import ShopObjectCard from '../../ShopObjectCard/ShopObjectCard';
import { isTabletOrMobile } from '../socialProductHelper';
// import useAdLevelData from '../../../../hooks/useAdsense';
// import { getSettingsAds } from '../../../../store/websiteStore/websiteSelectors';

const ObjectsSlider = ({ title, objects, name }) => {
  const slideWidth = 270;
  const slidesToShow = Math.floor(typeof window !== 'undefined' && window.innerWidth / slideWidth);
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
      slidesToShow: isTabletOrMobile ? 2 : slidesToShow,
    }),
    [slidesToShow],
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
};

export default ObjectsSlider;
