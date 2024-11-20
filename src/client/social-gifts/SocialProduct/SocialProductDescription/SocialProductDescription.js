import React, { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import PropTypes from 'prop-types';
import './SocialProductDescription.less';

const SocialProductDescription = ({ description, pictures, authorPermlink }) => {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [dividedParagraphs, setDividedParagraphs] = useState(description?.split('\n\n'));
  const photosToSort = pictures?.length > 15 ? pictures.slice(0, 15) : pictures;
  const photos = photosToSort?.sort((a, b) => b.weight - a.weight);

  const onPicClick = (e, pic) => {
    setOpen(true);
    setPhotoIndex(photos.indexOf(pic));
  };

  useEffect(() => {
    const newarr = [];
    const newParagraphs = dividedParagraphs.reduce((acc, paragraph, index) => {
      const prevParagraph = acc[acc.length - 1];

      if (prevParagraph && prevParagraph.includes(paragraph)) {
        return acc;
      }
      if (paragraph.length > 290) {
        newarr.push(paragraph);
      } else {
        const nextParagraph = dividedParagraphs[index + 1] || '';

        newarr.push(`${paragraph}\n\n${nextParagraph}`);
      }

      return newarr;
    }, []);

    setDividedParagraphs(newParagraphs);
  }, [authorPermlink]);

  const renderedParagraphs = dividedParagraphs?.map((paragraph, index) => {
    const isOnlyParagraph = photos && index + 1 > photos.length;

    return (
      <div
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        className={
          isOnlyParagraph
            ? 'SocialProductDescription__paragraph-only-container'
            : 'SocialProductDescription__paragraph-container'
        }
      >
        <p
          className={
            isOnlyParagraph
              ? 'SocialProductDescription__paragraph--only'
              : 'SocialProductDescription__paragraph'
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
              alt={paragraph}
            />
          </div>
        )}
      </div>
    );
  });

  const renderOnePictureParagraph = () => (
    <div className={'SocialProductDescription__single-paragraph-container'}>
      <section className={'SocialProductDescription__single-paragraph'}>
        {photos && (
          <div>
            <img
              className="SocialProductDescription__single-image"
              onClick={e => onPicClick(e, photos[0])}
              src={photos[0]?.body}
              alt={description}
            />
          </div>
        )}
        {description}
      </section>
    </div>
  );
  // const remainingPictures = photos
  //   ?.slice(dividedParagraphs?.length)
  //   ?.map(picture => (
  //     <img
  //       className="SocialProductDescription__image"
  //       onClick={e => onPicClick(e, picture)}
  //       key={picture.body}
  //       src={picture.body}
  //       alt=""
  //     />
  //   ));

  return (
    <div className="SocialProduct__contentPaddingLeft SocialProduct__description">
      {pictures?.length === 1 ? renderOnePictureParagraph() : renderedParagraphs}
      {/* <div className={'SocialProductDescription__images-container'}>{remainingPictures}</div> */}
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
