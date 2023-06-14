import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { get, isEmpty } from 'lodash';
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
  const pics = [...get(wobject, 'preview_gallery', [])];
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

    if (isEmpty(wobject)) getObject(wobjName).then(res => setWobject(res));
  }, [wobject.author_permlink]);

  const onPicClick = (e, pic) => {
    setIsOpen(true);
    setPhotoIndex(pics.indexOf(pic));
  };

  return (
    <div className="DescriptionPage Body">
      <div className="DescriptionPage__body">{description}</div>
      <div>
        {!isEmpty(pictures) &&
          pictures?.map(p => (
            <div key={p.id} onClick={e => onPicClick(e, p)}>
              <img className="DescriptionPage__image" src={p.body} alt=" " />
            </div>
          ))}
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
          nextSrc={pictures[(photoIndex + 1) % pictures.length]?.body}
          prevSrc={pictures[(photoIndex - 1) % pictures.length]?.body}
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
