import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';

import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import {
  changeTags,
  createTags,
  deleteTags,
  getHistoryTagsObjects,
  getTagsList,
  getTagsVote,
  setTagsBotVote,
} from '../../../waivioApi/importApi';
import { closeImportSoket, getImportUpdate } from '../../../store/settingsStore/settingsActions';
import MatchBotsTitle from '../../rewards/MatchBots/MatchBotsTitle';
import { MATCH_BOTS_TYPES } from '../../../common/helpers/matchBotsHelpers';
import MatchBotsService from '../../rewards/MatchBots/MatchBotsService';
import VoteInfoBlock from '../DataImport/VoteInfoBlock';
import DynamicTbl from '../Tools/DynamicTable/DynamicTable';
import { configTagsBotHistoryTable, configTagsBotProductTable } from '../DataImport/tableConfig';
import ChangeVotingModal from '../../widgets/ChangeVotingModal/ChangeVotingModal';
import FindDepartmentsModal from '../DepartmentsBot/FindDepartmentsModal';

const limit = 30;

const TagsBot = ({ intl }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const isGuest = useSelector(isGuestUser);
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
    getTagsList(authUserName, 0, limit + 1).then(res => {
      setListAndSetHasMore(res, departments, false, setDepartments, setHasMoreDepartments);
    });

  const getHistory = () =>
    getHistoryTagsObjects(authUserName, 0, limit + 1).then(his => {
      setListAndSetHasMore(his, history, false, setHistoryDepartmentsObject, setHasMoreHistory);
    });
  const getAllDataUpdated = () => {
    getDepsList();
    getHistory();
  };

  const loadMoreDepartmentsData = () =>
    getTagsList(authUserName, departments.length, limit + 1).then(res => {
      setListAndSetHasMore(res, departments, true, setDepartments, setHasMoreDepartments);
    });

  const loadMoreHistoryData = () =>
    getHistoryTagsObjects(authUserName, history.length, limit + 1).then(his => {
      setListAndSetHasMore(his, history, true, setHistoryDepartmentsObject, setHasMoreHistory);
    });

  useEffect(() => {
    getTagsVote(authUserName).then(res => {
      if (res.minVotingPower) setVotingValue(res.minVotingPower / 100);
    });

    getAllDataUpdated();

    dispatch(getImportUpdate(getAllDataUpdated));

    return () => dispatch(closeImportSoket());
  }, []);

  const handleDeleteDepartment = item => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'stop_update_tags',
        defaultMessage: 'Stop adding tags',
      }),
      content: intl.formatMessage({
        id: 'stop_update_tags_message',
        defaultMessage:
          'Once stopped, the tag bot cannot be resumed. To temporarily suspend/resume the adding tag, please consider using the Active checkbox.',
      }),
      onOk: () => {
        deleteTags(authUserName, item?.importId).then(() => {
          getAllDataUpdated();
        });
      },
      okText: intl.formatMessage({ id: 'stop_update_button', defaultMessage: 'Stop update' }),
      cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
    });
  };
  const handleChangeStatusDepartments = (e, item) => {
    const status = item.status === 'active' ? 'onHold' : 'active';

    changeTags(authUserName, status, item.importId).then(() => {
      getTagsList(authUserName, 0, departments.length).then(res => {
        setDepartments(res);
      });
    });
  };

  const toggleVotingModal = () => setVisibleVoting(!visibleVoting);

  const handleSetMinVotingPower = voting => {
    setTagsBotVote(authUserName, voting * 100);
    setVotingValue(voting);
    toggleVotingModal();
  };

  return (
    <div className="DepartmentsBot">
      <MatchBotsTitle
        botType={MATCH_BOTS_TYPES.IMPORT}
        botTitle={intl.formatMessage({
          id: 'tags_bot',
          defaultMessage: 'Tags bot',
        })}
      />
      <p>
        {intl.formatMessage({
          id: 'tags_bot_part1',
          defaultMessage:
            'This bot adds up to 10 relevant tags to products, businesses, and other objects referenced in a list or on a map. It uses ChatGPT to generate these tags.\n',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'tags_bot_part2',
          defaultMessage:
            'Each update must be approved on behalf of the user with an upvote equivalent to $0.0001 in WAIV power.\n',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'tags_bot_part3',
          defaultMessage:
            'If the WAIV power on the account is insufficient to cast a $0.0001 USD vote, or if the WAIV power reaches the specified threshold, the process of adding tags will continue at a slower pace.\n',
        })}
      </p>
      <MatchBotsService botType={MATCH_BOTS_TYPES.IMPORT} botName={'tags'} onlyAuth />
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
          id: isGuest ? 'guest_tags_pause' : 'tags_pause',
          defaultMessage: `The tags bot will pause bot will pause if ${
            isGuest ? 'guest mana' : 'WAIV voting power'
          } on the account drops below the set threshold.`,
        })}
      </p>
      <VoteInfoBlock
        info={intl.formatMessage({
          id: 'Tags_service',
          defaultMessage: 'The Tags bot service is provided on as-is / as-available basis.',
        })}
      />
      <hr />
      <Button type="primary" onClick={() => setOpenDepModal(true)}>
        {intl.formatMessage({ id: 'add_tags', defaultMessage: 'Add tags' })}
      </Button>
      <DynamicTbl
        handleShowMore={loadMoreDepartmentsData}
        showMore={hasMoreDepartments}
        header={configTagsBotProductTable}
        bodyConfig={departments.map(i => ({ ...i, lists: [i.baseList] }))}
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
        header={configTagsBotHistoryTable}
        bodyConfig={history.map(i => ({ ...i, lists: [i.baseList] }))}
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
          title={'Tags bot'}
          updateDepartmentsList={getDepsList}
          createTag={createTags}
          visible={openDepModal}
          onClose={() => setOpenDepModal(false)}
        />
      )}
    </div>
  );
};

TagsBot.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(TagsBot);
