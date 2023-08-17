import React, { useState, useEffect } from 'react';
import { Button, Modal, Switch } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import VoteInfoBlock from '../DataImport/VoteInfoBlock';
import DynamicTbl from '../Tools/DynamicTable/DynamicTable';
import {
  getAuthenticatedUserName,
  getIsConnectMatchBot,
} from '../../../store/authStore/authSelectors';
import { MATCH_BOTS_TYPES, redirectAuthHiveSigner } from '../../../common/helpers/matchBotsHelpers';
import FindDepartmentsModal from './FindDepartmentsModal';
import {
  configDepartmentsBotHistoryTable,
  configDepartmentsBotProductTable,
} from '../DataImport/tableConfig';
import ChangeVotingModal from '../../widgets/ChangeVotingModal/ChangeVotingModal';
import {
  changeDepartments,
  deleteDepartments,
  getAuthorityList,
  getDepartmentsList,
  getDepartmentsVote,
  getHistoryDepartmentsObjects,
  setDepartmentsBotVote,
} from '../../../waivioApi/importApi';

import './DepartmentsBot.less';
import { closeImportSoket, getImportUpdate } from '../../../store/settingsStore/settingsActions';

const limit = 30;
const DepartmentsBot = ({ intl }) => {
  const isDepartmentsBot = useSelector(state =>
    getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.IMPORT }),
  );
  const authUserName = useSelector(getAuthenticatedUserName);
  const dispatch = useDispatch();
  const [votingValue, setVotingValue] = useState(100);
  const [visibleVoting, setVisibleVoting] = useState(false);
  const [openDepModal, setOpenDepModal] = useState(false);
  const [history, setHistoryDepartmentsObject] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [hasMoreDepartments, setHasMoreDepartments] = useState(false);
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

  const getDepsList = () =>
    getDepartmentsList(authUserName, 0, limit + 1).then(res => {
      setListAndSetHasMore(res, departments, false, setDepartments, setHasMoreDepartments);
    });

  const getHistory = () =>
    getHistoryDepartmentsObjects(authUserName, 0, limit + 1).then(his => {
      setListAndSetHasMore(his, history, false, setHistoryDepartmentsObject, setHasMoreHistory);
    });

  const loadMoreDepartmentsData = () =>
    getAuthorityList(authUserName, departments.length, limit + 1).then(res => {
      setListAndSetHasMore(res, departments, true, setDepartments, setHasMoreDepartments);
    });

  const loadMoreHistoryData = () =>
    getHistoryDepartmentsObjects(authUserName, history.length, limit + 1).then(his => {
      setListAndSetHasMore(his, history, true, setHistoryDepartmentsObject, setHasMoreHistory);
    });

  useEffect(() => {
    getDepartmentsVote(authUserName).then(res => {
      if (res.minVotingPower) setVotingValue(res.minVotingPower / 100);
    });

    getDepsList();
    getHistory();

    dispatch(getImportUpdate(getDepsList));

    return () => dispatch(closeImportSoket());
  }, []);

  const handleRedirect = () => redirectAuthHiveSigner(isDepartmentsBot, 'waivio.import');

  const handleDeleteDepartment = item => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'stop_update_department',
        defaultMessage: 'Stop update department',
      }),
      content: intl.formatMessage({
        id: 'stop_update_department_message',
        defaultMessage:
          'Once stopped, the update department cannot be resumed. To temporarily suspend/resume the update department, please consider using the Active checkbox.',
      }),
      onOk: () => {
        deleteDepartments(authUserName, item?.importId).then(() => {
          getDepartmentsList(authUserName, 0, departments.length).then(res => {
            setDepartments(res);
          });
        });
      },
      okText: intl.formatMessage({ id: 'stop_claim_ok_button', defaultMessage: 'Stop claim' }),
      cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
    });
  };
  const handleChangeStatusDepartments = (e, item) => {
    const status = item.status === 'active' ? 'onHold' : 'active';

    changeDepartments(authUserName, status, item.importId).then(() => {
      getDepartmentsList(authUserName, 0, departments.length).then(res => {
        setDepartments(res);
      });
    });
  };

  const toggleVotingModal = () => setVisibleVoting(!visibleVoting);

  const handleSetMinVotingPower = voting => {
    setDepartmentsBotVote(authUserName, voting * 100);
    setVotingValue(voting);
    toggleVotingModal();
  };

  return (
    <div className="DepartmentsBot">
      <div className="DepartmentsBot__title">
        <h2>
          {intl.formatMessage({
            id: 'departments_update_bot',
            defaultMessage: 'Departments update bot',
          })}
        </h2>
        <Switch checked={isDepartmentsBot} onChange={handleRedirect} />
      </div>
      <p>
        This tool designed to automatically categorize products into departments using hierarchical
        structure of connected lists. This bot uses the names of the lists and sub-lists within them
        and assigns these names as departments for all products referenced in these lists.
      </p>
      <p>
        Each update must be approved on behalf of the user with an upvote equivalent to $0.001 in
        WAIV power.
      </p>
      <p>
        If the account&apos;s WAIV power drops below $0.001 USD, or if the WAIV power reaches the
        predetermined threshold, the bot will proceed at a slower speed.
      </p>
      <hr />
      <p>
        <b>
          {intl.formatMessage({
            id: 'department_requires_auth',
            defaultMessage:
              'The Departments update bot requires authorization to upvote data updates on your behalf',
          })}
          :{' '}
          <a onClick={handleRedirect}>
            {isDepartmentsBot
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
          id: 'departments_pause',
          defaultMessage:
            'The departments update bot will pause if WAIV voting power on the account drops below the set threshold.',
        })}
      </p>
      <VoteInfoBlock
        info={intl.formatMessage({
          id: 'departments_service',
          defaultMessage:
            'The Departments update bot service is provided on as-is / as-available basis.',
        })}
      />
      <hr />
      <Button type="primary" onClick={() => setOpenDepModal(true)}>
        {intl.formatMessage({ id: 'update_departments', defaultMessage: 'Update departments' })}
      </Button>
      <DynamicTbl
        handleShowMore={loadMoreDepartmentsData}
        showMore={hasMoreDepartments}
        header={configDepartmentsBotProductTable}
        bodyConfig={departments}
        deleteItem={handleDeleteDepartment}
        onChange={handleChangeStatusDepartments}
      />
      <h3>
        {intl.formatMessage({
          id: 'history',
          defaultMessage: 'History',
        })}
      </h3>
      <DynamicTbl
        handleShowMore={loadMoreHistoryData}
        showMore={hasMoreHistory}
        header={configDepartmentsBotHistoryTable}
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
      {openDepModal && (
        <FindDepartmentsModal
          updateDepartmentsList={getDepsList}
          visible={openDepModal}
          onClose={() => setOpenDepModal(false)}
        />
      )}
    </div>
  );
};

DepartmentsBot.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(DepartmentsBot);
