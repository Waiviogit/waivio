import React, { useState, useEffect } from 'react';
import { Button, Modal, Switch } from 'antd';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { MATCH_BOTS_TYPES } from '../../../common/helpers/matchBotsHelpers';
import MatchBotsService from '../../rewards/MatchBots/MatchBotsService';
import MatchBotsTitle from '../../rewards/MatchBots/MatchBotsTitle';
import VoteInfoBlock from '../DataImport/VoteInfoBlock';
import DynamicTbl from '../Tools/DynamicTable/DynamicTable';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import {
  configDescriptionsBotHistoryTable,
  configDescriptionsBotProductTable,
} from '../DataImport/tableConfig';
import ChangeVotingModal from '../../widgets/ChangeVotingModal/ChangeVotingModal';
import {
  changeDescriptions,
  deleteDescriptions,
  getDescriptionsList,
  getDescriptionsVote,
  getHistoryDescriptionsObjects,
  setDescriptionsBotVote,
} from '../../../waivioApi/importApi';
import { closeImportSoket, getImportUpdate } from '../../../store/settingsStore/settingsActions';
import FindDescriptionsModal from './FindDescriptionsModal';
import './DescriptionsBot.less';

const limit = 30;
const DescrioptionsBot = ({ intl }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const dispatch = useDispatch();
  const [votingValue, setVotingValue] = useState(100);
  const [visibleVoting, setVisibleVoting] = useState(false);
  const [openDepModal, setOpenDepModal] = useState(false);
  const [history, setHistoryDescriptionsObject] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [hasMoreDescriptions, setHasMoreDescriptions] = useState(false);
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

  const getDescrsList = () =>
    getDescriptionsList(authUserName, 0, limit + 1).then(res => {
      setListAndSetHasMore(res, descriptions, false, setDescriptions, setHasMoreDescriptions);
    });

  const getHistory = () =>
    getHistoryDescriptionsObjects(authUserName, 0, limit + 1).then(his => {
      setListAndSetHasMore(his, history, false, setHistoryDescriptionsObject, setHasMoreHistory);
    });

  const getAllDataUpdated = () => {
    getDescrsList();
    getHistory();
  };

  const loadMoreDescriptionsData = () =>
    getDescriptionsList(authUserName, descriptions.length, limit + 1).then(res => {
      setListAndSetHasMore(res, descriptions, true, setDescriptions, setHasMoreDescriptions);
    });

  const loadMoreHistoryData = () =>
    getHistoryDescriptionsObjects(authUserName, history.length, limit + 1).then(his => {
      setListAndSetHasMore(his, history, true, setHistoryDescriptionsObject, setHasMoreHistory);
    });

  useEffect(() => {
    getDescriptionsVote(authUserName).then(res => {
      if (res.minVotingPower) setVotingValue(res.minVotingPower / 100);
    });

    getAllDataUpdated();

    dispatch(getImportUpdate(getAllDataUpdated));

    return () => dispatch(closeImportSoket());
  }, []);

  const handleDeleteDescription = item => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'stop_rewrite_description',
        defaultMessage: 'Stop rewrite description',
      }),
      content: intl.formatMessage({
        id: 'stop_rewrite_description_message',
        defaultMessage:
          'Once stopped, the description bot cannot be resumed. To temporarily suspend/resume the rewrite description, please consider using the Active checkbox.',
      }),
      onOk: () => {
        deleteDescriptions(authUserName, item?.importId).then(() => {
          getDescriptionsList(authUserName, 0, descriptions.length).then(res => {
            setDescriptions(res);
          });
        });
      },
      okText: intl.formatMessage({ id: 'stop_update_button', defaultMessage: 'Stop update' }),
      cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
    });
  };
  const handleChangeStatusDescriptions = (e, item) => {
    const status = item.status === 'active' ? 'onHold' : 'active';

    changeDescriptions(authUserName, status, item.importId).then(() => {
      getDescriptionsList(authUserName, 0, descriptions.length).then(res => {
        setDescriptions(res);
      });
    });
  };

  const toggleVotingModal = () => setVisibleVoting(!visibleVoting);

  const handleSetMinVotingPower = voting => {
    setDescriptionsBotVote(authUserName, voting * 100);
    setVotingValue(voting);
    toggleVotingModal();
  };

  return (
    <div className="DescriptionsBot">
      <MatchBotsTitle
        botTitle={intl.formatMessage({
          id: 'descriptions_bot',
          defaultMessage: 'Descriptions bot',
        })}
        botType={MATCH_BOTS_TYPES.IMPORT}
      />
      <p>
        {intl.formatMessage({
          id: 'descriptions_bot_main_text',
          defaultMessage:
            'This bot utilizes ChatGPT to rewrite titles and descriptions for all embedded lists, as well as names and descriptions for all objects linked from these lists. If the same user repeats this process, it will only be completed for lists and objects added since the last session.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'departments_update_bot_part2',
          defaultMessage:
            'Each update must be approved on behalf of the user with an upvote equivalent to $0.001 in WAIV power.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'departments_update_bot_part3',
          defaultMessage:
            "If the account's WAIV power drops below $0.001 USD, or if the WAIV power reaches the predetermined threshold, the bot will proceed at a slower speed.",
        })}
      </p>
      <MatchBotsService botName={'descriptions'} botType={MATCH_BOTS_TYPES.IMPORT} />
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
          id: 'descriptions_bot_voting_text',
          defaultMessage:
            'The descriptions bot will pause if WAIV voting power on the account drops below the set threshold.',
        })}
      </p>
      <VoteInfoBlock
        info={intl.formatMessage({
          id: 'descriptions_bot_service_provided',
          defaultMessage: 'The Descriptions bot service is provided on as-is / as-available basis.',
        })}
      />
      <hr />
      <Button type="primary" onClick={() => setOpenDepModal(true)}>
        {intl.formatMessage({ id: 'rewrite_descriptions', defaultMessage: 'Rewrite descriptions' })}
      </Button>
      <DynamicTbl
        handleShowMore={loadMoreDescriptionsData}
        showMore={hasMoreDescriptions}
        header={configDescriptionsBotProductTable}
        bodyConfig={descriptions}
        deleteItem={handleDeleteDescription}
        onChange={handleChangeStatusDescriptions}
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
        header={configDescriptionsBotHistoryTable}
        bodyConfig={
          !isEmpty(history) ? history?.map(item => ({ ...item, lists: [item?.baseList] })) : []
        }
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
        <FindDescriptionsModal
          updateDescriptionsList={getDescrsList}
          visible={openDepModal}
          onClose={() => setOpenDepModal(false)}
        />
      )}
    </div>
  );
};

DescrioptionsBot.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(DescrioptionsBot);
