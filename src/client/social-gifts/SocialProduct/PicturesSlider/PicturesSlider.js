import classNames from 'classnames';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Carousel, Icon } from 'antd';
import { useSelector } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import { indexOf, isEmpty, map } from 'lodash';
import PropTypes from 'prop-types';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import { getProxyImageURL } from '../../../../common/helpers/image';
import { getObjectAvatar, getObjectName } from '../../../../common/helpers/wObjectHelper';
import { getWobjectGallery } from '../../../../waivioApi/ApiClient';
import { getUsedLocale } from '../../../../store/appStore/appSelectors';

import './PicturesSlider.less';

const NextArrow = ({ onClick, currentSlide, slideCount, slidesToShow }) => {
  const hide = currentSlide >= slideCount - slidesToShow;

  return (
    <span
      className={`PicturesSlider__arrow PicturesSlider__arrow--next ${
        hide ? 'PicturesSlider__arrow--hidden' : ''
      }`}
      onClick={hide ? undefined : onClick}
    >
      <Icon type="caret-right" />
    </span>
  );
};

NextArrow.propTypes = {
  onClick: PropTypes.func,
  currentSlide: PropTypes.number,
  slideCount: PropTypes.number,
  slidesToShow: PropTypes.number,
};

const PrevArrow = ({ onClick, currentSlide }) => {
  const hide = currentSlide <= 0;

  return (
    <span
      className={`PicturesSlider__arrow PicturesSlider__arrow--prev ${
        hide ? 'PicturesSlider__arrow--hidden' : ''
      }`}
      onClick={hide ? undefined : onClick}
    >
      <Icon type="caret-left" />
    </span>
  );
};

PrevArrow.propTypes = {
  onClick: PropTypes.func,
  currentSlide: PropTypes.number,
};

const PicturesSlider = ({
  hoveredOption,
  activeOption,
  activeCategory,
  currentWobj,
  altText,
  albums,
  countShowSlide,
  countShowMobile,
}) => {
  const [currentImage, setCurrentImage] = useState({});
  const [hoveredPic, setHoveredPic] = useState({});
  const [pictures, setPictures] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const slider = useRef();
  const locale = useSelector(getUsedLocale);
  const authorPermlink = currentWobj?.author_permlink;
  let currentSrc = hoveredPic.body || currentImage?.body;

  if (hoveredOption?.avatar || activeOption[activeCategory]?.avatar) {
    currentSrc = hoveredOption?.avatar || activeOption[activeCategory]?.avatar;
  }

  const onImgClick = (e, pic) => {
    setCurrentImage(pic);
    setPhotoIndex(pictures?.indexOf(pic));
    isMobile() && slider.current.goTo(pictures?.indexOf(pic));
  };

  useEffect(() => {
    getWobjectGallery(authorPermlink, locale).then(async al => {
      let allPhotos =
        al
          ?.flatMap(alb => alb?.items)
          ?.sort((a, b) => (b.name === 'avatar') - (a.name === 'avatar')) || [];
      const avatar = getObjectAvatar(currentWobj);

      if (avatar && !allPhotos.some(p => p.body === avatar)) {
        allPhotos = [{ body: avatar, name: 'avatar', _id: 'avatar' }, ...allPhotos];
      }

      setPictures(allPhotos);
      setCurrentImage(isEmpty(avatar) ? allPhotos[0] : { body: avatar });
      setPhotoIndex(0);
    });
  }, [authorPermlink, currentWobj.author_permlink, albums?.length]);

  const isMobileDevice = useMemo(() => isMobile(), []);

  const slidesToShow = Math.min(pictures.length, isMobileDevice ? countShowMobile : countShowSlide);
  const carouselSettings = useMemo(
    () => ({
      dots: false,
      arrows: !isMobileDevice,
      lazyLoad: true,
      rows: 1,
      infinite: false,
      slidesToShow,
      swipeToSlide: isMobileDevice,
      slidesToScroll: 1,
      nextArrow: <NextArrow slidesToShow={slidesToShow} />,
      prevArrow: <PrevArrow />,
      variableWidth: true,
      afterChange: current => {
        setPhotoIndex(current);
      },
    }),
    [pictures, slidesToShow, isMobileDevice],
  );

  const MobileSlideChange = (curr, next) => {
    setPhotoIndex(next);
    setCurrentImage(pictures[next]);
  };

  const mobileCarouselSettings = useMemo(
    () => ({
      dots: false,
      arrows: false,
      lazyLoad: true,
      rows: 1,
      infinite: false,
      slidesToShow: 1,
      swipeToSlide: isMobileDevice,
      slidesToScroll: 1,
      nextArrow: <NextArrow slidesToShow={slidesToShow} />,
      prevArrow: <PrevArrow />,
      beforeChange: MobileSlideChange,
    }),
    [pictures, slidesToShow, isMobileDevice],
  );

  const onClosePicture = () => {
    setIsOpen(false);
    setPhotoIndex(
      indexOf(
        pictures,
        pictures.find(pic => pic.body === currentImage.body),
      ),
    );
  };

  return !isEmpty(pictures) ? (
    <div className={'PicturesSlider'}>
      {isMobile() ? (
        <Carousel {...mobileCarouselSettings} ref={slider} className={'MobileCarousel'}>
          {map(pictures, (pic, i) => (
            <div key={pic._id || pic.id || pic.body}>
              <img
                onClick={() => setIsOpen(true)}
                onMouseOver={() => {
                  setHoveredPic(pic);
                }}
                onMouseOut={() => {
                  setHoveredPic({});
                }}
                src={getProxyImageURL(pic?.body)}
                alt={`${i} ${getObjectName(currentWobj)}`}
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <div>
          <img
            className="PicturesSlider__previewImage"
            src={getProxyImageURL(currentSrc)}
            alt={altText}
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}
      <br />
      <Carousel {...carouselSettings}>
        {map(pictures, (pic, i) => (
          <div key={pic._id || pic.id || pic.body}>
            <img
              onClick={e => onImgClick(e, pic)}
              onMouseOver={() => {
                setHoveredPic(pic);
              }}
              onMouseOut={() => {
                setHoveredPic({});
              }}
              src={getProxyImageURL(pic?.body)}
              className={classNames('PicturesSlider__thumbnail', {
                'PicturesSlider__thumbnail--active': pic?.body === currentImage?.body,
              })}
              alt={`${i} ${getObjectName(currentWobj)}`}
            />
          </div>
        ))}
      </Carousel>
      {isOpen && (
        <Lightbox
          wrapperClassName="LightboxTools"
          mainSrc={pictures[photoIndex]?.body}
          nextSrc={
            pictures?.length <= 1 || photoIndex === pictures?.length - 1
              ? null
              : pictures[(photoIndex + 1) % pictures?.length]?.body
          }
          prevSrc={
            pictures?.length <= 1 ? null : pictures[(photoIndex - 1) % pictures?.length]?.body
          }
          onCloseRequest={onClosePicture}
          onMovePrevRequest={() => setPhotoIndex((photoIndex - 1) % pictures?.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % pictures?.length)}
        />
      )}
    </div>
  ) : null;
};

PicturesSlider.propTypes = {
  albums: PropTypes.arrayOf(PropTypes.shape()),
  currentWobj: PropTypes.shape(),
  hoveredOption: PropTypes.shape(),
  activeOption: PropTypes.shape(),
  relatedAlbum: PropTypes.shape(),
  activeCategory: PropTypes.string,
  altText: PropTypes.string,
  countShowSlide: PropTypes.number,
  countShowMobile: PropTypes.number,
};

PicturesSlider.defaultProps = {
  countShowSlide: 8,
  countShowMobile: 6,
};

export default PicturesSlider;
