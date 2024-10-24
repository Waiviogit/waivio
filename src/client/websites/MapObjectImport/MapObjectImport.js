import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import MapObjectImportModal from './MapObjectImportModal';
import ImportErrorModal from './ImportErrorModal';
import {
  getAuthenticatedUserName,
  getGuestAuthority,
  getIsConnectMatchBot,
  isGuestUser,
} from '../../../store/authStore/authSelectors';
import { MATCH_BOTS_TYPES } from '../../../common/helpers/matchBotsHelpers';
import * as ApiClient from '../../../waivioApi/ApiClient';
import { calculateMana, dHive } from '../../vendor/steemitHelpers';

const MapObjectImport = ({ closeModal, showImportModal }) => {
  const [usersState, setUsersState] = useState(null);
  const hasVotingPower = usersState?.resourceCredits > 0.0001;
  const isGuest = useSelector(isGuestUser);
  const authUserName = useSelector(getAuthenticatedUserName);
  const hasImportAuthority = isGuest
    ? useSelector(getGuestAuthority)
    : useSelector(state => getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.IMPORT }));

  const getVotingInfo = async () => {
    if (isGuest) {
      const guestUserMana = await ApiClient.getGuestUserMana(authUserName);

      setUsersState({ guestMana: guestUserMana.result });
    } else {
      const [acc] = await dHive.database.getAccounts([authUserName]);
      const rc = await dHive.rc.getRCMana(authUserName, acc);
      const waivVotingMana = await ApiClient.getWaivVoteMana(authUserName, acc);
      const waivPowerBar = waivVotingMana ? calculateMana(waivVotingMana) : null;
      const resourceCredits = rc.percentage * 0.01 || 0;

      setUsersState({
        waivPowerMana: waivPowerBar?.votingPower ? waivPowerBar.votingPower : 100,
        resourceCredits,
      });
    }
  };

  useEffect(() => {
    getVotingInfo();
  }, []);

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
};
export default MapObjectImport;
