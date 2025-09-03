import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import LightboxHeader from './LightboxHeader';
import LightboxFooter from './LightboxFooter';

import AppendModal from '../../object/AppendModal/AppendModal';
import { getObjectName } from '../../../common/helpers/wObjectHelper';

const LightboxWithAppendForm = ({
  wobject,
  pics,
  onCloseRequest,
  onMovePrevRequest,
  onMoveNextRequest,
  photoIndex,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [obj, setObj] = useState(wobject || {});
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
          obj={obj}
          setObj={setObj}
          objs={[wobject]}
          userName={pics[photoIndex]?.creator}
          currentSrc={pics[photoIndex]?.body}
          setField={setField}
          setShowModal={setShowModal}
          setSelectedAlbum={setSelectedAlbum}
        />
      }
      imageCaption={<LightboxFooter post={pics[photoIndex]} selectedAlbum={selectedAlbum} />}
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
  pics: PropTypes.arrayOf(PropTypes.shape()),
  wobject: PropTypes.shape(),
  photoIndex: PropTypes.number,
  onMovePrevRequest: PropTypes.func,
  onMoveNextRequest: PropTypes.func,
  onCloseRequest: PropTypes.func,
};

LightboxWithAppendForm.defaultProps = {
  albums: [],
  pics: [],
  wobject: {},
  album: {},
  photoIndex: 0,
  onMovePrevRequest: () => {},
  isPost: false,
  onMoveNextRequest: () => {},
  onCloseRequest: () => {},
};

export default LightboxWithAppendForm;
