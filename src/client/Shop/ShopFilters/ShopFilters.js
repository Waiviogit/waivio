import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { Checkbox, Modal, Rate } from 'antd';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import useQuery from '../../../hooks/useQuery';
import { parseQuery } from '../../../waivioApi/helpers';

import './ShopFilters.less';

const ShopFilters = ({ visible, onClose, getDepartmentsFilters, showMoreTagsForFilters }) => {
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

  const setActiveFilters = (type, filter, filterOnlyOne = false) => {
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
      const newListFilters = filterOnlyOne ? [filter] : [...filreList, filter];

      query.set(type, newListFilters.join(','));
      setActiveFilter({
        ...activeFilter,
        [type]: newListFilters,
      });
    }

    history.push(`?${query.toString()}`);
  };

  const getMoreTags = (tagCategory, objType, skip) =>
    showMoreTagsForFilters(tagCategory, objType, skip, 10).then(res => {
      const tagCategoryFilters = [...filters.tagCategoryFilters];
      const index = tagCategoryFilters.findIndex(filt => filt.tagCategory === tagCategory);

      tagCategoryFilters.splice(index, 1, {
        ...tagCategoryFilters[index],
        tags: [...tagCategoryFilters[index].tags, ...res.tags],
        hasMore: res.hasMore,
      });

      setFilters({
        ...filters,
        tagCategoryFilters,
      });
    });

  const body = (
    <div className="ShopFilters">
      <div className="ShopFilters__title">
        <i className="iconfont icon-trysearchlist ShopFilters__icon" />
        <FormattedMessage id="filters" defaultMessage="Filters" />
      </div>
      <div className="ShopFilters__block">
        <span className="ShopFilters__subtitle">Ratings:</span>
        {filters?.rating?.map(rate => (
          <div key={rate}>
            <Checkbox
              checked={activeFilter?.rating?.some(r => +r === +rate)}
              onChange={() => setActiveFilters('rating', rate, true)}
            >
              {' '}
              <Rate defaultValue={rate / 2} allowHalf disabled />
            </Checkbox>
          </div>
        ))}
      </div>
      {filters?.tagCategoryFilters?.map(category => (
        <div key={category.tagCategory} className="ShopFilters__block">
          <span className="ShopFilters__subtitle">{category.tagCategory}:</span>
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
          {category.hasMore && (
            <span
              className="ShopFilters__show-more"
              role="presentation"
              onClick={() =>
                getMoreTags(category.tagCategory, category.type, category?.tags?.length)
              }
            >
              show more
            </span>
          )}
        </div>
      ))}
    </div>
  );

  return visible ? (
    <Modal visible={visible} onCancel={onClose} onOk={onClose}>
      {body}
    </Modal>
  ) : (
    body
  );
};

ShopFilters.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  getDepartmentsFilters: PropTypes.func,
  showMoreTagsForFilters: PropTypes.func,
};

export default ShopFilters;
