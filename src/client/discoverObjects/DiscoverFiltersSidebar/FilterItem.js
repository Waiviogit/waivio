import { get } from 'lodash';
import { Checkbox } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { sortStrings } from '../../helpers/sortHelpers';

const FilterItem = ({
  filterName,
  handleDisplayFilter,
  isCollapsed,
  intl,
  handleOnChangeCheckbox,
  activeFilters,
  filterValues,
}) => (
  <div key={filterName} className="collapsible-block__container">
    <div
      className="collapsible-block__title"
      role="presentation"
      onClick={handleDisplayFilter(filterName)}
    >
      <span className="collapsible-block__title-text">
        {intl.formatMessage({ id: `filter-${filterName}`, defaultMessage: filterName })}
      </span>
      <span className="collapsible-block__title-icon">
        {isCollapsed ? (
          <i className="iconfont icon-addition" />
        ) : (
          <i className="iconfont icon-offline" />
        )}
      </span>
    </div>
    {!isCollapsed && (
      <div className="collapsible-block__content">
        {sortStrings(filterValues).map(value => {
          const isChecked = get(activeFilters, [filterName], []).some(active => active === value);
          return (
            <div key={filterName + value} className="collapsible-block__item">
              <Checkbox
                name={value}
                value={filterName}
                onChange={handleOnChangeCheckbox}
                checked={isChecked}
              >
                <span className="collapsible-block__item__label ttc">
                  {intl.formatMessage({ id: value, defaultMessage: value })}
                </span>
              </Checkbox>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

FilterItem.propTypes = {
  intl: PropTypes.shape().isRequired,
  filterName: PropTypes.string,
  handleDisplayFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  handleOnChangeCheckbox: PropTypes.func,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  filterValues: PropTypes.arrayOf(PropTypes.string),
};

FilterItem.defaultProps = {
  filterName: '',
  handleDisplayFilter: () => {},
  isCollapsed: false,
  handleOnChangeCheckbox: () => {},
  activeFilters: [],
  filterValues: [],
};

export default injectIntl(FilterItem);
