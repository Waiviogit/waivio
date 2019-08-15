import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { getCurrentLocation, getObjectTypesList, getObjectTypesLoading } from '../reducers';
import SkeletonCustom from '../components/Skeleton/SkeletonCustom';

const SidenavDiscoverObjects = () => {
  const { pathname } = useSelector(getCurrentLocation);
  const isLoading = useSelector(getObjectTypesLoading);
  const objectTypes = useSelector(getObjectTypesList, shallowEqual);
  return (
    <ul className="sidenav-discover-objects Sidenav">
      <div className="Sidenav__section-title">
        <FormattedMessage id="objects" defaultMessage="Objects" />:
      </div>
      {isLoading ? (
        <SkeletonCustom
          className="sidenav-discover-objects"
          isLoading={isLoading}
          randomWidth
          rows={9}
          width={170}
        />
      ) : (
        _.map(objectTypes, type => (
          <li key={`${type.author}/${type.permlink}`} className="ttc">
            <NavLink
              to={`/discover-objects/${type.name}`}
              isActive={() => pathname.includes(type.name)}
              className="sidenav-discover-objects__item"
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

export default SidenavDiscoverObjects;
