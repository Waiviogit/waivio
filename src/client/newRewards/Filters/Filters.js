import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Checkbox } from 'antd';
import { useHistory } from 'react-router';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import './Filters.less';

const RewardsFilters = ({ config, getFilters, onlyOne }) => {
  const [activeFilters, setActiveFilters] = useState({});
  const history = useHistory();
  const query = new URLSearchParams(history.location.search);
  const [filters, setFilter] = useState({});

  useEffect(() => {
    const types = config.map(conf => conf.type);

    getFilters().then(res => {
      setFilter(res);
    });
    setActiveFilters(
      types.reduce((acc, curr) => {
        const filtrs = query.get(curr);

        if (filtrs) {
          acc[curr] = filtrs?.split(',');
        }

        return acc;
      }, {}),
    );
  }, []);

  const setFilters = (type, filter) => {
    const filreList = activeFilters[type] || [];

    if (filreList.includes(filter)) {
      const filteredList = filreList.filter(name => name !== filter);

      if (isEmpty(filteredList)) {
        query.delete(type);
      } else {
        query.set(type, filteredList.join(','));
      }

      setActiveFilters({
        ...activeFilters,
        [type]: filteredList,
      });
    } else {
      const newListFilters = onlyOne ? [filter] : [...filreList, filter];

      query.set(type, newListFilters.join(','));
      setActiveFilters({
        ...activeFilters,
        [type]: newListFilters,
      });
    }

    history.push(`?${query.toString()}`);
  };

  if (Object.values(filters).every(fltrArray => isEmpty(fltrArray))) return null;

  return (
    <div className="RewardsFilters">
      <div className="RewardsFilters__title">
        <i className="iconfont icon-trysearchlist RewardsFilters__icon" />
        <FormattedMessage id="filter_rewards" defaultMessage="Filter rewards" />
      </div>
      {config.map(filter => {
        if (isEmpty(filters?.[filter?.type])) return null;

        return (
          <div className="RewardsFilters__block" key={filter.title}>
            {filter.title && (<span className="RewardsFilters__subtitle">{filter.title}:</span>)}
            {filters?.[filter?.type]?.map(check => {
              const value = typeof check === 'object' ? check.value : check;
              const title = typeof check === 'object' ? check.title : check;

              return (
                <div key={value}>
                  <Checkbox
                    checked={activeFilters[filter.type]?.includes(value)}
                    onChange={() => setFilters(filter.type, value)}
                  >
                    {' '}
                    {title}
                  </Checkbox>
                </div>
              )
            })}
          </div>
        );
      })}
    </div>
  );
};

RewardsFilters.propTypes = {
  getFilters: PropTypes.func.isRequired,
  onlyOne: PropTypes.bool,
  config: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

RewardsFilters.defaultProps = {
  onlyOne: false
}

export default RewardsFilters;
