import React, { useEffect, useRef, useState } from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { Carousel, Icon } from 'antd';
import Lightbox from 'react-image-lightbox';
import './PicturesCarousel.less';
import LightboxHeader from '../widgets/LightboxTools/LightboxHeader';
import LightboxFooter from '../widgets/LightboxTools/LightboxFooter';

const PicturesCarousel = ({ activePicture, pics, objName, albums }) => {
  const settings = {
    dots: false,
    arrows: true,
    lazyLoad: true,
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
    <div className="PicturesCarousel">
      <Carousel {...settings} ref={slider} afterChange={i => setPhotoIndex(i)}>
        {map(pics, pic => (
          <div key={pic.id} className="PicturesCarousel__imageWrap">
            <img
              onClick={e => onImgClick(e, pic)}
              src={pic.body}
              alt="pic"
              className="PicturesCarousel__image"
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
              albumName={album.body}
              userName={pics[photoIndex].creator}
            />
          }
          imageCaption={<LightboxFooter post={pics[photoIndex]} />}
          mainSrc={pics[photoIndex]?.body}
          nextSrc={pics[(photoIndex + 1) % pics.length]?.body}
          prevSrc={pics[(photoIndex - 1) % pics.length]?.body}
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
  objectID: PropTypes.string.isRequired,
  objName: PropTypes.string,
  activePicture: PropTypes.shape(),
  isOptionsType: PropTypes.bool,
  onOptionPicClick: PropTypes.func,
};
PicturesCarousel.defaultProps = {
  activePicture: {},
  isOptionsType: false,
  onOptionPicClick: () => {},
};

export default PicturesCarousel;
