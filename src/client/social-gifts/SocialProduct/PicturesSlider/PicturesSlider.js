import React, { useEffect, useState, useRef } from 'react';
import { Carousel, Icon } from 'antd';
import { useHistory, useRouteMatch } from 'react-router';
import Lightbox from 'react-image-lightbox';
import { useSelector } from 'react-redux';
import { get, indexOf, isEmpty, map } from 'lodash';
import PropTypes from 'prop-types';
import './PicturesSlider.less';
import { getRelatedPhotos, getWobjectGallery } from '../../../../waivioApi/ApiClient';
import { getUsedLocale } from '../../../../store/appStore/appSelectors';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import { getProxyImageURL } from '../../../../common/helpers/image';
import {
  getLastPermlinksFromHash,
  getObjectAvatar,
} from '../../../../common/helpers/wObjectHelper';

const limit = 30;

const PicturesSlider = ({ hoveredOption, activeOption, activeCategory, currentWobj }) => {
  const [currentImage, setCurrentImage] = useState({});
  const [nextArrowClicked, setNextArrowClicked] = useState(false);
  const [lastSlideToShow, setLastSlideToShow] = useState(null);
  const [hoveredPic, setHoveredPic] = useState({});
  const [pictures, setPictures] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const slider = useRef();
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
  const limitToShow = isMobile() ? 6 : 8;

  const onImgClick = (e, pic) => {
    setCurrentImage(pic);
    setPhotoIndex(pictures.indexOf(pic));
    isMobile() && slider.current.goTo(pictures.indexOf(pic));
  };
  const onSlideChange = (curr, next) => {
    setLastSlideToShow(next + limitToShow - 1);
    setPhotoIndex(next);
    setNextArrowClicked(true);
  };

  const MobileSlideChange = (curr, next) => {
    setPhotoIndex(next);
    setCurrentImage(pictures[next]);
  };

  useEffect(() => {
    getWobjectGallery(authorPermlink, locale).then(async albums => {
      const relatedAlbum = await getRelatedPhotos(authorPermlink, limit, 0);
      const allPhotos = albums
        ?.flatMap(alb => alb?.items)
        ?.sort((a, b) => (b.name === 'avatar') - (a.name === 'avatar'));
      const photos = [...allPhotos, ...get(relatedAlbum, 'items', [])];
      const avatar = getObjectAvatar(currentWobj);

      setPictures(photos);
      setCurrentImage(isEmpty(avatar) ? photos[0] : { body: avatar });
      setPhotoIndex(0);
    });
  }, [authorPermlink, currentWobj.author_permlink]);

  useEffect(() => {
    if (photoIndex === 0) {
      setNextArrowClicked(false);
    }
  }, [photoIndex]);

  const carouselSettings = pics => {
    const slidesToShow = pics.length > limitToShow ? limitToShow : pics.length;
    const showLeftArrow = photoIndex >= 0 && !nextArrowClicked;

    return {
      dots: false,
      arrows: !isMobile(),
      lazyLoad: true,
      rows: 1,
      nextArrow: lastSlideToShow >= pics.length - 1 ? <></> : <Icon type="caret-right" />,
      prevArrow: showLeftArrow ? <></> : <Icon type="caret-left" />,
      infinite: false,
      slidesToShow,
      swipeToSlide: isMobile(),
      slidesToScroll: 1,
      beforeChange: onSlideChange,
    };
  };
  const mobileSlider = {
    dots: false,
    arrows: false,
    lazyLoad: true,
    rows: 1,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: MobileSlideChange,
  };

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
      {!isMobile() ? (
        <div>
          <img
            className="PicturesSlider__previewImage"
            src={getProxyImageURL(currentSrc)}
            alt={'pic'}
            onClick={() => setIsOpen(true)}
          />
        </div>
      ) : (
        <div className={'MobileCarousel'}>
          <Carousel ref={slider} {...mobileSlider}>
            {map(pictures, pic => (
              <div key={pic.id}>
                <img
                  className="PicturesSlider__previewImage"
                  src={getProxyImageURL(pic.body)}
                  alt={'pic'}
                  onClick={() => setIsOpen(true)}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}
      <br />
      <Carousel {...carouselSettings(pictures)}>
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
                  ? 'PicturesSlider__thumbnail--active'
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
          nextSrc={
            pictures.length <= 1 || photoIndex === pictures.length - 1
              ? null
              : pictures[(photoIndex + 1) % pictures.length]?.body
          }
          prevSrc={pictures.length <= 1 ? null : pictures[(photoIndex - 1) % pictures.length]?.body}
          onCloseRequest={onClosePicture}
          onMovePrevRequest={() => setPhotoIndex((photoIndex - 1) % pictures.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % pictures.length)}
        />
      )}
    </div>
  ) : null;
};

PicturesSlider.propTypes = {
  currentWobj: PropTypes.shape(),
  hoveredOption: PropTypes.shape(),
  activeOption: PropTypes.shape(),
  activeCategory: PropTypes.string,
};

export default PicturesSlider;
