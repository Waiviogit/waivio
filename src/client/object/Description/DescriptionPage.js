import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { get, isEmpty } from 'lodash';
import { getObject } from '../../../waivioApi/ApiClient';
import './DescriptionPage.less';
import { isMobile } from '../../../common/helpers/apiHelpers';

const DescriptionPage = ({ match }) => {
  const [wobject, setWobject] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const wobjName = match.params.name;
  const description = wobject?.description;
  const pics = [...get(wobject, 'preview_gallery', [])];
  const pictures = pics.length > 15 ? pics.slice(0, 15) : pics;

  useEffect(() => {
    const objectHeaderEl = document.getElementById('ObjectHeaderId');

    if (isMobile()) {
      window.scrollTo({
        top: objectHeaderEl?.offsetHeight,
        behavior: 'smooth',
      });
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
