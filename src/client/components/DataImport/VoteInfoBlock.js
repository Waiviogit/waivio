import React, { useEffect, useState } from 'react';
import { round } from 'lodash';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { calculateMana, dHive } from '../../vendor/steemitHelpers';
import * as ApiClient from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const VoteInfoBlock = ({ intl }) => {
  const [usersState, setUsersState] = useState(null);
  const authUserName = useSelector(getAuthenticatedUserName);

  const getVotingInfo = async () => {
    const [acc] = await dHive.database.getAccounts([authUserName]);
    const rc = await dHive.rc.getRCMana(authUserName, acc);
    const waivVotingMana = await ApiClient.getWaivVoteMana(authUserName, acc);
    const waivPowerBar = waivVotingMana ? calculateMana(waivVotingMana) : null;
    const resourceCredits = rc.percentage * 0.01 || 0;

    setUsersState({
      waivPowerMana: waivPowerBar?.votingPower ? waivPowerBar.votingPower : 100,
      resourceCredits,
    });
  };

  useEffect(() => {
    getVotingInfo();
  }, []);

  return (
    <div>
      {usersState && (
        <p>
          <b>
            {intl.formatMessage({
              id: 'users_up_state',
              defaultMessage: "User's up-to-date state",
            })}
            :
          </b>{' '}
          <div>WAIV upvoting mana: {round(usersState.waivPowerMana, 2)}%</div>
          <div>Resource credits: {round(usersState.resourceCredits, 2)}%</div>
        </p>
      )}
      <p>
        <b>{intl.formatMessage({ id: 'disclaimer', defaultMessage: 'Disclaimer' })}:</b>{' '}
        {intl.formatMessage({
          id: 'data_import_service',
          defaultMessage: 'The Data import bot service is provided on as-is / as-available basis.',
        })}
      </p>
    </div>
  );
};

VoteInfoBlock.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(VoteInfoBlock);
