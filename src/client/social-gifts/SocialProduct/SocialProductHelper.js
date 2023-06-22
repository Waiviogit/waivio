import React from 'react';
import { Carousel, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { objectFields } from '../../../common/constants/listOfFields';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';

const slideWidth = 270;
const slidesToShow = Math.floor(typeof window !== 'undefined' && window.innerWidth / slideWidth);

export const carouselSettings = {
  dots: isMobile(),
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

export const getLayout = (fieldName, field) => {
  switch (fieldName) {
    case objectFields.parent:
    case objectFields.merchant:
    case objectFields.brand:
    case objectFields.manufacturer:
      return objAuthorPermlink(field) ? (
        <Link to={`/object/product/${objAuthorPermlink(field)}`}>{field.name}</Link>
      ) : (
        <span>{field.name}</span>
      );
    case objectFields.productWeight:
      return (
        <span>
          {field.value} {field.unit}
        </span>
      );

    case objectFields.dimensions:
      return (
        <span>
          {field.length} x {field.width} x {field.depth} {field.unit}
        </span>
      );
    default:
      return null;
  }
};

export const listItem = (fieldName, field) => (
  <div className="paddingBottom">
    <b>
      <FormattedMessage id={`object_field_${fieldName}`} defaultMessage={fieldName} />:{' '}
    </b>
    {getLayout(fieldName, field)}
  </div>
);

export const getObjectsSliderLayout = (title, objects) =>
  !isEmpty(objects) && (
    <div className="SocialProduct__addOn-section">
      <div className="SocialProduct__heading">{title}</div>
      <div className="Slider__wrapper">
        <Carousel {...carouselSettings}>
          {objects?.map(wObject => (
            <ShopObjectCard key={wObject.author_permlink} wObject={wObject} />
          ))}
        </Carousel>
      </div>
    </div>
  );

export default null;
