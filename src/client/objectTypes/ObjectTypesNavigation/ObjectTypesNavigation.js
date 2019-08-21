import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { getCurrentLocation, getObjectTypesList, getObjectTypesLoading } from '../../reducers';
import SkeletonCustom from '../../components/Skeleton/SkeletonCustom';
import './ObjectTypesNavigation.less';

const ObjectTypesNavigation = () => {
  const { pathname } = useSelector(getCurrentLocation);
  const isLoading = useSelector(getObjectTypesLoading);
  const objectTypes = useSelector(getObjectTypesList, shallowEqual);
  return (
    <ul className="ObjectTypesNavigation Sidenav">
      <div className="Sidenav__section-title">
        <FormattedMessage id="objects" defaultMessage="Objects" />:
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
              isActive={() => pathname.includes(type.name)}
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
};

export default ObjectTypesNavigation;
