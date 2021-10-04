import { Carousel, Icon } from 'antd';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { mobileUserAgents } from '../../../../../helpers/regexHelpers';
import { getListOfRestaurant } from '../../../../../../store/websiteStore/websiteSelectors';
import { getRestaurants } from '../../../../../../store/websiteStore/websiteActions';

import './CarouselSection.less';

const CarouselSection = props => {
  let isMobile = false;

  if (typeof navigator !== 'undefined' && mobileUserAgents.test(navigator.userAgent))
    isMobile = true;

  useEffect(() => {
    props.getRestaurants();
  }, []);

  const settings = {
    dots: false,
    arrows: true,
    lazyLoad: true,
    nextArrow: <Icon type="caret-right" />,
    prevArrow: <Icon type="caret-left" />,
    slidesToShow: isMobile ? 2 : 3,
  };

  if (isEmpty(props.restaurants)) return null;

  return (
    <section className="WebsiteMainPage__carouselSection">
      <div className="CarouselSection__wrapper">
        <Carousel {...settings}>
          {props.restaurants.map(item => (
            <Link
              to={`/map?${item.route}&showPanel=true&type=restaurant`}
              key={item._id}
              className="CarouselSection__itemWrapper"
            >
              <div className="CarouselSection__item">
                <img className="CarouselSection__itemImg" src={item.image} alt={item.name} />
                <p className="CarouselSection__itemName">{item.name}</p>
              </div>
            </Link>
          ))}
        </Carousel>
      </div>
      <Link to={'/map?showPanel=true&type=restaurant'} className="WebsiteMainPage__button">
        See All Restaurants <Icon type="right" />
      </Link>
    </section>
  );
};

CarouselSection.propTypes = {
  restaurants: PropTypes.arrayOf().isRequired,
  getRestaurants: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    restaurants: getListOfRestaurant(state),
  }),
  { getRestaurants },
)(CarouselSection);
