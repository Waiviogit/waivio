import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { Checkbox, Rate } from 'antd';
import { useHistory, useRouteMatch } from 'react-router';

import { getDepartmentsFilters } from '../../../waivioApi/ApiClient';
import useQuery from '../../../hooks/useQuery';
import { parseQuery } from '../../../waivioApi/helpers';

import './ShopFilters.less';

const ShopFilters = () => {
  const [filters, setFilters] = useState();
  const [activeFilter, setActiveFilter] = useState({});
  const query = useQuery();
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    getDepartmentsFilters().then(res => setFilters(res));
  }, []);

  useEffect(() => {
    setActiveFilter(parseQuery(query.toString()));
  }, [match.params.department]);

  const setActiveFilters = (type, filter) => {
    const filreList = activeFilter[type] || [];

    if (filreList.includes(filter)) {
      const filteredList = filreList.filter(name => name !== filter);

      if (isEmpty(filteredList)) {
        query.delete(type);
      } else {
        query.set(type, filteredList.join(','));
      }

      setActiveFilter({
        ...activeFilter,
        [type]: filteredList,
      });
    } else {
      const newListFilters = [...filreList, filter];

      query.set(type, newListFilters.join(','));
      setActiveFilter({
        ...activeFilter,
        [type]: newListFilters,
      });
    }

    history.push(`?${query.toString()}`);
  };

  return (
    <div className="ShopFilters">
      <div className="ShopFilters__title">
        <i className="iconfont icon-trysearchlist ShopFilters__icon" />
        <FormattedMessage id="filters" defaultMessage="Filters" />
      </div>
      <div className="RewardsFilters__block">
        <span className="RewardsFilters__subtitle">Ratings:</span>
        {filters?.rating?.map(rate => (
          <div key={rate}>
            <Checkbox
              checked={activeFilter.rating?.includes(rate)}
              onChange={() => setActiveFilters('rating', rate)}
            >
              {' '}
              <Rate defaultValue={rate / 2} allowHalf disabled />
            </Checkbox>
          </div>
        ))}
      </div>
      {filters?.tagCategoryFilters?.map(category => (
        <div key={category.tagCategory} className="RewardsFilters__block">
          <span className="RewardsFilters__subtitle">{category.tagCategory}:</span>
          {category?.tags?.map(tag => (
            <div key={tag}>
              <Checkbox
                checked={activeFilter[category.tagCategory]?.includes(tag)}
                onChange={() => setActiveFilters(category.tagCategory, tag)}
              >
                {' '}
                {tag}
              </Checkbox>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ShopFilters;
