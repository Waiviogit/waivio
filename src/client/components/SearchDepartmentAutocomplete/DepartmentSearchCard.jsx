import React from 'react';
import PropTypes from 'prop-types';

const DepartmentSearchCard = props => (
  <div className="object-search-card">
    <div className="object-search-card__content-info">
      <div className="object-search-card__content-name">{props.name}</div>
    </div>
  </div>
);

DepartmentSearchCard.propTypes = {
  name: PropTypes.string.isRequired,
};

export default DepartmentSearchCard;
