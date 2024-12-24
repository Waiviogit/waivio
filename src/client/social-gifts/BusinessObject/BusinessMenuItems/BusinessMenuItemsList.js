import React, { useEffect, useState } from 'react';
import { Carousel, Icon } from 'antd';
import { isEmpty } from 'lodash';

import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import BusinessMenuItem from './BusinessMenuItem';
import { sortListItems } from '../../../../common/helpers/wObjectHelper';
import { prepareMenuItems } from '../../SocialProduct/SocialMenuItems/SocialMenuItems';
import './BusinessMenuItems.less';
import { isTablet, isTabletOrMobile } from '../../SocialProduct/socialProductHelper';
import { isMobile } from '../../../../common/helpers/apiHelpers';

const BusinessMenuItemsList = ({
  menuItem,
  // intl
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  // const slideWidth = 240;
  let slidesToShow = 4;
  const linkList = sortListItems(
    menuItems,
    menuItem.map(i => i.permlink),
  );

  if (isTablet) {
    slidesToShow = 3;
  }
  if (isTabletOrMobile) {
    slidesToShow = 2;
  }

  const carouselSettings = {
    dots: false,
    dotPosition: 'bottom',
    dotNumber: 5,
    arrows: !isTabletOrMobile,
    lazyLoad: false,
    rows: 1,
    nextArrow: currentSlide >= linkList?.length - slidesToShow ? null : <Icon type="caret-right" />,
    prevArrow: currentSlide === 0 ? null : <Icon type="caret-left" />,
    slidesToScroll: !isTabletOrMobile ? slidesToShow : 1,
    swipeToSlide: isTabletOrMobile,
    infinite: false,
    slidesToShow,
  };

  const onSlideChange = (curr, next) => {
    setCurrentSlide(next);
  };

  useEffect(() => {
    setMenuItems(prepareMenuItems(menuItem));
  }, [menuItem?.length]);

  if (isEmpty(menuItems)) return null;

  return !isEmpty(linkList) && isMobile() ? (
    <div className={'BusinessMenuItems'}>
      {linkList?.map(item => (
        <BusinessMenuItem key={item._id} item={item} />
      ))}
    </div>
  ) : (
    <div className="SocialProduct__addOn-section">
      <div className={`Slider__wrapper-menuItems`}>
        <Carousel {...carouselSettings} beforeChange={onSlideChange}>
          {linkList?.map((item, index) => (
            <BusinessMenuItem
              className={index === 0 ? 'BusinessMenuItems__item-first' : 'BusinessMenuItems__item'}
              key={item._id}
              item={item}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

BusinessMenuItemsList.propTypes = {
  menuItem: PropTypes.arrayOf().isRequired,
};

export default injectIntl(BusinessMenuItemsList);
