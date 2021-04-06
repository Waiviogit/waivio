import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { map, isEmpty, size } from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getActiveFilters, getActiveFiltersTags } from '../../store/reducers';
import {
  changeUrl,
  parseTagsFilters,
  updateActiveFilters,
  updateActiveTagsFilters,
} from '../helper';
import {
  setFiltersAndLoad,
  showMoreTags,
  setTagsFiltersAndLoad,
} from '../../objectTypes/objectTypeActions';
import FilterItem from './FilterItem';

const FiltersContainer = ({
  filters,
  tagsFilters,
  history,
  location,
  activeFilters,
  activeTagsFilters,
  dispatchSetActiveTagsFilters,
  dispatchShowMoreTags,
  dispatchSetFiltersAndLoad,
}) => {
  const [collapsedFilters, setCollapsed] = useState([]);
  const { search: filterPath } = location;

  useEffect(() => {
    if (filterPath) dispatchSetActiveTagsFilters(parseTagsFilters(filterPath));
  }, []);

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

    dispatchSetFiltersAndLoad(updatedFilters);
    changeUrl({ ...updatedFilters, ...activeTagsFilters }, history, location);
  };

  const handleOnChangeTagsCheckbox = e => {
    const { name: filterValue, value, checked } = e.target;
    const updateTagsFilters = updateActiveTagsFilters(
      activeTagsFilters,
      filterValue,
      value,
      checked,
    );

    dispatchSetActiveTagsFilters(updateTagsFilters);
    changeUrl({ ...activeFilters, ...updateTagsFilters }, history, location);
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
                dispatchShowMoreTags(filterValues.tagCategory, size(filterValues.tags))
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
    }),
  }).isRequired,
  activeTagsFilters: PropTypes.shape({}).isRequired,
  dispatchSetActiveTagsFilters: PropTypes.func.isRequired,
  dispatchShowMoreTags: PropTypes.func.isRequired,
  dispatchSetFiltersAndLoad: PropTypes.func.isRequired,
  activeFilters: PropTypes.shape({}),
};

FiltersContainer.defaultProps = {
  tagsFilters: [],
  filterPath: '',
  activeFilters: {},
};

export default connect(
  state => ({
    activeTagsFilters: getActiveFiltersTags(state),
    activeFilters: getActiveFilters(state),
  }),
  {
    dispatchSetActiveTagsFilters: setTagsFiltersAndLoad,
    dispatchGetActiveFilters: getActiveFilters,
    dispatchShowMoreTags: showMoreTags,
    dispatchSetFiltersAndLoad: setFiltersAndLoad,
  },
)(withRouter(FiltersContainer));
