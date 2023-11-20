import { Tag } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { setWebsiteSearchFilter } from '../../../store/searchStore/searchActions';
import { getSearchFiltersTagCategory } from '../../../store/searchStore/searchSelectors';

const TagFilters = props => {
  const onClose = filter => {
    props.setWebsiteSearchFilter(filter.categoryName, 'all');
    props.query.delete(filter.categoryName);
    props.history.push(`?${props.query.toString()}`);
  };
  const isActiveFilters = !isEmpty(props.activeFilters);

  if (!isActiveFilters) return null;

  return (
    <div className="WebsiteBody__filters-list">
      {props.activeFilters.map(filter => {
        const handleOnClose = () => onClose(filter);

        return filter.tags.map(tag => (
          <Tag key={tag} closable onClose={handleOnClose}>
            {tag}
          </Tag>
        ));
      })}
    </div>
  );
};

TagFilters.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  query: PropTypes.shape({
    get: PropTypes.func,
    set: PropTypes.func,
    delete: PropTypes.func,
  }).isRequired,
  setWebsiteSearchFilter: PropTypes.func.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default connect(
  state => ({
    activeFilters: getSearchFiltersTagCategory(state),
  }),
  {
    setWebsiteSearchFilter,
  },
)(TagFilters);
