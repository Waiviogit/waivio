import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { objectFields } from '../../../../common/constants/listOfFields';
import SortSelector from '../../../components/SortSelector/SortSelector';
import OBJ_TYPES from '../../const/objectTypes';

const CatalogSorting = ({ currWobject, sort, handleSortChange }) => {
  const isRecipe =
    currWobject?.object_type === OBJ_TYPES.RECIPE || currWobject?.type === OBJ_TYPES.RECIPE;

  return !isEmpty(currWobject[objectFields.sorting]) ? (
    <SortSelector sort={sort} onChange={handleSortChange}>
      <SortSelector.Item key="newestFirst">
        <FormattedMessage id="newest_first" defaultMessage="Newest first" />
      </SortSelector.Item>
      {isRecipe && (
        <SortSelector.Item key="newestFirstAll">
          <FormattedMessage id="newest_first_all" defaultMessage="Newest first (All)" />
        </SortSelector.Item>
      )}
      <SortSelector.Item key="oldestFirst">
        <FormattedMessage id="oldest_first" defaultMessage="Oldest first" />
      </SortSelector.Item>
      <SortSelector.Item key="custom">
        <FormattedMessage id="custom" defaultMessage="Custom" />
      </SortSelector.Item>
      <SortSelector.Item key="weight">
        <FormattedMessage id="rank" defaultMessage="Rank" />
      </SortSelector.Item>
      <SortSelector.Item key="by-name-asc">
        <FormattedMessage id="by-name-asc" defaultMessage="A..Z" />
      </SortSelector.Item>
      <SortSelector.Item key="by-name-desc">
        <FormattedMessage id="by-name-desc" defaultMessage="Z..A" />
      </SortSelector.Item>
    </SortSelector>
  ) : (
    <SortSelector sort={sort} onChange={handleSortChange}>
      <SortSelector.Item key="newestFirst">
        <FormattedMessage id="newest_first" defaultMessage="Newest first" />
      </SortSelector.Item>
      {isRecipe && (
        <SortSelector.Item key="newestFirstAll">
          <FormattedMessage id="newest_first_all" defaultMessage="Newest first (All)" />
        </SortSelector.Item>
      )}
      <SortSelector.Item key="oldestFirst">
        <FormattedMessage id="oldest_first" defaultMessage="Oldest first" />
      </SortSelector.Item>
      <SortSelector.Item key="weight">
        <FormattedMessage id="rank" defaultMessage="Rank" />
      </SortSelector.Item>
      <SortSelector.Item key="by-name-asc">
        <FormattedMessage id="by-name-asc" defaultMessage="A..Z" />
      </SortSelector.Item>
      <SortSelector.Item key="by-name-desc">
        <FormattedMessage id="by-name-desc" defaultMessage="Z..A" />
      </SortSelector.Item>
    </SortSelector>
  );
};

CatalogSorting.propTypes = {
  sort: PropTypes.string.isRequired,
  currWobject: PropTypes.shape().isRequired,
  handleSortChange: PropTypes.func.isRequired,
};

CatalogSorting.defaultProps = {
  sort: 'oldestFirst',
  currWobject: {},
};

export default CatalogSorting;
