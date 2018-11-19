import React from 'react';
import PropTypes from 'prop-types';

import ObjectInfo from './ObjectInfo';

const LeftObjectProfileSidebar = ({ wobject }) => (
  <div>
    <ObjectInfo wobject={wobject} />
  </div>
);

LeftObjectProfileSidebar.propTypes = {
  wobject: PropTypes.shape().isRequired,
};

export default LeftObjectProfileSidebar;
