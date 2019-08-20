import React, { useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { size } from 'lodash';
import { getCurrentLocation, getObjectTypesList, getObjectTypesLoading } from '../reducers';
import SkeletonCustom from '../components/Skeleton/SkeletonCustom';

const typesLimit = 9;
const SidenavDiscoverObjects = () => {
  // redux-store
  const { pathname } = useSelector(getCurrentLocation);
  const isLoading = useSelector(getObjectTypesLoading);
  const objectTypes = useSelector(getObjectTypesList, shallowEqual);
  // state
  const [displayedTypesCount, setTypesCount] = useState(typesLimit);
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
        <React.Fragment>
          {Object.values(objectTypes)
            .slice(0, displayedTypesCount)
            .map(type => (
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
            ))}
          {displayedTypesCount < size(objectTypes) ? (
            <div
              className="sidenav-discover-objects__show-more"
              role="presentation"
              onClick={() => setTypesCount(displayedTypesCount + typesLimit)}
            >
              <FormattedMessage id="show_more" defaultMessage="show more" />
            </div>
          ) : null}
        </React.Fragment>
      )}
    </ul>
  );
};

export default SidenavDiscoverObjects;
