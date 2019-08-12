import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './ObjectTypesNavigation.less';

const ObjectTypesNavigation = ({ objectTypes, typeName, intl }) => (
  <ul className="ObjectTypesNavigation Sidenav">
    <div className="Sidenav__section-title">
      {intl.formatMessage({
        id: 'objects',
        defaultMessage: `Objects`,
      })}
      :
    </div>
    {_.map(objectTypes, type => (
      <li key={`${type.name}key`} className="ttc">
        <NavLink
          to={`/objectType/${type.name}`}
          isActive={() => typeName === type.name}
          className="ObjectTypesNavigation__item"
          activeClassName="Sidenav__item--active"
        >
          {type.name}
        </NavLink>
      </li>
    ))}
  </ul>
);

ObjectTypesNavigation.propTypes = {
  objectTypes: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  typeName: PropTypes.string.isRequired,
};

export default injectIntl(ObjectTypesNavigation);
