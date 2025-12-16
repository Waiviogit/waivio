import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { map, isEmpty, size } from 'lodash';
import { connect } from 'react-redux';
import { withRouter, useRouteMatch } from 'react-router';

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
  getTagsByCategory,
} from '../../../store/objectTypeStore/objectTypeActions';
import FilterItem from './FilterItem';
import {
  getActiveFilters,
  getActiveFiltersTags,
  getTagCategories,
  getCategoryTags,
} from '../../../store/objectTypeStore/objectTypeSelectors';

const FiltersContainer = ({
  filters,
  history,
  location,
  activeFilters,
  activeTagsFilters,
  dispatchSetActiveTagsFilters,
  dispatchShowMoreTags,
  dispatchSetFiltersAndLoad,
  tagCategories,
  categoryTags,
  dispatchGetTagsByCategory,
  newDiscover,
}) => {
  const [collapsedFilters, setCollapsed] = useState([]);
  const { search: filterPath } = location;
  const match = useRouteMatch();
  const activeObjectTypeName = match.params.type || match.params.typeName;

  useEffect(() => {
    if (filterPath) dispatchSetActiveTagsFilters(parseTagsFilters(filterPath));
  }, []);

  const handleDisplayFilter = filterName => () => {
    if (collapsedFilters?.includes(filterName)) {
      setCollapsed(collapsedFilters.filter(f => f !== filterName));
    } else {
      setCollapsed([...collapsedFilters, filterName]);
      const isTagCategory = tagCategories?.some(
        cat => (typeof cat === 'object' ? cat.tagCategory : cat) === filterName,
      );

      if (isTagCategory && !categoryTags[filterName]) {
        dispatchGetTagsByCategory(activeObjectTypeName, filterName);
      }
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

    // dispatchGetTagsByCategory(activeObjectTypeName, value);
    dispatchSetActiveTagsFilters(updateTagsFilters);
    changeUrl({ ...activeFilters, ...updateTagsFilters }, history, location);
  };

  const showMoreTagsHandler = (categoryName, currentTags) => {
    const skip = size(currentTags);
    const limit = 10;

    dispatchShowMoreTags(categoryName, activeObjectTypeName, skip, limit);
  };

  const isCollapsed = name => collapsedFilters?.includes(name);

  return (
    <div className="SidebarContentBlock__content">
      <div className="collapsible-block">
        {!isEmpty(filters) &&
          map(filters, (filterValues, filterName) => (
            <FilterItem
              newDiscover={newDiscover}
              isCollapsed={isCollapsed(filterName)}
              filterName={filterName}
              handleDisplayFilter={handleDisplayFilter}
              handleOnChangeCheckbox={handleOnChangeCheckbox}
              activeFilters={activeFilters}
              filterValues={filterValues}
            />
          ))}
        {!isEmpty(tagCategories) &&
          tagCategories.map(category => {
            const categoryName = category.tagCategory || category;

            const categoryData = categoryTags[categoryName] || {
              tags: category.tags || [],
              hasMore: category.hasMore || false,
            };
            const tags = categoryData.tags || [];
            const hasMore = categoryData.hasMore || false;

            return (
              <FilterItem
                newDiscover={newDiscover}
                key={categoryName}
                isCollapsed={isCollapsed(categoryName)}
                filterName={categoryName}
                handleDisplayFilter={handleDisplayFilter}
                handleOnChangeCheckbox={handleOnChangeTagsCheckbox}
                activeFilters={activeTagsFilters}
                filterValues={tags}
                hasMore={hasMore}
                showMoreTags={() => showMoreTagsHandler(categoryName, tags)}
              />
            );
          })}
      </div>
    </div>
  );
};

FiltersContainer.propTypes = {
  filters: PropTypes.shape().isRequired,
  newDiscover: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
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
  dispatchGetTagsByCategory: PropTypes.func.isRequired,
  activeFilters: PropTypes.shape({}),

  tagCategories: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        tagCategory: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        hasMore: PropTypes.bool,
      }),
    ]),
  ),
  categoryTags: PropTypes.shape({}),
};

FiltersContainer.defaultProps = {
  tagsFilters: [],
  filterPath: '',
  activeFilters: {},
  tagCategories: [],
  categoryTags: {},
  newDiscover: false,
};

export default connect(
  state => ({
    activeTagsFilters: getActiveFiltersTags(state),
    activeFilters: getActiveFilters(state),
    tagCategories: getTagCategories(state),
    categoryTags: getCategoryTags(state),
  }),
  {
    dispatchSetActiveTagsFilters: setTagsFiltersAndLoad,
    dispatchGetActiveFilters: getActiveFilters,
    dispatchShowMoreTags: showMoreTags,
    dispatchSetFiltersAndLoad: setFiltersAndLoad,
    dispatchGetTagsByCategory: getTagsByCategory,
  },
)(withRouter(FiltersContainer));
