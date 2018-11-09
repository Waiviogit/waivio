import React from 'react';
import PropTypes from 'prop-types';
import './ObjectField.less';

const ObjectField = ({ name }) => <div className="ObjectField">{name}</div>;

ObjectField.propTypes = {
  name: PropTypes.string,
};

ObjectField.defaultProps = {
  name: '',
};

export default ObjectField;
