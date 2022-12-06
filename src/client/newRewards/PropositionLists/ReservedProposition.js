import React from 'react';
import {injectIntl} from "react-intl";
import PropTypes from "prop-types";
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import {
  getFiltersForReservedProposition,
  getReservedProposition,
} from '../../../waivioApi/ApiClient';

const sortConfig = [
  { key: 'proximity', title: 'Proximity' },
  { key: 'payout', title: 'Payouts' },
  { key: 'reward', title: 'Amount' },
  { key: 'date', title: 'Expiry' },
];
const ReservedProposition = ({intl}) => {
  const getPropositionReservedPropos = (obj, userName, skip, search, sort) =>
    getReservedProposition(userName, skip, search, sort);

  return (
    <RenderPropositionList
      getProposition={getPropositionReservedPropos}
      getPropositionFilters={getFiltersForReservedProposition}
      tab={'reserved'}
      sortConfig={sortConfig}
      emptyMessage={intl.formatMessage({ id: "empty_reserved_tab", defaultMessage: "You don't have any rewards reserved." })}
      withMap
    />
  );
};

ReservedProposition.propTypes = {
  intl: PropTypes.shape().isRequired,
}

export default injectIntl(ReservedProposition);
