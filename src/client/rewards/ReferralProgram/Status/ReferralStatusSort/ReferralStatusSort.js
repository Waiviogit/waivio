import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import SortSelector from '../../../../components/SortSelector/SortSelector';

const ReferralStatusSort = ({ handleSortChange, sortBy }) => (
  <SortSelector sort={sortBy} onChange={handleSortChange}>
    <SortSelector.Item key="recency">
      <FormattedMessage id="referral_status_recency_sort" defaultMessage="Recency" />
    </SortSelector.Item>
    <SortSelector.Item key="expiry">
      <FormattedMessage id="referral_status_expiry_sort" defaultMessage="Expiry" />
    </SortSelector.Item>
  </SortSelector>
);

ReferralStatusSort.propTypes = {
  sortBy: PropTypes.string.isRequired,
  handleSortChange: PropTypes.func.isRequired,
};

ReferralStatusSort.defaultProps = {
  sort: 'recency',
};

export default ReferralStatusSort;
