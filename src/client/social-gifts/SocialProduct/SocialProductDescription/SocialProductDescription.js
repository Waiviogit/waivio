import React, { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import PropTypes from 'prop-types';
import './SocialProductDescription.less';

const SocialProductDescription = ({ description, pictures, authorPermlink }) => {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [dividedParagraphs, setDividedParagraphs] = useState([]);
  const photos = pictures?.length > 15 ? pictures.slice(0, 15) : pictures;

  const onPicClick = (e, pic) => {
    setOpen(true);
    setPhotoIndex(photos.indexOf(pic));
  };

  useEffect(() => {
    const paragraphs = description && description.split('\n\n');
    const newParagraphs = paragraphs?.reduce((acc, paragraph, index) => {
      if (index % 2 === 0) {
        const paragraph1 = paragraph;
        const paragraph2 = paragraphs[index + 1];
        const combinedParagraphs = [paragraph1, paragraph2].filter(Boolean).join('\n\n');

        acc.push(combinedParagraphs);
      }

      return acc;
    }, []);

    setDividedParagraphs(newParagraphs);
  }, [authorPermlink]);

  const renderedParagraphs = dividedParagraphs?.map((paragraph, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <div key={index} className="SocialProductDescription__paragraph-container">
      <p
        className={
          photos && index < photos.length
            ? 'SocialProductDescription__paragraph'
            : 'SocialProductDescription__paragraph--only'
        }
      >
        {paragraph}
      </p>
      {photos && index < photos.length && (
        <div key={photos[index].body}>
          <img
            className="SocialProductDescription__image"
            onClick={e => onPicClick(e, photos[index])}
            src={photos[index]?.body}
            alt=" "
          />
        </div>
      )}
    </div>
  ));
  const remainingPictures = photos
    ?.slice(dividedParagraphs?.length)
    ?.map(picture => (
      <img
        className="SocialProductDescription__image"
        onClick={e => onPicClick(e, picture)}
        key={picture.body}
        src={picture.body}
        alt=""
      />
    ));

  return (
    <div className="SocialProduct__contentPaddingLeft SocialProduct__description">
      {renderedParagraphs}
      <div className={'SocialProductDescription__images-container'}>{remainingPictures}</div>
      {open && (
        <Lightbox
          wrapperClassName="LightboxTools"
          mainSrc={photos[photoIndex]?.body}
          nextSrc={
            photos.length <= 1 || photoIndex === photos.length - 1
              ? null
              : photos[(photoIndex + 1) % photos.length]?.body
          }
          prevSrc={photos.length <= 1 ? null : photos[(photoIndex - 1) % photos.length]?.body}
          onCloseRequest={() => setOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex - 1) % photos.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % photos.length)}
        />
      )}
    </div>
  );
};

SocialProductDescription.propTypes = {
  description: PropTypes.string,
  authorPermlink: PropTypes.string,
  pictures: PropTypes.arrayOf(),
};
export default SocialProductDescription;
