import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { getObject } from '../../../waivioApi/ApiClient';
import { isMobile } from '../../../common/helpers/apiHelpers';
import LightboxFooter from '../../widgets/LightboxTools/LightboxFooter';
import LightboxHeader from '../../widgets/LightboxTools/LightboxHeader';
import { getObjectAlbums, getRelatedPhotos } from '../../../store/galleryStore/gallerySelectors';
import './DescriptionPage.less';

const DescriptionPage = ({ match }) => {
  const [wobject, setWobject] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const wobjName = match.params.name;
  const description = wobject?.description;
  const relatedAlbum = useSelector(getRelatedPhotos);
  const albums = useSelector(getObjectAlbums);
  const pics = [...get(wobject, 'preview_gallery', [])].sort(
    (a, b) => (a.name === 'avatar') - (b.name === 'avatar'),
  );
  const pictures = pics.length > 15 ? pics.slice(0, 15) : pics;
  const album = [...albums, relatedAlbum]?.find(alb =>
    alb?.items?.some(pic => pic.body === pics[photoIndex]?.body),
  );

  useEffect(() => {
    const objectHeaderEl = document.getElementById('ObjectHeaderId');

    if (isMobile()) {
      window.scrollTo({
        top: objectHeaderEl?.offsetHeight,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, 0);
    }

    getObject(wobjName).then(res => setWobject(res));
  }, [wobjName]);

  const onPicClick = (e, pic) => {
    setIsOpen(true);
    setPhotoIndex(pics.indexOf(pic));
  };

  const paragraphs = description && description.split('\n\n');

  const renderedParagraphs = paragraphs?.map((paragraph, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <React.Fragment key={index}>
      <p>{paragraph}</p>
      {pictures && index < pictures.length && (
        <div key={pictures[index]} onClick={e => onPicClick(e, pictures[index])}>
          <img className="DescriptionPage__image" src={pictures[index]?.body} alt=" " />
        </div>
      )}
    </React.Fragment>
  ));

  const remainingPictures = pictures
    ?.slice(renderedParagraphs?.length)
    ?.map(picture => (
      <img
        className="DescriptionPage__image"
        key={picture.id}
        onClick={e => onPicClick(e, picture)}
        src={picture.body}
        alt=""
      />
    ));

  return (
    <div className="DescriptionPage Body">
      <div className="DescriptionPage__body">
        {renderedParagraphs}
        {remainingPictures}
      </div>
      {isOpen && (
        <Lightbox
          wrapperClassName="LightboxTools"
          imageTitle={
            <LightboxHeader
              objName={wobject.name}
              albumName={album?.body}
              userName={pics[photoIndex].creator}
            />
          }
          imageCaption={<LightboxFooter post={pics[photoIndex]} />}
          mainSrc={pictures[photoIndex]?.body}
          nextSrc={
            pictures.length <= 1 || photoIndex === pictures.length - 1
              ? null
              : pictures[(photoIndex + 1) % pictures.length]?.body
          }
          prevSrc={pictures.length <= 1 ? null : pictures[(photoIndex - 1) % pictures.length]?.body}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex - 1) % pictures.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % pictures.length)}
        />
      )}
    </div>
  );
};

DescriptionPage.propTypes = {
  match: PropTypes.shape.isRequired,
};

export default DescriptionPage;
