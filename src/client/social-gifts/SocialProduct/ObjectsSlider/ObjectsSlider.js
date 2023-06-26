import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Carousel } from 'antd';
import ShopObjectCard from '../../ShopObjectCard/ShopObjectCard';
import { carouselSettings } from '../SocialProductHelper';

const ObjectsSlider = ({ title, objects, name }) =>
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
  );

ObjectsSlider.propTypes = {
  objects: PropTypes.arrayOf(),
  title: PropTypes.string,
  name: PropTypes.string,
};

export default ObjectsSlider;
