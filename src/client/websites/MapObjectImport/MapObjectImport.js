import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import MapObjectImportModal from './MapObjectImportModal';
import ImportErrorModal from './ImportErrorModal';
import {
  getGuestAuthority,
  getIsConnectMatchBot,
  isGuestUser,
} from '../../../store/authStore/authSelectors';
import { MATCH_BOTS_TYPES } from '../../../common/helpers/matchBotsHelpers';

const MapObjectImport = ({ closeModal, showImportModal, usersState }) => {
  const isGuest = useSelector(isGuestUser);
  const hasVotingPower = isGuest
    ? usersState?.guestMana > 10
    : usersState?.resourceCredits > 0.0001;
  const hasImportAuthority = isGuest
    ? useSelector(getGuestAuthority)
    : useSelector(state => getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.IMPORT }));

  return (
    <div>
      {hasVotingPower && hasImportAuthority ? (
        <MapObjectImportModal closeImportModal={closeModal} showImportModal={showImportModal} />
      ) : (
        <ImportErrorModal
          hasImportAuthority={hasImportAuthority}
          hasVotingPower={hasVotingPower}
          closeImportModal={closeModal}
          showImportModal={showImportModal}
        />
      )}
    </div>
  );
};

MapObjectImport.propTypes = {
  closeModal: PropTypes.func.isRequired,
  showImportModal: PropTypes.bool.isRequired,
  usersState: PropTypes.shape().isRequired,
};
export default MapObjectImport;
