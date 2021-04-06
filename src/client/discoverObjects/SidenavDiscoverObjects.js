import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { size, ceil } from 'lodash';
import { getCurrentLocation, getObjectTypesList, getObjectTypesLoading } from '../store/reducers';
import SkeletonCustom from '../components/Skeleton/SkeletonCustom';
import { PATH_NAME_DISCOVER } from '../../common/constants/rewards';

const typesLimit = 5;
const SidenavDiscoverObjects = ({ withTitle, intl }) => {
  // redux-store
  const { pathname } = useSelector(getCurrentLocation);
  const isLoading = useSelector(getObjectTypesLoading);
  const objectTypes = useSelector(getObjectTypesList, shallowEqual);
  // state
  const [displayedTypesCount, setTypesCount] = useState();
  const [menuCondition, setMenuCondition] = useState({
    objects: true,
    users: true,
  });

  useEffect(() => {
    const typesCount = Object.values(objectTypes).findIndex(obj => pathname.includes(obj.name)) + 1;

    if (typesCount > typesLimit) {
      const count = ceil(typesCount / 5) * 5;

      setTypesCount(count);
    } else {
      setTypesCount(typesLimit);
    }
  }, [pathname]);

  const toggleMenuCondition = menuItem => {
    setMenuCondition({
      ...menuCondition,
      [menuItem]: !menuCondition[menuItem],
    });
  };

  return (
    <React.Fragment>
      <ul className="sidenav-discover-objects Sidenav">
        {withTitle && (
          <div
            className="Sidenav__title-wrap"
            onClick={() => toggleMenuCondition('objects')}
            role="presentation"
          >
            <div className="Sidenav__title-item">
              {intl.formatMessage({
                id: 'objects',
                defaultMessage: 'Objects',
              })}
              :
            </div>
            <div className="Sidenav__title-icon">
              {!menuCondition.objects ? (
                <i className="iconfont icon-addition" />
              ) : (
                <i className="iconfont icon-offline" />
              )}
            </div>
          </div>
        )}
        {isLoading ? (
          <SkeletonCustom
            className="sidenav-discover-objects__loading"
            isLoading={isLoading}
            randomWidth
            rows={typesLimit + 1}
            width={170}
          />
        ) : (
          menuCondition.objects && (
            <React.Fragment>
              <li key="all-types" className="ttc">
                <NavLink
                  to={`/discover-objects`}
                  isActive={() => pathname === '/discover-objects'}
                  className="sidenav-discover-objects__item"
                  activeClassName="Sidenav__item--active"
                >
                  <FormattedMessage id="all" defaultMessage="All" />
                </NavLink>
              </li>
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
          )
        )}
      </ul>
      <ul className="sidenav-discover-objects Sidenav mt3">
        {withTitle && (
          <div
            className="Sidenav__title-wrap"
            onClick={() => toggleMenuCondition('users')}
            role="presentation"
          >
            <div className="Sidenav__title-item">
              {intl.formatMessage({
                id: 'users',
                defaultMessage: 'Users',
              })}
              :
            </div>
            <div className="Sidenav__title-icon">
              {!menuCondition.users ? (
                <i className="iconfont icon-addition" />
              ) : (
                <i className="iconfont icon-offline" />
              )}
            </div>
          </div>
        )}
        {isLoading ? (
          <SkeletonCustom
            className="sidenav-discover-objects__loading"
            isLoading={isLoading}
            randomWidth
            rows={typesLimit + 1}
            width={170}
          />
        ) : (
          menuCondition.users && (
            <React.Fragment>
              <li key="all-types" className="ttc">
                <NavLink
                  to={`/discover`}
                  isActive={() =>
                    pathname === PATH_NAME_DISCOVER || pathname.includes('/discover/')
                  }
                  className="sidenav-discover-objects__item"
                  activeClassName="Sidenav__item--active"
                >
                  <FormattedMessage id="all" defaultMessage="All" />
                </NavLink>
              </li>
            </React.Fragment>
          )
        )}
      </ul>
    </React.Fragment>
  );
};

SidenavDiscoverObjects.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  withTitle: PropTypes.bool,
};
SidenavDiscoverObjects.defaultProps = {
  withTitle: true,
};

export default injectIntl(SidenavDiscoverObjects);
