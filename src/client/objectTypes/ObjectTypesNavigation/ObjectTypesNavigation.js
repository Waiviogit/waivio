import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './ObjectTypesNavigation.less';

const ObjectTypesNavigation = ({ objectTypes, typeName }) => (
  <ul className="ObjectTypesNavigation">
    {_.map(objectTypes, type => (
      <li key={`${type.name}key`}>
        <NavLink
          to={`/objectType/${type.name}`}
          isActive={() => typeName === type.name}
          className="ObjectTypesNavigation__item"
          activeClassName="ObjectTypesNavigation__item--active"
        >
          {type.name}
        </NavLink>
      </li>
    ))}
  </ul>
);

ObjectTypesNavigation.propTypes = {
  objectTypes: PropTypes.shape().isRequired,
  typeName: PropTypes.string.isRequired,
};

export default ObjectTypesNavigation;
