import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import LightboxHeader from './LightboxHeader';
import LightboxFooter from './LightboxFooter';

import AppendModal from '../../object/AppendModal/AppendModal';
import { getObjectName } from '../../../common/helpers/wObjectHelper';

const LightboxWithAppendForm = ({
  isPost,
  albums,
  wobject,
  album,
  pics,
  onCloseRequest,
  onMovePrevRequest,
  onMoveNextRequest,
  photoIndex,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [field, setField] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const currentSrc = pics[photoIndex]?.body;

  return showModal ? (
    <AppendModal
      selectedAlbum={selectedAlbum}
      hideModal={() => setShowModal(false)}
      fieldBodyContent={currentSrc}
      showModal={showModal}
      objName={getObjectName(wobject)}
      field={field}
    />
  ) : (
    <Lightbox
      wrapperClassName="LightboxTools"
      imageTitle={
        <LightboxHeader
          isPost={isPost}
          albums={albums}
          wobject={wobject}
          albumName={album?.body}
          userName={pics[photoIndex]?.creator}
          currentSrc={pics[photoIndex]?.body}
          setField={setField}
          setShowModal={setShowModal}
          setSelectedAlbum={setSelectedAlbum}
        />
      }
      imageCaption={!isPost && <LightboxFooter post={pics[photoIndex]} />}
      mainSrc={pics[photoIndex]?.body || pics[photoIndex]?.src}
      nextSrc={
        pics.length <= 1 || photoIndex === pics.length - 1
          ? null
          : pics[(photoIndex + 1) % pics.length]?.body
      }
      prevSrc={pics.length <= 1 ? null : pics[(photoIndex - 1) % pics.length]?.body}
      onCloseRequest={onCloseRequest}
      onMovePrevRequest={onMovePrevRequest}
      onMoveNextRequest={onMoveNextRequest}
    />
  );
};

LightboxWithAppendForm.propTypes = {
  albums: PropTypes.arrayOf(),
  pics: PropTypes.arrayOf(),
  wobject: PropTypes.shape(),
  album: PropTypes.shape(),
  photoIndex: PropTypes.number,
  onMovePrevRequest: PropTypes.func,
  isPost: PropTypes.bool,
  onMoveNextRequest: PropTypes.func,
  onCloseRequest: PropTypes.func,
};

export default LightboxWithAppendForm;
