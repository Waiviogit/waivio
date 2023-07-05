import React, { useEffect, useState } from 'react';
import { Carousel, Icon } from 'antd';
import { useHistory, useRouteMatch } from 'react-router';
import Lightbox from 'react-image-lightbox';
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

const PicturesSlider = ({ hoveredOption, activeOption, activeCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImage, setCurrentImage] = useState({});
  const [hoveredPic, setHoveredPic] = useState({});
  const [pictures, setPictures] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const history = useHistory();
  const match = useRouteMatch();
  const locale = useSelector(getUsedLocale);
  const authorPermlink = history.location.hash
    ? getLastPermlinksFromHash(history.location.hash)
    : match.params.name;
  let currentSrc = hoveredPic.body || currentImage?.body;

  if (hoveredOption?.avatar || activeOption[activeCategory]?.avatar) {
    currentSrc = hoveredOption.avatar || activeOption[activeCategory].avatar;
  }

  const onImgClick = (e, pic) => {
    setCurrentImage(pic);
    setPhotoIndex(pictures.indexOf(pic));
  };
  const onSlideChange = (curr, next) => {
    setCurrentSlide(next);
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
      setPhotoIndex(0);
    });
  }, [authorPermlink]);

  const carouselSettings = pics => {
    const limitToShow = isMobile() ? 6 : 8;
    const slidesToShow = pics.length > limitToShow ? limitToShow : pics.length;

    return {
      dots: false,
      arrows: !isMobile(),
      lazyLoad: true,
      rows: 1,
      nextArrow: currentSlide >= pics.length - slidesToShow ? <></> : <Icon type="caret-right" />,
      prevArrow: currentSlide === 0 ? <></> : <Icon type="caret-left" />,
      infinite: false,
      slidesToShow,
      swipeToSlide: isMobile(),
      slidesToScroll: 1,
    };
  };

  return !isEmpty(pictures) ? (
    <div className={'PicturesSlider'}>
      <div>
        <img
          className="PicturesSlider__previewImage"
          src={getProxyImageURL(currentSrc)}
          alt={'pic'}
          onClick={() => setIsOpen(true)}
        />
      </div>
      <br />
      <Carousel {...carouselSettings(pictures)} beforeChange={onSlideChange}>
        {map(pictures, pic => (
          <div key={pic.id}>
            <img
              onClick={e => onImgClick(e, pic)}
              onMouseOver={() => {
                setHoveredPic(pic);
              }}
              onMouseOut={() => {
                setHoveredPic({});
              }}
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
      {isOpen && (
        <Lightbox
          wrapperClassName="LightboxTools"
          mainSrc={pictures[photoIndex]?.body}
          nextSrc={pictures[(photoIndex + 1) % pictures.length]?.body}
          prevSrc={pictures[(photoIndex - 1) % pictures.length]?.body}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex - 1) % pictures.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % pictures.length)}
        />
      )}
    </div>
  ) : null;
};

PicturesSlider.propTypes = {
  hoveredOption: PropTypes.shape(),
  activeOption: PropTypes.shape(),
  activeCategory: PropTypes.string,
};

export default PicturesSlider;
