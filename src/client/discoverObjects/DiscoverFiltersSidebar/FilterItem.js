import { get } from 'lodash';
import { Checkbox } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

import './FilterItem.less';

const FilterItem = ({
  filterName,
  handleDisplayFilter,
  isCollapsed,
  handleOnChangeCheckbox,
  activeFilters,
  filterValues,
  hasMore,
  showMoreTags,
}) => (
  <div key={filterName} className="FilterItem collapsible-block__container">
    <div
      className="collapsible-block__title"
      role="presentation"
      onClick={handleDisplayFilter(filterName)}
    >
      <span className="collapsible-block__title-text">{filterName}</span>
      <span className="collapsible-block__title-icon">
        <i className={`iconfont icon-${isCollapsed ? 'addition' : 'offline'}`} />
      </span>
    </div>
    {!isCollapsed && (
      <div className="collapsible-block__content">
        {filterValues.map(value => {
          const isChecked = get(activeFilters, [filterName.replace(' ', '%20')], []).some(
            active => active === value,
          );

          return (
            <div key={filterName + value} className="collapsible-block__item">
              <Checkbox
                name={value}
                value={filterName}
                onChange={handleOnChangeCheckbox}
                checked={isChecked}
              >
                <span className="collapsible-block__item__label ttc">{value}</span>
              </Checkbox>
            </div>
          );
        })}
        {hasMore && (
          <span className="FilterItem__show-more" role="presentation" onClick={showMoreTags}>
            show more
          </span>
        )}
      </div>
    )}
  </div>
);

FilterItem.propTypes = {
  filterName: PropTypes.string,
  handleDisplayFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  handleOnChangeCheckbox: PropTypes.func,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  filterValues: PropTypes.arrayOf(PropTypes.string),
  hasMore: PropTypes.bool,
  showMoreTags: PropTypes.func,
};

FilterItem.defaultProps = {
  filterName: '',
  handleDisplayFilter: () => {},
  isCollapsed: false,
  handleOnChangeCheckbox: () => {},
  showMoreTags: () => {},
  activeFilters: [],
  filterValues: [],
  hasMore: false,
};

export default FilterItem;
