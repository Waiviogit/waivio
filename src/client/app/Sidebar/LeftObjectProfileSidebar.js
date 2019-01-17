import React from 'react';
import PropTypes from 'prop-types';
import ObjectInfo from './ObjectInfo';

const LeftObjectProfileSidebar = ({ wobject, userName }) => (
  <ObjectInfo wobject={wobject} userName={userName} />
);

LeftObjectProfileSidebar.propTypes = {
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
};

export default LeftObjectProfileSidebar;
