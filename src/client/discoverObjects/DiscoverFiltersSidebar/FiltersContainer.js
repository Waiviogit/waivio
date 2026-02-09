import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { map, isEmpty, size } from 'lodash';
import { connect } from 'react-redux';
import { withRouter, useRouteMatch } from 'react-router';

import {
  parseDiscoverTagsFilters,
  parseDiscoverQuery,
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
    if (!newDiscover)
      dispatchSetActiveTagsFilters(parseDiscoverTagsFilters(location.search), activeObjectTypeName);
  }, [location.search, activeObjectTypeName]);

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

    const { sort } = parseDiscoverQuery(location.search);
    const search = buildCanonicalSearch({
      search: new URLSearchParams(location.search).get('search'),
      category: new URLSearchParams(location.search).get('category'),
      tagsByCategory: activeTagsFilters,
      sort,
    });

    history.push(`${location.pathname}?${search}`);
  };

  const handleOnChangeTagsCheckbox = e => {
    const { name: tag, value: category, checked } = e.target;

    const currentTagsFromUrl = parseDiscoverTagsFilters(location.search);
    const updatedTags = updateActiveTagsFilters(currentTagsFromUrl, tag, category, checked);

    if (!newDiscover) dispatchSetActiveTagsFilters(updatedTags, activeObjectTypeName);

    const { sort, search } = parseDiscoverQuery(location.search);
    const canonicalSearch = buildCanonicalSearch({
      search,
      tagsByCategory: updatedTags,
      sort,
    });

    history.push(`${location.pathname}?${canonicalSearch}`);
  };

  const showMoreTagsHandler = useCallback(
    (categoryName, currentTags) => {
      dispatchShowMoreTags(categoryName, activeObjectTypeName, size(currentTags), 10);
    },
    [activeObjectTypeName],
  );

  const isCollapsed = name => collapsedFilters.includes(name);

  // For newDiscover, read tags directly from URL to ensure sync with removeTag
  const activeTagsForDisplay = newDiscover
    ? parseDiscoverTagsFilters(location.search)
    : activeTagsFilters;

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
                activeFilters={activeTagsForDisplay}
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
