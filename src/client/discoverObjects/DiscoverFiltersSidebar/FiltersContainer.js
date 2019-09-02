import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get, map } from 'lodash';
import { Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveFilters } from '../../reducers';
import { updateActiveFilters } from '../helper';
import { setFiltersAndLoad } from '../../objectTypes/objectTypeActions';

const FiltersContainer = ({ intl, filters }) => {
  // redux-store
  const dispatch = useDispatch();
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

  const handleOnChangeCheckbox = e => {
    const { name: filterValue, value: filter, checked } = e.target;
    const updatedFilters = updateActiveFilters(activeFilters, filter, filterValue, checked);
    dispatch(setFiltersAndLoad(updatedFilters));
  };

  return (
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
                <span className="sidebar-search-filters__title-text">
                  {intl.formatMessage({ id: `filter-${filterName}`, defaultMessage: filterName })}
                </span>
                <span className="sidebar-search-filters__title-icon">
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
  );
};

FiltersContainer.propTypes = {
  intl: PropTypes.shape().isRequired,
  filters: PropTypes.shape().isRequired,
};

export default FiltersContainer;
