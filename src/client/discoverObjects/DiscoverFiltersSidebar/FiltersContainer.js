import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { map, isEmpty, size } from 'lodash';
import { connect } from 'react-redux';
import { withRouter, useRouteMatch } from 'react-router';

import {
  parseDiscoverTagsFilters,
  buildCanonicalSearch,
  updateActiveFilters,
  updateActiveTagsFilters,
} from '../helper';
import {
  setFiltersAndLoad,
  showMoreTags,
  setTagsFiltersAndLoad,
  getTagsByCategory,
  getTagCategories,
} from '../../../store/objectTypeStore/objectTypeActions';
import FilterItem from './FilterItem';
import {
  getActiveFilters,
  getActiveFiltersTags,
  getTagCategories as getTagCategoriesSelector,
  getCategoryTags,
} from '../../../store/objectTypeStore/objectTypeSelectors';

const FiltersContainer = ({
  filters,
  history,
  location,
  activeFilters,
  activeTagsFilters,
  tagCategories,
  categoryTags,
  dispatchSetActiveTagsFilters,
  dispatchShowMoreTags,
  dispatchSetFiltersAndLoad,
  dispatchGetTagsByCategory,
  newDiscover,
}) => {
  const [collapsedFilters, setCollapsed] = useState([]);
  const match = useRouteMatch();
  const activeObjectTypeName = match.params.type || match.params.typeName;

  useEffect(() => {
    dispatchSetActiveTagsFilters(parseDiscoverTagsFilters(location.search));
  }, [location.search]);

  const handleDisplayFilter = filterName => () => {
    setCollapsed(prev =>
      prev.includes(filterName) ? prev.filter(f => f !== filterName) : [...prev, filterName],
    );

    const isTagCategory = tagCategories?.some(
      cat => (typeof cat === 'object' ? cat.tagCategory : cat) === filterName,
    );

    if (isTagCategory && !categoryTags[filterName]) {
      dispatchGetTagsByCategory(activeObjectTypeName, filterName);
    }
  };

  const handleOnChangeCheckbox = e => {
    const { name: filterValue, value: filter, checked } = e.target;

    const updatedFilters = updateActiveFilters(activeFilters, filter, filterValue, checked);

    dispatchSetFiltersAndLoad(updatedFilters);

    const search = buildCanonicalSearch({
      search: new URLSearchParams(location.search).get('search'),
      category: new URLSearchParams(location.search).get('category'),
      tagsByCategory: activeTagsFilters,
    });

    history.push(`${location.pathname}?${search}`);
  };

  const handleOnChangeTagsCheckbox = e => {
    const { name: tag, value: category, checked } = e.target;

    const updatedTags = updateActiveTagsFilters(activeTagsFilters, tag, category, checked);

    // dispatchSetActiveTagsFilters(updatedTags);

    const search = buildCanonicalSearch({
      search: new URLSearchParams(location.search).get('search'),
      category: new URLSearchParams(location.search).get('category'),
      tagsByCategory: updatedTags,
    });

    history.push(`${location.pathname}?${search}`);

    // if (newDiscover && activeObjectTypeName) {
    //   dispatchGetTagCategories(activeObjectTypeName);
    // }
  };

  const showMoreTagsHandler = useCallback(
    (categoryName, currentTags) => {
      dispatchShowMoreTags(categoryName, activeObjectTypeName, size(currentTags), 10);
    },
    [activeObjectTypeName],
  );

  const isCollapsed = name => collapsedFilters.includes(name);

  return (
    <div className="SidebarContentBlock__content">
      <div className="collapsible-block">
        {!isEmpty(filters) &&
          map(filters, (filterValues, filterName) => (
            <FilterItem
              key={filterName}
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
            const data = categoryTags[categoryName] || category;

            return (
              <FilterItem
                key={categoryName}
                newDiscover={newDiscover}
                isCollapsed={isCollapsed(categoryName)}
                filterName={categoryName}
                handleDisplayFilter={handleDisplayFilter}
                handleOnChangeCheckbox={handleOnChangeTagsCheckbox}
                activeFilters={activeTagsFilters}
                filterValues={data.tags || []}
                hasMore={data.hasMore}
                showMoreTags={() => showMoreTagsHandler(categoryName, data.tags || [])}
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
  history: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  activeFilters: PropTypes.shape({}),
  activeTagsFilters: PropTypes.shape({}).isRequired,
  tagCategories: PropTypes.arrayOf(),
  categoryTags: PropTypes.shape({}),
  dispatchSetActiveTagsFilters: PropTypes.func.isRequired,
  dispatchShowMoreTags: PropTypes.func.isRequired,
  dispatchSetFiltersAndLoad: PropTypes.func.isRequired,
  dispatchGetTagsByCategory: PropTypes.func.isRequired,
};

FiltersContainer.defaultProps = {
  activeFilters: {},
  tagCategories: [],
  categoryTags: {},
  newDiscover: false,
};

export default connect(
  state => ({
    activeFilters: getActiveFilters(state),
    activeTagsFilters: getActiveFiltersTags(state),
    tagCategories: getTagCategoriesSelector(state),
    categoryTags: getCategoryTags(state),
  }),
  {
    dispatchSetActiveTagsFilters: setTagsFiltersAndLoad,
    dispatchShowMoreTags: showMoreTags,
    dispatchSetFiltersAndLoad: setFiltersAndLoad,
    dispatchGetTagsByCategory: getTagsByCategory,
    dispatchGetTagCategories: getTagCategories,
  },
)(withRouter(FiltersContainer));
