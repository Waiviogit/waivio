import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get, map, find } from 'lodash';
import { Checkbox } from 'antd';
import { sortStrings } from '../helpers/sortHelpers';

const FilterModal = ({
  intl,
  match,
  filters,
  activeFilters,
  filtersHistory,
  filtersMessages,
  setFilterValue,
  activePayablesFilters,
  activeHistoryFilters,
  activeMessagesFilters,
  setActiveMessagesFilters,
}) => {
  const [collapsedFilters, setCollapsedFilters] = useState([]);
  const isPayables = !!(get(filters, 'payables', null) || get(filters, 'receivables', null));
  const isHistory = match ? match.params.filterKey === 'history' : null;
  const isMessages = match ? match.params.filterKey === 'messages' : null;

  const modifyFilterName = name => {
    if (name === 'types') return 'rewards_for';
    if (name === 'guideNames') return 'sponsors';
    if (name === 'messagesSponsors') return 'sponsors';
    if (name === 'caseStatus') return 'Case status';
    return name;
  };

  const handleDisplayFilter = filterName => () => {
    if (collapsedFilters.includes(filterName)) {
      setCollapsedFilters(collapsedFilters.filter(f => f !== filterName));
    } else {
      setCollapsedFilters([...collapsedFilters, filterName]);
    }
  };

  const handleOnChangeCheckbox = e => {
    const { name: filterValue, value: filter } = e.target;
    if (isPayables) {
      const settedValue = find(
        Object.values(filters)[0],
        value => value.filterName === filterValue,
      );
      setFilterValue(settedValue);
    } else if (isHistory || isMessages) {
      setActiveMessagesFilters(filterValue, filter);
    } else {
      setFilterValue(filterValue, filter);
    }
  };

  const renderValues = (filterName, filterValues) =>
    map(sortStrings(filterValues), value => {
      const isChecked = get(activeFilters, [filterName], []).some(active => active === value);
      return (
        <div key={`${filterName}_${value}`} className="collapsible-block__item">
          <Checkbox
            name={value}
            value={filterName}
            onChange={handleOnChangeCheckbox}
            checked={isChecked}
          >
            <span className="collapsible-block__item__label">{value}</span>
          </Checkbox>
        </div>
      );
    });

  const renderHistoryValues = (filterName, filterValues) =>
    map(filterValues, value => {
      const filtersCheked = isHistory ? activeHistoryFilters : activeMessagesFilters;
      const isChecked =
        filterName !== 'caseStatus'
          ? get(filtersCheked, [filterName], []).some(active => active === value)
          : filtersCheked.caseStatus === value;
      return (
        <div key={`${filterName}_${value}`} className="collapsible-block__item">
          <Checkbox
            name={value}
            value={filterName}
            onChange={handleOnChangeCheckbox}
            checked={isChecked}
          >
            <span className="collapsible-block__item__label">{value}</span>
          </Checkbox>
        </div>
      );
    });

  const renderPayablesValues = (filterName, filterValues) =>
    map(filterValues, value => {
      const isChecked = Object.values(activePayablesFilters).some(
        active => active.filterName === value.filterName,
      );
      return (
        <div key={`${filterName}_${value.filterName}`} className="collapsible-block__item">
          <Checkbox
            name={value.filterName}
            value={filterName}
            onChange={handleOnChangeCheckbox}
            checked={isChecked}
          >
            <span className="collapsible-block__item__label">
              {intl.formatMessage(
                { id: `filter_${value.filterName}`, defaultMessage: value.defaultMessage },
                { value: value.value },
              )}
            </span>
          </Checkbox>
        </div>
      );
    });

  const getFiltersForMap = () => {
    if (isHistory) {
      return filtersHistory;
    } else if (isMessages) {
      return filtersMessages;
    }
    return filters;
  };

  const filtersForMap = getFiltersForMap();

  return (
    <div className="SidebarContentBlock__content">
      <div className="collapsible-block">
        {map(filtersForMap, (filterValues, filterName) => {
          const isCollapsed = collapsedFilters.includes(filterName);
          const renderedName = modifyFilterName(filterName);

          return (
            <div key={filterName} className="collapsible-block__container">
              <div
                className="collapsible-block__title"
                role="presentation"
                onClick={handleDisplayFilter(filterName)}
              >
                <span className="collapsible-block__title-text">
                  {intl.formatMessage({ id: renderedName, defaultMessage: renderedName })}
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
                  {isPayables && renderPayablesValues(filterName, filterValues)}
                  {!isPayables &&
                    !isMessages &&
                    !isHistory &&
                    renderValues(filterName, filterValues)}
                  {(isMessages || isHistory) && renderHistoryValues(filterName, filterValues)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

FilterModal.propTypes = {
  intl: PropTypes.shape().isRequired,
  filters: PropTypes.shape().isRequired,
  filtersHistory: PropTypes.shape(),
  filtersMessages: PropTypes.shape(),
  activeFilters: PropTypes.shape(),
  activePayablesFilters: PropTypes.arrayOf(PropTypes.shape()),
  setFilterValue: PropTypes.func,
  activeHistoryFilters: PropTypes.shape(),
  activeMessagesFilters: PropTypes.shape(),
  setActiveMessagesFilters: PropTypes.func,
  match: PropTypes.shape().isRequired,
};

FilterModal.defaultProps = {
  setFilterValue: () => {},
  setActiveMessagesFilters: () => {},
  activeFilters: {},
  activePayablesFilters: [],
  activeHistoryFilters: {},
  activeMessagesFilters: {},
  filtersHistory: {},
  filtersMessages: {},
};

export default FilterModal;
