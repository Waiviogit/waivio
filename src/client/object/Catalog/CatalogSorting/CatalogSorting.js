import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { objectFields } from '../../../../common/constants/listOfFields';
import SortSelector from '../../../components/SortSelector/SortSelector';
import CatalogBreadcrumb from '../CatalogBreadcrumb/CatalogBreadcrumb';

const CatalogSorting = ({ currWobject, sort, handleSortChange, isCustomExist }) =>
  !isEmpty(currWobject[objectFields.sorting]) && isCustomExist ? (
    <SortSelector sort={sort} onChange={handleSortChange}>
      <SortSelector.Item key="recency">
        <FormattedMessage id="recency" defaultMessage="Recency" />
      </SortSelector.Item>
      <SortSelector.Item key="custom">
        <FormattedMessage id="custom" defaultMessage="Custom" />
      </SortSelector.Item>
      <SortSelector.Item key="rank">
        <FormattedMessage id="rank" defaultMessage="Rank" />
      </SortSelector.Item>
      <SortSelector.Item key="by-name-asc">
        <FormattedMessage id="by-name-asc" defaultMessage="a . . z">
          {msg => msg.toUpperCase()}
        </FormattedMessage>
      </SortSelector.Item>
      <SortSelector.Item key="by-name-desc">
        <FormattedMessage id="by-name-desc" defaultMessage="z . . a">
          {msg => msg.toUpperCase()}
        </FormattedMessage>
      </SortSelector.Item>
    </SortSelector>
  ) : (
    <SortSelector sort={sort} onChange={handleSortChange}>
      <SortSelector.Item key="recency">
        <FormattedMessage id="recency" defaultMessage="Recency" />
      </SortSelector.Item>
      <SortSelector.Item key="rank">
        <FormattedMessage id="rank" defaultMessage="Rank" />
      </SortSelector.Item>
      <SortSelector.Item key="by-name-asc">
        <FormattedMessage id="by-name-asc" defaultMessage="a . . z">
          {msg => msg.toUpperCase()}
        </FormattedMessage>
      </SortSelector.Item>
      <SortSelector.Item key="by-name-desc">
        <FormattedMessage id="by-name-desc" defaultMessage="z . . a">
          {msg => msg.toUpperCase()}
        </FormattedMessage>
      </SortSelector.Item>
    </SortSelector>
  );

CatalogSorting.propTypes = {
  sort: PropTypes.isRequired,
  currWobject: PropTypes.isRequired,
  handleSortChange: PropTypes.func.isRequired,
  isCustomExist: PropTypes.bool.isRequired,
};

CatalogBreadcrumb.defaultProps = {
  sort: [],
  currWobject: {},
};

export default CatalogSorting;
