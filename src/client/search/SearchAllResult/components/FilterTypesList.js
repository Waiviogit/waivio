import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { getActiveItemClassList } from '../../helpers';
import { setWebsiteSearchType } from '../../../../store/searchStore/searchActions';
import { getWebsiteSearchType } from '../../../../store/searchStore/searchSelectors';

const FilterTypesList = props => {
  const filterTypes = ['restaurant', 'dish', 'drink', 'Users'];
  const onClickTypeItem = type => {
    props.setWebsiteSearchType(type);
    localStorage.removeItem('scrollTop');
    props.history.push(`?type=${type}&showPanel=true`);
  };

  return (
    <div className="SearchAllResult__type-wrap">
      {filterTypes.map(type => {
        const onClick = () => onClickTypeItem(type);

        return (
          <span
            role="presentation"
            className={getActiveItemClassList(type, props.searchType, 'SearchAllResult__type')}
            key={type}
            onClick={onClick}
          >
            {type}
          </span>
        );
      })}
    </div>
  );
};

FilterTypesList.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setWebsiteSearchType: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
  searchMap: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

export default connect(
  state => ({
    searchType: getWebsiteSearchType(state),
  }),
  {
    setWebsiteSearchType,
  },
)(withRouter(FilterTypesList));
