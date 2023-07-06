import React, { useEffect, useRef, useState } from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { Carousel, Icon } from 'antd';
import Lightbox from 'react-image-lightbox';
import './PicturesCarousel.less';
import LightboxHeader from '../widgets/LightboxTools/LightboxHeader';
import LightboxFooter from '../widgets/LightboxTools/LightboxFooter';

const PicturesCarousel = ({ activePicture, pics, objName, albums, isSocialProduct }) => {
  const settings = {
    dots: false,
    arrows: true,
    lazyLoad: true,
    slidesToShow: 1,
    nextArrow: <Icon type="right" style={{ fontSize: '20px' }} />,
    prevArrow: <Icon type="left" style={{ fontSize: '20px' }} />,
  };
  const slider = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    slider.current.goTo(0);
  }, [activePicture]);

  const onImgClick = (e, img) => {
    setIsOpen(true);
    setPhotoIndex(pics.indexOf(img));
  };

  const album = albums?.find(alb => alb?.items?.some(pic => pic.body === pics[photoIndex]?.body));

  return pics ? (
    <div className={isSocialProduct ? 'SocialPicturesCarousel' : 'PicturesCarousel'}>
      <Carousel {...settings} ref={slider} afterChange={i => setPhotoIndex(i)}>
        {map(pics, pic => (
          <div
            key={pic.id}
            className={
              isSocialProduct ? 'SocialPicturesCarousel__imageWrap' : 'PicturesCarousel__imageWrap'
            }
          >
            <img
              onClick={e => onImgClick(e, pic)}
              src={pic.body}
              alt="pic"
              className={
                isSocialProduct ? 'SocialPicturesCarousel__image' : 'PicturesCarousel__image'
              }
            />
          </div>
        ))}
      </Carousel>
      {isOpen && (
        <Lightbox
          wrapperClassName="LightboxTools"
          imageTitle={
            <LightboxHeader
              objName={objName}
              albumName={album?.body}
              userName={pics[photoIndex].creator}
            />
          }
          imageCaption={<LightboxFooter post={pics[photoIndex]} />}
          mainSrc={pics[photoIndex]?.body}
          nextSrc={
            pics.length <= 1 || photoIndex === pics.length - 1
              ? null
              : pics[(photoIndex + 1) % pics.length]?.body
          }
          prevSrc={pics.length <= 1 ? null : pics[(photoIndex - 1) % pics.length]?.body}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex - 1) % pics.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % pics.length)}
        />
      )}
    </div>
  ) : (
    <div />
  );
};

PicturesCarousel.propTypes = {
  pics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  objName: PropTypes.string,
  activePicture: PropTypes.shape(),
  isOptionsType: PropTypes.bool,
  isSocialProduct: PropTypes.bool,
  onOptionPicClick: PropTypes.func,
};
PicturesCarousel.defaultProps = {
  activePicture: {},
  isOptionsType: false,
  onOptionPicClick: () => {},
};

export default PicturesCarousel;
