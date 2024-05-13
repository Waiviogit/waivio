import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { injectIntl } from 'react-intl';
import SkeletonCustom from '../Skeleton/SkeletonCustom';
import {
  getFavoriteObjectTypes,
  getLoadingFavoriteObjectTypes,
} from '../../../store/favoritesStore/favoritesSelectors';
import { setFavoriteObjectTypes } from '../../../store/favoritesStore/favoritesActions';
import listOfObjectTypes from '../../../common/constants/listOfObjectTypes';

const typesLimit = listOfObjectTypes.length;
const FavoritesSideNav = ({ intl }) => {
  const objectTypes = useSelector(getFavoriteObjectTypes);
  const isLoading = useSelector(getLoadingFavoriteObjectTypes);
  const { objectType = objectTypes?.[0], name } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(objectTypes)) dispatch(setFavoriteObjectTypes(name));
  }, [name]);

  return (
    !isEmpty(objectTypes) && (
      <React.Fragment>
        <div className={'collapsible-block SidebarContentBlock__content mb4'}>
          <div>
            <span className="ShopDepartmentsList__maindepName fw5">
              {intl.formatMessage({
                id: 'favorites',
                defaultMessage: 'Favorites',
              })}
              :
            </span>
          </div>
          {
            <ul className="sidenav-discover-objects Sidenav">
              {isLoading ? (
                <SkeletonCustom
                  className="sidenav-discover-objects__loading"
                  isLoading={isLoading}
                  randomWidth
                  rows={typesLimit.length + 1}
                  width={170}
                />
              ) : (
                <React.Fragment>
                  {objectTypes?.map(type => (
                    <li key={`${type}`} className="ttc">
                      <NavLink
                        to={`/@${name}/favorites/${type}`}
                        isActive={() => objectType === type}
                        className="sidenav-discover-objects__item"
                        activeClassName="Sidenav__item--active"
                      >
                        {intl.formatMessage({
                          id: `object_type_${type}`,
                          defaultMessage: type,
                        })}
                      </NavLink>
                    </li>
                  ))}
                </React.Fragment>
              )}
            </ul>
          }
        </div>
      </React.Fragment>
    )
  );
};

FavoritesSideNav.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(FavoritesSideNav);
