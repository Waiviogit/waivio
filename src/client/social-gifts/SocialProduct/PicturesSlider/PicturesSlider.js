import React, { useEffect, useState } from 'react';
import { Carousel, Icon } from 'antd';
import { useHistory, useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux';
import { get, isEmpty, map } from 'lodash';
import PropTypes from 'prop-types';
import './PicturesSlider.less';
import { getRelatedPhotos, getWobjectGallery } from '../../../../waivioApi/ApiClient';
import { getUsedLocale } from '../../../../store/appStore/appSelectors';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import { getProxyImageURL } from '../../../../common/helpers/image';
import { getLastPermlinksFromHash } from '../../../../common/helpers/wObjectHelper';

const limit = 100;

const carouselSettings = pics => {
  const limitToShow = isMobile() ? 6 : 8;
  const slidesToShow = pics.length > limitToShow ? limitToShow : pics.length;

  return {
    dots: false,
    arrows: true,
    lazyLoad: true,
    rows: 1,
    nextArrow: <Icon type="caret-right" />,
    prevArrow: <Icon type="caret-left" />,
    infinite: true,
    slidesToShow,
    slidesToScroll: 1,
  };
};

const PicturesSlider = ({ hoveredOption, activeOption, activeCategory }) => {
  const [currentImage, setCurrentImage] = useState({});
  const [pictures, setPictures] = useState([]);
  const history = useHistory();
  const match = useRouteMatch();
  const locale = useSelector(getUsedLocale);
  const authorPermlink = history.location.hash
    ? getLastPermlinksFromHash(history.location.hash)
    : match.params.name;
  let currentSrc = currentImage?.body;

  if (hoveredOption?.avatar || activeOption[activeCategory]?.avatar) {
    currentSrc = hoveredOption.avatar || activeOption[activeCategory].avatar;
  }

  const onImgClick = (e, pic) => {
    setCurrentImage(pic);
  };

  useEffect(() => {
    getWobjectGallery(authorPermlink, locale).then(async albums => {
      const relatedAlbum = await getRelatedPhotos(authorPermlink, limit, 0);
      const allPhotos = albums
        ?.flatMap(alb => alb?.items)
        ?.sort((a, b) => (b.name === 'avatar') - (a.name === 'avatar'));
      const photos = [...allPhotos, ...get(relatedAlbum, 'items', [])];

      setPictures(photos);
      setCurrentImage(photos[0]);
    });
  }, [authorPermlink]);

  return !isEmpty(pictures) ? (
    <div className={'PicturesSlider'}>
      <div>
        <img
          className="PicturesSlider__previewImage"
          src={getProxyImageURL(currentSrc)}
          alt={'pic'}
        />
      </div>
      <br />
      <Carousel {...carouselSettings(pictures)}>
        {map(pictures, pic => (
          <div key={pic.id}>
            <img
              onClick={e => onImgClick(e, pic)}
              src={getProxyImageURL(pic?.body)}
              className={
                pic?.body === currentImage?.body
                  ? 'PicturesSlider__thumbnail-active'
                  : 'PicturesSlider__thumbnail'
              }
              alt="pic"
            />
          </div>
        ))}
      </Carousel>
    </div>
  ) : null;
};

PicturesSlider.propTypes = {
  hoveredOption: PropTypes.shape(),
  activeOption: PropTypes.shape(),
  activeCategory: PropTypes.string,
};

export default PicturesSlider;
