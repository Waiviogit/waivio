import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { MATCH_BOTS_TYPES } from '../../../common/helpers/matchBotsHelpers';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import MatchBotsService from '../../rewards/MatchBots/MatchBotsService';
import MatchBotsTitle from '../../rewards/MatchBots/MatchBotsTitle';
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
import { closeImportSoket, getImportUpdate } from '../../../store/settingsStore/settingsActions';

import './ClaimAthorityBot.less';

const limit = 30;

const ClaimAthorityBot = ({ intl }) => {
  // const isStoreAuthBot = useSelector(state =>
  //   getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.IMPORT }),
  // );
  const authUserName = useSelector(getAuthenticatedUserName);
  const isGuest = useSelector(isGuestUser);
  const dispatch = useDispatch();
  const [votingValue, setVotingValue] = useState(100);
  const [visibleVoting, setVisibleVoting] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);
  const [history, setHistoryAuthoritiesObject] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [hasMoreAuthorities, setHasMoreAuthorities] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const setListAndSetHasMore = (res, list, isLoadMore, setObjs, setMoreObjs) => {
    if (res.length > limit) {
      setMoreObjs(true);
      setObjs(isLoadMore ? [...list, ...res.slice(0, -1)] : res.slice(0, -1));
    } else {
      setObjs(isLoadMore ? [...list, ...res] : res);
      setMoreObjs(false);
    }
  };

  const getAthList = () =>
    getAuthorityList(authUserName, 0, limit + 1).then(res => {
      setListAndSetHasMore(res, authorities, false, setAuthorities, setHasMoreAuthorities);
    });
  const getHistory = () =>
    getHistoryAuthorityObjects(authUserName, 0, limit + 1).then(his => {
      setListAndSetHasMore(his, history, false, setHistoryAuthoritiesObject, setHasMoreHistory);
    });

  const loadMoreAuthorityDate = () =>
    getAuthorityList(authUserName, authorities.length, limit + 1).then(res => {
      setListAndSetHasMore(res, authorities, true, setAuthorities, setHasMoreAuthorities);
    });
  const loadMoreHistoryDate = () =>
    getHistoryAuthorityObjects(authUserName, history.length, limit + 1).then(his => {
      setListAndSetHasMore(his, history, true, setHistoryAuthoritiesObject, setHasMoreHistory);
    });

  useEffect(() => {
    getAthorityVote(authUserName).then(res => {
      if (res.minVotingPower) setVotingValue(res.minVotingPower / 100);
    });

    getAthList();
    getHistory();

    dispatch(getImportUpdate(getAthList));

    return () => dispatch(closeImportSoket());
  }, []);

  // const handleRedirect = () => {
  //   redirectAuthHiveSigner(isStoreAuthBot, 'waivio.import');
  // };

  const handleDeleteAuthority = item => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'stop_claim_authority',
        defaultMessage: 'Stop claim authority',
      }),
      content: intl.formatMessage({
        id: 'stop_claim_authority_message',
        defaultMessage:
          'Once stopped, the claim authority cannot be resumed. To temporarily suspend/resume the claim authority, please consider using the Active checkbox.',
      }),
      onOk: () => {
        deleteAuthority(authUserName, item?.importId).then(() => {
          getAuthorityList(authUserName, 0, authorities.length).then(res => {
            setAuthorities(res);
          });
        });
      },
      okText: intl.formatMessage({ id: 'stop_claim_ok_button', defaultMessage: 'Stop claim' }),
      cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
    });
  };

  const handleChangeStatusAuthority = (e, item) => {
    const status = item.status === 'active' ? 'onHold' : 'active';

    changeAuthority(authUserName, status, item.importId).then(() => {
      getAuthorityList(authUserName, 0, authorities.length).then(res => {
        setAuthorities(res);
      });
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
      <MatchBotsTitle
        botType={MATCH_BOTS_TYPES.IMPORT}
        botTitle={intl.formatMessage({
          id: 'claim_authority_bot',
          defaultMessage: 'Claim authority bot',
        })}
      />
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
      <MatchBotsService
        botType={MATCH_BOTS_TYPES.IMPORT}
        botName={MATCH_BOTS_TYPES.IMPORT}
        onlyAuth
      />
      <p>
        {intl.formatMessage({
          id: isGuest ? 'guest_mana_threshold' : 'waiv_voting_power_threshold',
          defaultMessage: isGuest ? 'Guest mana threshold' : 'WAIV voting power threshold',
        })}
        : {votingValue}% (
        <a onClick={toggleVotingModal}>
          {intl.formatMessage({ id: 'change', defaultMessage: 'change' })}
        </a>
        )
        <br />
        {intl.formatMessage({
          id: isGuest ? 'guest_claim_authority_pause' : 'claim_authority_pause',
          defaultMessage: `The claim authority bot will pause if ${
            isGuest ? 'guest mana' : 'WAIV voting power'
          } on the account drops below the set threshold.`,
        })}
      </p>
      <VoteInfoBlock
        info={intl.formatMessage({
          id: 'claim_authority_service',
          defaultMessage:
            'The Claim authority bot service is provided on as-is / as-available basis.',
        })}
      />
      <hr />
      <Button type="primary" onClick={() => setOpenClaim(true)}>
        {intl.formatMessage({ id: 'claim_authority', defaultMessage: 'Claim authority' })}
      </Button>
      <DynamicTbl
        handleShowMore={loadMoreAuthorityDate}
        showMore={hasMoreAuthorities}
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
      <DynamicTbl
        handleShowMore={loadMoreHistoryDate}
        showMore={hasMoreHistory}
        header={configAthorityBotHistoryTable}
        bodyConfig={history}
      />
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
          updateAuthorityList={getAthList}
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
