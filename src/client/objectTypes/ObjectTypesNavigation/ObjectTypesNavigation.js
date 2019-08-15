import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { NavLink } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import SkeletonCustom from '../../components/Skeleton/SkeletonCustom';
import './ObjectTypesNavigation.less';

const ObjectTypesNavigation = ({ objectTypes, typeName, isLoading, intl }) => (
  <ul className="ObjectTypesNavigation Sidenav">
    <div className="Sidenav__section-title">
      {intl.formatMessage({
        id: 'objects',
        defaultMessage: `Objects`,
      })}
      :
    </div>
    {isLoading ? (
      <SkeletonCustom
        className="object-types-navigation-loader"
        isLoading={isLoading}
        randomWidth
        rows={9}
        width={170}
      />
    ) : (
      _.map(objectTypes, type => (
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
      ))
    )}
  </ul>
);

ObjectTypesNavigation.propTypes = {
  intl: PropTypes.shape().isRequired,
  objectTypes: PropTypes.shape().isRequired,
  typeName: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default injectIntl(ObjectTypesNavigation);
