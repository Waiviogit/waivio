import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { isEmpty } from 'lodash';
import { useParams } from 'react-router';
import { connect } from 'react-redux';
import { getObject } from '../../../waivioApi/ApiClient';
import { isMobile } from '../../../common/helpers/apiHelpers';
import LightboxFooter from '../../widgets/LightboxTools/LightboxFooter';
import LightboxHeader from '../../widgets/LightboxTools/LightboxHeader';
import { getObjectAlbums, getRelatedPhotos } from '../../../store/galleryStore/gallerySelectors';
import './DescriptionPage.less';

const DescriptionPage = ({ relatedAlbum, albums }) => {
  const [wobject, setWobject] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { name } = useParams();
  const description = wobject?.description;
  const pics = !isEmpty(albums) ? albums?.find(alb => alb.body === 'Photos').items : [];
  const pictures = pics?.length > 15 ? pics.slice(0, 15) : pics;
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

    getObject(name).then(res => setWobject(res));
  }, [name]);

  const onPicClick = (e, pic) => {
    setIsOpen(true);
    setPhotoIndex(pics.indexOf(pic));
  };

  const paragraphs = description && description.split('\n\n');

  const renderedParagraphs = paragraphs?.map((paragraph, index) => (
    <React.Fragment key={paragraph}>
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
        key={picture.body}
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
  albums: PropTypes.arrayOf(),
  relatedAlbum: PropTypes.shape(),
};

const mapStateToProps = state => ({
  relatedAlbum: getRelatedPhotos(state),
  albums: getObjectAlbums(state),
});

export default connect(mapStateToProps)(DescriptionPage);
