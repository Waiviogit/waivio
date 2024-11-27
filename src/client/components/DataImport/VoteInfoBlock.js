import React, { useEffect, useState } from 'react';
import { round } from 'lodash';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { calculateMana, dHive } from '../../vendor/steemitHelpers';
import * as ApiClient from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';

const VoteInfoBlock = ({ intl, info, isRcBot }) => {
  const [usersState, setUsersState] = useState(null);
  const authUserName = useSelector(getAuthenticatedUserName);
  const isGuest = useSelector(isGuestUser);

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
      {isGuest && usersState && (
        <p>
          {' '}
          <b>
            {intl.formatMessage({
              id: 'status_of_the_user_account',
              defaultMessage: 'Status of the user account',
            })}
            :
          </b>{' '}
          <p>Guest mana: {usersState.guestMana}%</p>
        </p>
      )}
      {usersState && !isGuest && (
        <p>
          <b>
            {intl.formatMessage({
              id: 'status_of_the_user_account',
              defaultMessage: 'Status of the user account',
            })}
            :
          </b>{' '}
          {!isRcBot && (
            <div>
              {intl.formatMessage({
                id: 'waiv_upvoting_mana',
                defaultMessage: 'WAIV upvoting mana',
              })}
              : {round(usersState.waivPowerMana, 2)}%
            </div>
          )}
          <div>
            {intl.formatMessage({ id: 'resource_credits', defaultMessage: 'Resource credits' })}:{' '}
            {round(usersState.resourceCredits, 2)}%
          </div>
        </p>
      )}
      <p>
        <b>{intl.formatMessage({ id: 'disclaimer', defaultMessage: 'Disclaimer' })}:</b> {info}
      </p>
    </div>
  );
};

VoteInfoBlock.propTypes = {
  intl: PropTypes.shape(),
  info: PropTypes.string,
  isRcBot: PropTypes.bool,
};

export default injectIntl(VoteInfoBlock);
