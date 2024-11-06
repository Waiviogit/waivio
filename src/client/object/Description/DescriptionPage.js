import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useParams } from 'react-router';
import { connect } from 'react-redux';
import { getObject } from '../../../waivioApi/ApiClient';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { getObjectAlbums, getRelatedPhotos } from '../../../store/galleryStore/gallerySelectors';
import './DescriptionPage.less';
import LightboxWithAppendForm from '../../widgets/LightboxTools/LightboxWithAppendForm';

const DescriptionPage = ({ relatedAlbum, albums }) => {
  const [wobject, setWobject] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { name } = useParams();
  const description = wobject?.description;
  const allPhotos = albums
    ?.flatMap(alb => alb?.items)
    ?.sort((a, b) => (a.name === 'avatar') - (b.name === 'avatar'));
  const pics = [...allPhotos, ...get(relatedAlbum, 'items', [])];
  const picturesToSort = pics?.length > 15 ? pics.slice(0, 15) : pics;
  const pictures = picturesToSort?.sort((a, b) => b.weight - a.weight);
  const album = [...albums, relatedAlbum]?.find(alb =>
    alb?.items?.some(pic => pic.body === pics[photoIndex]?.body),
  );

  useEffect(() => {
    const objectHeaderEl = document && document.getElementById('ObjectHeaderId');

    if (isMobile()) {
      if (typeof window !== 'undefined')
        window.scrollTo({
          top: objectHeaderEl?.offsetHeight,
          behavior: 'smooth',
        });
    } else if (typeof window !== 'undefined') window.scrollTo(0, 0);

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
        <LightboxWithAppendForm
          wobject={wobject}
          album={album}
          albums={albums}
          pics={pictures}
          photoIndex={photoIndex}
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
