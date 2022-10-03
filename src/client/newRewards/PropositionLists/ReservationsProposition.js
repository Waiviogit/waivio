import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import {
  getFiltersForReservationsProposition,
  getReservationsList,
} from '../../../waivioApi/ApiClient';

const filterConfig = [
  { title: 'Rewards', type: 'statuses' },
  { title: 'Campaign', type: 'campaignNames' },
];

const ReservationsProposition = () => {
  const getPropositionReservedPropos = (obj, userName, skip, search, sort) =>
    getReservationsList(userName, skip, search, sort);

  return (
    <RenderPropositionList
      getProposition={getPropositionReservedPropos}
      getPropositionFilters={getFiltersForReservationsProposition}
      customFilterConfig={filterConfig}
      tab={'reservations'}
    />
  );
};

export default ReservationsProposition;
