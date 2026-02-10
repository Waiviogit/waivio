import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import SortSelector from '../../components/SortSelector/SortSelector';
import OBJ_TYPES from '../../object/const/objectTypes';

const DiscoverSorting = ({ sort, handleSortChange, objectType }) => {
  const isRecipe = objectType === OBJ_TYPES.RECIPE;

  return (
    <SortSelector sort={sort} onChange={handleSortChange}>
      <SortSelector.Item key="newestFirst">
        <FormattedMessage id="newest_first" defaultMessage="Newest first" />
      </SortSelector.Item>
      {isRecipe && (
        <SortSelector.Item key="newestFirstAll">
          <FormattedMessage id="newest_first" defaultMessage="Newest first (All)" />
        </SortSelector.Item>
      )}
      <SortSelector.Item key="oldestFirst">
        <FormattedMessage id="oldest_first" defaultMessage="Oldest first" />
      </SortSelector.Item>
      <SortSelector.Item key="weight">
        <FormattedMessage id="rank" defaultMessage="Rank" />
      </SortSelector.Item>
    </SortSelector>
  );
};

DiscoverSorting.propTypes = {
  sort: PropTypes.string.isRequired,
  handleSortChange: PropTypes.func.isRequired,
  objectType: PropTypes.string,
};

DiscoverSorting.defaultProps = {
  sort: 'newestFirst',
  objectType: null,
};

export default DiscoverSorting;
