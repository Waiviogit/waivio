import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { map, isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveFilters } from '../../reducers';
import { updateActiveFilters } from '../helper';
import { setFiltersAndLoad } from '../../objectTypes/objectTypeActions';
import FilterItem from './FilterItem';

const FiltersContainer = ({ filters, tagsFilters }) => {
  const dispatch = useDispatch();
  const activeFilters = useSelector(getActiveFilters);
  const [collapsedFilters, setCollapsed] = useState([]);

  const handleDisplayFilter = filterName => () => {
    if (collapsedFilters.includes(filterName)) {
      setCollapsed(collapsedFilters.filter(f => f !== filterName));
    } else {
      setCollapsed([...collapsedFilters, filterName]);
    }
  };

  const handleOnChangeCheckbox = (e, tag = false) => {
    const { name: filterValue, value: filter, checked } = e.target;
    const updatedFilters = updateActiveFilters(activeFilters, filter, filterValue, checked);
    if (tag) {
      console.log('bla');
    } else {
      dispatch(setFiltersAndLoad(updatedFilters));
    }
  };

  const isCollapsed = name => collapsedFilters.includes(name);

  return (
    <div className="SidebarContentBlock__content">
      <div className="collapsible-block">
        {!isEmpty(filters) &&
          map(filters, (filterValues, filterName) => (
            <FilterItem
              isCollapsed={isCollapsed(filterName)}
              filterName={filterName}
              handleDisplayFilter={handleDisplayFilter}
              handleOnChangeCheckbox={handleOnChangeCheckbox}
              activeFilters={activeFilters}
              filterValues={filterValues}
            />
          ))}
        {!isEmpty(tagsFilters) &&
          tagsFilters.map(filterValues => (
            <FilterItem
              key={filterValues.tagCategory}
              isCollapsed={isCollapsed(filterValues.tagCategory)}
              filterName={filterValues.tagCategory}
              handleDisplayFilter={handleDisplayFilter}
              handleOnChangeCheckbox={e => handleOnChangeCheckbox(e, true)}
              activeFilters={activeFilters}
              filterValues={filterValues.tags}
            />
          ))}
      </div>
    </div>
  );
};

FiltersContainer.propTypes = {
  filters: PropTypes.shape().isRequired,
  tagsFilters: PropTypes.arrayOf(PropTypes.shape()),
};

FiltersContainer.defaultProps = {
  tagsFilters: [],
};

export default FiltersContainer;
