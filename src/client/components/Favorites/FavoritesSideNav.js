import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { injectIntl } from 'react-intl';
import SkeletonCustom from '../Skeleton/SkeletonCustom';
import listOfObjectTypes from '../../../common/constants/listOfObjectTypes';
import {
  getFavoriteObjectTypes,
  getLoadingFavoriteObjectTypes,
} from '../../../store/favoritesStore/favoritesSelectors';
import { setFavoriteObjectTypes } from '../../../store/favoritesStore/favoritesActions';

const FavoritesSideNav = ({ intl }) => {
  const [visible, setVisible] = useState(true);
  const objectTypes = useSelector(getFavoriteObjectTypes);
  const isLoading = useSelector(getLoadingFavoriteObjectTypes);
  const { objectType = objectTypes?.[0], name } = useParams();
  const dispatch = useDispatch();

  const toggleBlock = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (isEmpty(objectTypes)) dispatch(setFavoriteObjectTypes(name));
  }, [name]);

  return (
    !isEmpty(objectTypes) && (
      <React.Fragment>
        <div className={'collapsible-block SidebarContentBlock__content mb4'}>
          <div className="collapsible-block__title" role="presentation" onClick={toggleBlock}>
            <span className="collapsible-block__title-text">Objects:</span>
            <span className="collapsible-block__title-icon">
              {visible ? (
                <i className="iconfont icon-offline" />
              ) : (
                <i className="iconfont icon-addition" />
              )}
            </span>
          </div>
          {visible && (
            <ul className="sidenav-discover-objects Sidenav">
              {isLoading ? (
                <SkeletonCustom
                  className="sidenav-discover-objects__loading"
                  isLoading={isLoading}
                  randomWidth
                  rows={listOfObjectTypes.length + 1}
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
          )}
        </div>
      </React.Fragment>
    )
  );
};

FavoritesSideNav.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(FavoritesSideNav);
