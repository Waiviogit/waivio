import React from 'react';
import PropTypes from 'prop-types';
import ObjectInfo from './ObjectInfo';

const LeftObjectProfileSidebar = ({ wobject }) => <ObjectInfo wobject={wobject} />;

LeftObjectProfileSidebar.propTypes = {
  wobject: PropTypes.shape().isRequired,
};

export default LeftObjectProfileSidebar;
