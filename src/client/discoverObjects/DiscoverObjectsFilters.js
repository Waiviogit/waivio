import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Checkbox } from 'antd';
import { get, isEmpty, map, uniq } from 'lodash';
import { getAvailableFilters, getActiveFilters, getUserLocation } from '../reducers';
import { setActiveFilters } from '../objectTypes/objectTypeActions';
import { getCoordinates } from '../user/userActions';
import MapWrap from '../components/Maps/MapWrap/MapWrap';
import '../components/Sidebar/SidebarContentBlock.less';

const DiscoverObjectsFilters = ({ intl, match }) => {
  // redux-store
  const dispatch = useDispatch();
  const userLocation = useSelector(getUserLocation);
  const filters = useSelector(getAvailableFilters);
  const activeFilters = useSelector(getActiveFilters);
  // state
  const [collapsedFilters, setCollapsed] = useState([]);

  const handleDisplayFilter = filterName => () => {
    if (collapsedFilters.includes(filterName)) {
      setCollapsed(collapsedFilters.filter(f => f !== filterName));
    } else {
      setCollapsed([...collapsedFilters, filterName]);
    }
  };

  if (isEmpty(userLocation)) {
    dispatch(getCoordinates());
  }

  const handleOnChangeCheckbox = e => {
    const { name: filterItem, value: filterName, checked } = e.target;
    const updatedFilters = {
      ...activeFilters,
      [filterName]: checked
        ? uniq([...activeFilters[filterName], filterItem])
        : activeFilters[filterName].filter(f => f !== filterItem),
    };
    dispatch(setActiveFilters(updatedFilters));
  };

  const hasFilters = !['hashtag', 'list', 'page'].some(type => type === match.params.objectType);
  return hasFilters ? (
    <div className="discover-objects-filters">
      <MapWrap
        wobjects={[]}
        onMarkerClick={() => {}}
        getAreaSearchData={() => {}}
        userLocation={userLocation}
      />
      <div className="SidebarContentBlock">
        <div className="SidebarContentBlock__title">
          <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
          <FormattedMessage id="filters" defaultMessage="Filter" />
        </div>
        <div className="SidebarContentBlock__content">
          <div className="sidebar-search-filters">
            {map(filters, (filterValues, filterName) => {
              const isCollapsed = collapsedFilters.includes(filterName);
              return (
                <div key={filterName} className="sidebar-search-filters__container">
                  <div
                    className="sidebar-search-filters__title"
                    role="presentation"
                    onClick={handleDisplayFilter(filterName)}
                  >
                    <span>
                      {intl.formatMessage({ id: filterName, defaultMessage: filterName })}
                    </span>
                    <span className="sidebar-search-filters__title__icon">
                      {isCollapsed ? (
                        <i className="iconfont icon-addition" />
                      ) : (
                        <i className="iconfont icon-offline" />
                      )}
                    </span>
                  </div>
                  {!isCollapsed ? (
                    <div className="sidebar-search-filters__content">
                      {filterValues.map(value => {
                        const isChecked = get(activeFilters, [filterName], []).some(
                          active => active === value,
                        );
                        return (
                          <div key={filterName + value} className="sidebar-search-filters__item">
                            <Checkbox
                              name={value}
                              value={filterName}
                              onChange={handleOnChangeCheckbox}
                              checked={isChecked}
                            >
                              <span className="sidebar-search-filters__item__label ttc">
                                {intl.formatMessage({ id: value, defaultMessage: value })}
                              </span>
                            </Checkbox>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

DiscoverObjectsFilters.propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default injectIntl(DiscoverObjectsFilters);
