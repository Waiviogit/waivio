import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { map, isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveFilters } from '../../reducers';
import {parseUrl, updateActiveFilters} from '../helper';
import { setFiltersAndLoad } from '../../objectTypes/objectTypeActions';
import FilterItem from './FilterItem';

const FiltersContainer = ({ filters, tagsFilters, filterPath }) => {
  const dispatch = useDispatch();
  const activeFilters = useSelector(getActiveFilters);
  const [collapsedFilters, setCollapsed] = useState([]);
  const [activeTagsFilters, setActiveTagsFilters] = useState({});

  useEffect(() => {
    if(filterPath) setActiveTagsFilters(parseUrl(filterPath));
  }, [])

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

  const handleOnChangeTagsCheckbox = e => {
    const { name: filterValue, value: filter, checked } = e.target;
    console.log(filterValue);
    console.log(filter);
    // dispatch(setFiltersAndLoad(updatedFilters));
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
              handleOnChangeCheckbox={handleOnChangeTagsCheckbox}
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
  filterPath: PropTypes.string,
};

FiltersContainer.defaultProps = {
  tagsFilters: [],
  filterPath: '',
};

export default FiltersContainer;
