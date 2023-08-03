import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Modal, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { MATCH_BOTS_TYPES, redirectAuthHiveSigner } from '../../../common/helpers/matchBotsHelpers';
import {
  getAuthenticatedUserName,
  getIsConnectMatchBot,
} from '../../../store/authStore/authSelectors';
import ChangeVotingModal from '../../widgets/ChangeVotingModal/ChangeVotingModal';
import {
  changeAuthority,
  deleteAuthority,
  getAthorityVote,
  getAuthorityList,
  getHistoryAuthorityObjects,
  setClaimAuthorityVote,
} from '../../../waivioApi/importApi';
import DynamicTbl from '../Tools/DynamicTable/DynamicTable';
import {
  configAthorityBotHistoryTable,
  configAthorityBotProductTable,
} from '../DataImport/tableConfig';
import FindClaimAthorityModal from './FindClaimAthorityModal';
import VoteInfoBlock from '../DataImport/VoteInfoBlock';

import './ClaimAthorityBot.less';
import { closeImportSoket, getImportUpdate } from '../../../store/settingsStore/settingsActions';

const ClaimAthorityBot = ({ intl }) => {
  const isAuthBot = useSelector(state =>
    getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.IMPORT }),
  );
  const authUserName = useSelector(getAuthenticatedUserName);
  const [votingValue, setVotingValue] = useState(100);
  const [visibleVoting, setVisibleVoting] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);
  const [history, setHistoryImportedObject] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const dispatch = useDispatch();
  const updateAuthorityList = () => {
    getAuthorityList(authUserName).then(res => {
      setAuthorities(res);
    });
    getHistoryAuthorityObjects(authUserName).then(his => {
      setHistoryImportedObject(his);
    });
  };

  useEffect(() => {
    getAthorityVote(authUserName).then(res => {
      if (res.minVotingPower) setVotingValue(res.minVotingPower / 100);
    });

    updateAuthorityList();

    dispatch(getImportUpdate(updateAuthorityList));

    return () => dispatch(closeImportSoket());
  }, []);

  const handleRedirect = () => redirectAuthHiveSigner(isAuthBot, 'waivio.import');

  const handleDeleteAuthority = item => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'stop_claim_authority',
        defaultMessage: 'Stop claim authority',
      }),
      content: intl.formatMessage({
        id: 'stop_claim_authority_message',
        defaultMessage:
          'Once stopped, the claim authority cannot be resumed. To temporarily suspend/resume the data import, please consider using the Active checkbox.',
      }),
      onOk: () => {
        deleteAuthority(authUserName, item?.importId).then(() => {
          updateAuthorityList();
        });
      },
      okText: intl.formatMessage({ id: 'stop_claim_ok_button', defaultMessage: 'Stop claim' }),
      cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
    });
  };

  const handleChangeStatusAuthority = (e, item) => {
    const status = item.status === 'active' ? 'onHold' : 'active';

    changeAuthority(authUserName, status, item.importId).then(() => {
      updateAuthorityList();
    });
  };

  const toggleVotingModal = () => setVisibleVoting(!visibleVoting);

  const handleSetMinVotingPower = voting => {
    setClaimAuthorityVote(authUserName, voting * 100);
    setVotingValue(voting);
    toggleVotingModal();
  };

  return (
    <div className="ClaimAthorityBot">
      <div className="ClaimAthorityBot__title">
        <h2>
          {intl.formatMessage({ id: 'claim_authority_bot', defaultMessage: 'Claim authority bot' })}
        </h2>
        <Switch checked={isAuthBot} onChange={handleRedirect} />
      </div>
      <p>
        {intl.formatMessage({
          id: 'search_functionality_custom',
          defaultMessage:
            'The search functionality on custom websites is restricted to objects that are claimed by the website owner and trusted authorities (objected added to their profile shops). This tool simplifies the process of claiming administrative ownership over all products, their variations mentioned in the specified list, and all embedded lists.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'claim_must_be_approved',
          defaultMessage:
            'Each claim must be approved by the user with an upvote equivalent to $0.001 in WAIV power.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'account_WAIV_power',
          defaultMessage:
            "If the account's WAIV power drops below $0.001 USD, or if the WAIV power reaches the predetermined threshold, the authority claiming process will proceed at a slower speed.",
        })}
      </p>
      <hr />
      <p>
        <b>
          {intl.formatMessage({
            id: 'data_import_requires_auth',
            defaultMessage:
              'The Data import bot requires authorization to upvote data updates on your behalf',
          })}
          :{' '}
          <a onClick={handleRedirect}>
            {isAuthBot
              ? intl.formatMessage({
                  id: 'match_bots_unauth_link',
                  defaultMessage: 'Remove authorization',
                })
              : intl.formatMessage({ id: 'match_bots_auth_link', defaultMessage: 'Authorize now' })}
          </a>
        </b>
        <br />
        <b>
          {intl.formatMessage({
            id: 'matchBot_authorization_completed_steemconnect_can_revoked_any_time',
            defaultMessage:
              'The authorization is completed via HiveSigner and can be revoked at any time.',
          })}
        </b>
      </p>
      <p>
        {intl.formatMessage({
          id: 'waiv_voting_power_threshold',
          defaultMessage: 'WAIV voting power threshold',
        })}
        : {votingValue}% (
        <a onClick={toggleVotingModal}>
          {intl.formatMessage({ id: 'change', defaultMessage: 'change' })}
        </a>
        )
        <br />
        {intl.formatMessage({
          id: 'data_import_pause',
          defaultMessage:
            'The data import bot will pause if WAIV voting power on the account drops below the set threshold.',
        })}
      </p>
      <VoteInfoBlock />
      <hr />
      <Button type="primary" onClick={() => setOpenClaim(true)}>
        {intl.formatMessage({ id: 'claim_authority', defaultMessage: 'Claim authority' })}
      </Button>
      <DynamicTbl
        header={configAthorityBotProductTable}
        bodyConfig={authorities}
        deleteItem={handleDeleteAuthority}
        onChange={handleChangeStatusAuthority}
      />
      <h3>
        {intl.formatMessage({
          id: 'history',
          defaultMessage: 'History',
        })}
      </h3>
      <DynamicTbl header={configAthorityBotHistoryTable} bodyConfig={history} />
      {visibleVoting && (
        <ChangeVotingModal
          handleSetMinVotingPower={handleSetMinVotingPower}
          visible={visibleVoting}
          handleOpenVoteModal={toggleVotingModal}
          minVotingPower={votingValue}
        />
      )}
      {openClaim && (
        <FindClaimAthorityModal
          updateAuthorityList={updateAuthorityList}
          visible={openClaim}
          onClose={() => setOpenClaim(false)}
        />
      )}
    </div>
  );
};

ClaimAthorityBot.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(ClaimAthorityBot);
