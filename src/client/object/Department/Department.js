import React from 'react';
import PropTypes from 'prop-types';

import './Department.less';

const Department = ({ content }) => <div> {content}</div>;

Department.propTypes = {
  content: PropTypes.shape().isRequired,
};

export default Department;
