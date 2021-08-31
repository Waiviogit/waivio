import React from 'react';
import { connect } from 'react-redux';
import { get, isEmpty, map } from 'lodash';
import { Button, Dropdown, Icon, Menu } from 'antd';
import classNames from 'classnames';
import { withRouter } from 'react-router';

import { setWebsiteSearchFilter } from '../../../../store/searchStore/searchActions';
import {
  getSearchFilters,
  getSearchFiltersTagCategory,
} from '../../../../store/searchStore/searchSelectors';

const SearchMapFilters = React.memo(props => {
  const query = new URLSearchParams(props.location.search);
  const handleSetFiltersInUrl = (category, value) => {
    if (value === 'all') query.delete(category);
    else query.set(category, value);

    history.push(`?${query.toString()}`);
  };
  const getCurrentName = category => {
    const currentActiveCategory = props.activeFilters.find(item => item.categoryName === category);

    return get(currentActiveCategory, 'tags', [])[0];
  };
  const getMenuForFilter = filter => {
    const currentTagCheck = tag => getCurrentName(filter.tagCategory) === tag;
    const handleOnClickMenu = e => {
      props.setWebsiteSearchFilter(filter.tagCategory, e.key);
      handleSetFiltersInUrl(filter.tagCategory, e.key);
      localStorage.removeItem('scrollTop');
    };
    const menuItemClassList = tag =>
      classNames({
        'SearchAllResult__active-tag': currentTagCheck(tag),
      });

    return (
      <Menu onClick={handleOnClickMenu} className="SearchAllResult__filter-list">
        <Menu.Item key={'all'}>show all</Menu.Item>
        {map(filter.tags, tag => (
          <Menu.Item className={menuItemClassList(tag)} key={tag}>
            {tag}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <div className="SearchAllResult__filters">
      {map(props.filters, filter => {
        const categoryName = getCurrentName(filter.tagCategory) || filter.tagCategory;

        return (
          <Dropdown
            key={filter.tagCategory}
            overlay={getMenuForFilter(filter)}
            trigger={['click']}
            disabled={isEmpty(filter.tags)}
          >
            <Button className="SearchAllResult__filters-button">
              {categoryName} <Icon type="down" />
            </Button>
          </Dropdown>
        );
      })}
    </div>
  );
});

export default connect(
  state => ({
    activeFilters: getSearchFiltersTagCategory(state),
    filters: getSearchFilters(state),
  }),
  {
    setWebsiteSearchFilter,
  },
)(withRouter(SearchMapFilters));
