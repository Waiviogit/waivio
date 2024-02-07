import React, { useEffect, useState } from 'react';
import { Button, Modal, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import MatchBotsService from '../../../rewards/MatchBots/MatchBotsService';
import MatchBotsTitle from '../../../rewards/MatchBots/MatchBotsTitle';

import ChangeVotingModal from '../../../widgets/ChangeVotingModal/ChangeVotingModal';
import DynamicTbl from '../../Tools/DynamicTable/DynamicTable';
import { configDuplicateListsHistoryTable, configDuplicateListsTable } from '../tableConfig';
import {
  MATCH_BOTS_TYPES,
  redirectAuthHiveSigner,
} from '../../../../common/helpers/matchBotsHelpers';
import {
  getAuthenticatedUserName,
  getIsConnectMatchBot,
} from '../../../../store/authStore/authSelectors';

import {
  deleteDuplicateList,
  getDuplicatedList,
  getHistoryDuplicatedList,
  getDuplicateVote,
  setDuplicateVote,
  setDuplicateList,
} from '../../../../waivioApi/importApi';
import { closeImportSoket, getImportUpdate } from '../../../../store/settingsStore/settingsActions';
import VoteInfoBlock from './../VoteInfoBlock';
import FindListModal from './FindListModal';

import './../DataImport.less';
import { getAccount } from '../../../../common/helpers/apiHelpers';
import { reload } from '../../../../store/authStore/authActions';

const limit = 30;

const DuplicateList = ({ intl }) => {
  const isStoreAuthBot = useSelector(state =>
    getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.IMPORT }),
  );
  const authUserName = useSelector(getAuthenticatedUserName);
  const dispatch = useDispatch();
  const handleRedirect = () => redirectAuthHiveSigner(isAuthBot, 'waivio.import');
  const [visible, setVisible] = useState(false);
  const [visibleVoting, setVisibleVoting] = useState(false);
  const [votingValue, setVotingValue] = useState(100);
  const [importedObject, setImportedObject] = useState([]);
  const [hasMoreImports, setHasMoreImports] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [history, setHistoryImportedObject] = useState([]);
  const [isAuthBot, setIsAuth] = useState(isStoreAuthBot);
  const setListAndSetHasMore = (res, list, isLoadMore, setObjs, setMoreObjs) => {
    if (res.length > limit) {
      setMoreObjs(true);
      setObjs(isLoadMore ? [...list, ...res.slice(0, -1)] : res.slice(0, -1));
    } else {
      setObjs(isLoadMore ? [...list, ...res] : res);
      setMoreObjs(false);
    }
  };

  const updateDuplicatedListDate = () => {
    getDuplicatedList(authUserName, 0, limit + 1).then(res => {
      getHistoryDuplicatedList(authUserName, 0, limit + 1).then(his => {
        setListAndSetHasMore(his, history, false, setHistoryImportedObject, setHasMoreHistory);
      });
      setListAndSetHasMore(res, importedObject, false, setImportedObject, setHasMoreImports);
    });
  };

  const loadMoreImportDate = () =>
    getDuplicatedList(authUserName, importedObject.length, limit + 1).then(res => {
      setListAndSetHasMore(res, importedObject, true, setImportedObject, setHasMoreImports);
    });
  const loadMoreHistoryDate = () =>
    getHistoryDuplicatedList(authUserName, history.length, limit + 1).then(his => {
      setListAndSetHasMore(his, history, true, setHistoryImportedObject, setHasMoreHistory);
    });

  useEffect(() => {
    getDuplicateVote(authUserName).then(res => {
      setVotingValue(res.minVotingPower / 100);
    });

    getDuplicatedList(authUserName, 0, limit + 1).then(res => {
      setListAndSetHasMore(res, importedObject, false, setImportedObject, setHasMoreImports);
    });
    getHistoryDuplicatedList(authUserName, 0, limit + 1).then(his => {
      setListAndSetHasMore(his, history, false, setHistoryImportedObject, setHasMoreHistory);
    });

    dispatch(getImportUpdate(updateDuplicatedListDate));
    getAccount(authUserName).then(
      r =>
        setIsAuth(r?.posting?.account_auths?.some(acc => acc[0] === MATCH_BOTS_TYPES.IMPORT)) ||
        isStoreAuthBot,
    );
    if (isStoreAuthBot !== isAuthBot) {
      dispatch(reload());
    }

    return () => dispatch(closeImportSoket());
  }, []);

  const toggleModal = () => setVisible(!visible);

  const toggleVotingModal = () => setVisibleVoting(!visibleVoting);

  const handleSetMinVotingPower = voting => {
    setDuplicateVote(authUserName, voting * 100);
    setVotingValue(voting);
    toggleVotingModal();
  };

  const handleChangeStatus = (e, item) => {
    const status = item.status === 'active' ? 'onHold' : 'active';

    setDuplicateList(authUserName, status, item.importId).then(() => {
      getDuplicatedList(authUserName, 0, importedObject.length).then(res => {
        setImportedObject(res);
      });
    });
  };

  const handleDeleteObject = item => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'stop_list_duplicator',
        defaultMessage: 'Stop list duplication',
      }),
      content: intl.formatMessage({
        id: 'stop_list_duplicator_message',
        defaultMessage:
          'Once stopped, the list duplication cannot be resumed. To temporarily suspend/resume the list duplication, please consider using the Active checkbox.',
      }),
      onOk: () => {
        deleteDuplicateList(authUserName, item.importId).then(() => {
          getDuplicatedList(authUserName, 0, importedObject.length).then(res => {
            setImportedObject(res);
          });
        });
      },
      okText: intl.formatMessage({ id: 'stop', defaultMessage: 'Stop' }),
      cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
    });
  };

  return (
    <div className="DataImport">
      <MatchBotsTitle
        botTitle={intl.formatMessage({
          id: 'list_duplicator_bot_title',
          defaultMessage: 'List duplication bot',
        })}
        botType={MATCH_BOTS_TYPES.IMPORT}
      />
      <p>
        {intl.formatMessage({
          id: 'list_duplicator_bot_description1',
          defaultMessage:
            'This bot creates copies of lists, including all embedded lists, and links to products or other objects. It uses ChatGPT to rewrite titles and descriptions for all lists.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'list_duplicator_bot_description2',
          defaultMessage:
            'Each update must be approved on behalf of the user with an upvote equivalent to $0.001 in WAIV power.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'list_duplicator_bot_description3',
          defaultMessage:
            'If the WAIV power on the account is insufficient to cast a $0.001 USD vote, or if the WAIV power reaches the specified threshold, the list duplication process will continue at a slower pace.',
        })}
      </p>
      <MatchBotsService botType={MATCH_BOTS_TYPES.IMPORT} botName={'list_duplicator'} onlyAuth />
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
          id: 'list_duplication_pause',
          defaultMessage:
            'The list duplication bot will pause if WAIV voting power on the account drops below the set threshold.',
        })}
      </p>
      <VoteInfoBlock
        info={intl.formatMessage({
          id: 'list_duplicator_service',
          defaultMessage:
            'The List duplication bot service is provided on as-is / as-available basis.',
        })}
      />
      <hr />
      <Button type="primary" onClick={toggleModal}>
        {intl.formatMessage({ id: 'add_list', defaultMessage: 'Add list' })}
      </Button>
      <DynamicTbl
        handleShowMore={loadMoreImportDate}
        showMore={hasMoreImports}
        header={configDuplicateListsTable}
        bodyConfig={importedObject}
        onChange={handleChangeStatus}
        deleteItem={handleDeleteObject}
      />
      <h3>{intl.formatMessage({ id: 'history', defaultMessage: 'History' })}</h3>
      <DynamicTbl
        handleShowMore={loadMoreHistoryDate}
        showMore={hasMoreHistory}
        header={configDuplicateListsHistoryTable}
        bodyConfig={history.map(item => ({
          ...item,
          baseObject: item?.lists?.length,
        }))}
      />
      {visible && (
        <FindListModal
          visible={visible}
          onClose={() => setVisible(false)}
          updateDepartmentsList={updateDuplicatedListDate}
        />
      )}
      {visibleVoting && (
        <ChangeVotingModal
          handleSetMinVotingPower={handleSetMinVotingPower}
          visible={visibleVoting}
          handleOpenVoteModal={toggleVotingModal}
          minVotingPower={votingValue}
        />
      )}
    </div>
  );
};

DuplicateList.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(DuplicateList);
