import React from 'react';
import PropTypes from 'prop-types';
import ObjectInfo from './ObjectInfo';

const LeftObjectProfileSidebar = ({ isEditMode, wobject, userName, history, appendAlbum }) => (
  <ObjectInfo
    isEditMode={isEditMode}
    wobject={wobject}
    userName={userName}
    history={history}
    appendAlbum={appendAlbum}
  />
);

LeftObjectProfileSidebar.propTypes = {
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool,
  history: PropTypes.shape().isRequired,
  appendAlbum: PropTypes.func.isRequired,
};

LeftObjectProfileSidebar.defaultProps = {
  isEditMode: false,
};

export default LeftObjectProfileSidebar;
