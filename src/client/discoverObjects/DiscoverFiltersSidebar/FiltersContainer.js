import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { map, isEmpty, size } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';

import { getActiveFilters } from '../../reducers';
import {
  createFilterBody,
  parseTagsFilters,
  updateActiveFilters,
  updateActiveTagsFilters,
} from '../helper';
import {
  setFiltersAndLoad,
  showMoreTags,
  getObjectTypeByStateFilters,
} from '../../objectTypes/objectTypeActions';
import FilterItem from './FilterItem';

const FiltersContainer = ({ filters, tagsFilters, history, location, match }) => {
  const dispatch = useDispatch();
  const activeFilters = useSelector(getActiveFilters);
  const [collapsedFilters, setCollapsed] = useState([]);
  const [activeTagsFilters, setActiveTagsFilters] = useState({});
  const { search: filterPath, pathname } = location;
  const { typeName } = match.params;

  useEffect(() => {
    if (filterPath) setActiveTagsFilters(parseTagsFilters(filterPath));
  }, []);

  const handleDisplayFilter = filterName => () => {
    if (collapsedFilters.includes(filterName)) {
      setCollapsed(collapsedFilters.filter(f => f !== filterName));
    } else {
      setCollapsed([...collapsedFilters, filterName]);
    }
  };

  const changeUrl = activeTags => {
    const newUrl = Object.keys(activeTags).reduce((acc, category) => {
      if (isEmpty(activeTags[category])) return acc;

      return acc
        ? `${acc}&${category}=${activeTags[category].join(',')}`
        : `?${category}=${activeTags[category].join(',')}`;
    }, '');

    if (newUrl !== filterPath) {
      if (newUrl) history.push(newUrl);
      else history.push(pathname);
    }
  };

  const handleOnChangeCheckbox = e => {
    const { name: filterValue, value: filter, checked } = e.target;
    const updatedFilters = updateActiveFilters(activeFilters, filter, filterValue, checked);

    dispatch(setFiltersAndLoad(updatedFilters));
    changeUrl({ ...updatedFilters, ...activeTagsFilters });
  };

  const handleOnChangeTagsCheckbox = e => {
    const updateTagsFilters = updateActiveTagsFilters(e, activeTagsFilters);

    setActiveTagsFilters(updateTagsFilters);
    console.log(updateTagsFilters);
    dispatch(
      getObjectTypeByStateFilters(
        typeName,
        { skip: 0, limit: 10 },
        createFilterBody(updateTagsFilters),
      ),
    );
    changeUrl({ ...activeFilters, ...updateTagsFilters });
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
              activeFilters={activeTagsFilters}
              filterValues={filterValues.tags}
              hasMore={filterValues.hasMore}
              showMoreTags={() =>
                dispatch(showMoreTags(filterValues.tagCategory, size(filterValues.tags)))
              }
            />
          ))}
      </div>
    </div>
  );
};

FiltersContainer.propTypes = {
  filters: PropTypes.shape().isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  tagsFilters: PropTypes.arrayOf(PropTypes.shape()),
  location: PropTypes.shape({
    search: PropTypes.string,
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      typeName: PropTypes.string,
    })
  }).isRequired
};

FiltersContainer.defaultProps = {
  tagsFilters: [],
  filterPath: '',
};

export default withRouter(FiltersContainer);
