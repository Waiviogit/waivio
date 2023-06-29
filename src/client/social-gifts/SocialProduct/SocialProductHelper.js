import React from 'react';
import { Icon } from 'antd';
import { isMobile } from '../../../common/helpers/apiHelpers';

const slideWidth = 270;
const slidesToShow = Math.floor(typeof window !== 'undefined' && window.innerWidth / slideWidth);

export const carouselSettings = {
  dots: false,
  dotPosition: 'bottom',
  dotNumber: 5,
  arrows: !isMobile(),
  lazyLoad: true,
  rows: 1,
  nextArrow: <Icon type="caret-right" />,
  prevArrow: <Icon type="caret-left" />,
  // infinite: slidesToShow < objects.length,
  infinite: false,
  slidesToShow,
  slidesToScroll: slidesToShow,
};

export const objAuthorPermlink = obj => obj.authorPermlink || obj.author_permlink;

export default null;
