import { Carousel, Icon } from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';
import { mobileUserAgents } from '../../../../../helpers/regexHelpers';

import './CarouselSection.less';

const CarouselSection = () => {
  let isMobile = false;

  if (typeof navigator !== 'undefined' && mobileUserAgents.test(navigator.userAgent))
    isMobile = true;

  const settings = {
    dots: false,
    arrows: true,
    lazyLoad: true,
    nextArrow: <Icon type="caret-right" />,
    prevArrow: <Icon type="caret-left" />,
    slidesToShow: isMobile ? 2 : 3,
  };

  return (
    <section className="WebsiteMainPage__carouselSection">
      <div className="CarouselSection__wrapper">
        <Carousel {...settings}>
          {[0, 1, 2, 3, 4].map(t => (
            <div key={t} className="CarouselSection__itemWrapper">
              <div className="CarouselSection__item">
                <img
                  className="CarouselSection__itemImg"
                  src={
                    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
                  }
                  alt=""
                />
                <p className="CarouselSection__itemName">ITALIAN RESTAURANT</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <Link to={'/map?showPanel=true'} className="WebsiteMainPage__button">
        See All Restaurant <Icon type="right" />
      </Link>
    </section>
  );
};

export default CarouselSection;
