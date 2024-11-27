import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import MatchBotsService from '../../rewards/MatchBots/MatchBotsService';
import MatchBotsTitle from '../../rewards/MatchBots/MatchBotsTitle';
import ChangeVotingModal from '../../widgets/ChangeVotingModal/ChangeVotingModal';
import DynamicTbl from '../Tools/DynamicTable/DynamicTable';
import { configMessageBotHistoryTable, configMessageBotTable } from '../DataImport/tableConfig';
import { MATCH_BOTS_TYPES } from '../../../common/helpers/matchBotsHelpers';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';

import {
  changeMessageBotRc,
  changeMessages,
  deleteMessage,
  getHistoryMessageBot,
  getMessageBotRc,
  getMessagesList,
} from '../../../waivioApi/importApi';
import { closeImportSoket, getImportUpdate } from '../../../store/settingsStore/settingsActions';
import VoteInfoBlock from '../DataImport/VoteInfoBlock';
import MessageBotImportModal from './MessageBotImportModal';
import '../DataImport/DataImport.less';
import './MessageBot.less';

const limit = 30;

const MessageBot = ({ intl }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const isGuest = useSelector(isGuestUser);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [visibleVoting, setVisibleVoting] = useState(false);
  const [votingValue, setVotingValue] = useState(100);
  const [messages, setMessages] = useState([]);
  const [hasMoreImports, setHasMoreImports] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const setListAndSetHasMore = (res, list, isLoadMore, setObjs, setMoreObjs) => {
    if (res.length > limit) {
      setMoreObjs(true);
      setObjs(isLoadMore ? [...list, ...res.slice(0, -1)] : res.slice(0, -1));
    } else {
      setObjs(isLoadMore ? [...list, ...res] : res);
      setMoreObjs(false);
    }
  };

  const updateMessagesList = () =>
    getMessagesList(authUserName, 0, limit + 1).then(res => {
      setListAndSetHasMore(res, messages, false, setMessages, setHasMoreImports);
    });

  const updateImportDate = () => {
    getMessagesList(authUserName, 0, limit + 1).then(res => {
      getHistoryMessageBot(authUserName, 0, limit + 1).then(his => {
        setListAndSetHasMore(his, history, false, setHistory, setHasMoreHistory);
      });
      setListAndSetHasMore(res, messages, false, setMessages, setHasMoreImports);
    });
  };

  const loadMoreImportDate = () =>
    getMessagesList(authUserName, messages.length, limit + 1).then(res => {
      setListAndSetHasMore(res, messages, true, setMessages, setHasMoreImports);
    });
  const loadMoreHistoryDate = () =>
    getHistoryMessageBot(authUserName, history.length, limit + 1).then(his => {
      setListAndSetHasMore(his, history, true, setHistory, setHasMoreHistory);
    });

  useEffect(() => {
    getMessageBotRc(authUserName).then(res => {
      setVotingValue(res.minRc / 100);
    });

    getMessagesList(authUserName, 0, limit + 1).then(res => {
      setListAndSetHasMore(res, messages, false, setMessages, setHasMoreImports);
    });
    getHistoryMessageBot(authUserName, 0, limit + 1).then(his => {
      setListAndSetHasMore(his, history, false, setHistory, setHasMoreHistory);
    });

    dispatch(getImportUpdate(updateImportDate));

    return () => dispatch(closeImportSoket());
  }, []);

  const toggleModal = () => setVisible(!visible);

  const toggleVotingModal = () => setVisibleVoting(!visibleVoting);

  const handleSetMinVotingPower = voting => {
    changeMessageBotRc(authUserName, voting * 100);
    setVotingValue(voting);
    toggleVotingModal();
  };

  const handleChangeStatus = (e, item) => {
    const status = ['active', 'waitingRecover', 'pending'].includes(item.status)
      ? 'onHold'
      : 'active';

    changeMessages(authUserName, status, item.importId).then(() => {
      getMessagesList(authUserName, 0, messages.length).then(res => {
        setMessages(res);
      });
    });
  };

  const handleDeleteObject = item => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'stop_message_bot',
        defaultMessage: 'Stop writing messages',
      }),
      content: intl.formatMessage({
        id: 'stop_json_message_bot',
        defaultMessage:
          'Once stopped, message writing cannot be resumed. To temporarily suspend/resume message writing, please consider using the Active checkbox.',
      }),
      onOk: () => {
        deleteMessage(authUserName, item.importId).then(() => {
          getMessagesList(authUserName, 0, messages.length).then(res => {
            setMessages(res);
          });
        });
      },
      okText: intl.formatMessage({ id: 'stop', defaultMessage: 'Stop' }),
      cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
    });
  };

  return (
    <div className="MessageBot">
      <MatchBotsTitle
        botType={MATCH_BOTS_TYPES.IMPORT}
        botTitle={intl.formatMessage({
          id: 'message_bot',
          defaultMessage: 'Message bot',
        })}
      />
      <p>
        {intl.formatMessage({
          id: 'message_bot_description1',
          defaultMessage:
            'This bot is designed to send messages in the form of threads to a specified group of users. This functionality ensures that your messages are effectively delivered to the right audience, enhancing engagement and relevance.',
        })}
      </p>

      <p>
        {intl.formatMessage({
          id: 'message_bot_description3',
          defaultMessage:
            'If the Resource credits on the account are insufficient to write a comment, the message bot will gradually recover and publish at a slower pace.',
        })}
      </p>
      <MatchBotsService botType={MATCH_BOTS_TYPES.IMPORT} botName={'message_bot'} onlyAuth />
      <p>
        {intl.formatMessage({
          id: isGuest ? 'guest_mana_threshold' : 'resource_credits_threshold',
          defaultMessage: isGuest ? 'Guest mana threshold' : 'Resource credits threshold',
        })}
        : {votingValue}% (
        <a onClick={toggleVotingModal}>
          {intl.formatMessage({ id: 'change', defaultMessage: 'change' })}
        </a>
        )
        <br />
        {intl.formatMessage({
          id: 'message_bot_pause',
          defaultMessage: `The Message bot will pause if RC on the account drops below the set threshold.`,
        })}
      </p>
      <VoteInfoBlock
        isRcBot
        info={intl.formatMessage({
          id: 'message_bot_service',
          defaultMessage: 'The Message bot service is provided on as-is / as-available basis.',
        })}
      />
      <hr />
      <Button type="primary" onClick={toggleModal}>
        {intl.formatMessage({ id: 'add_message', defaultMessage: 'Add message' })}
      </Button>
      <DynamicTbl
        handleShowMore={loadMoreImportDate}
        showMore={hasMoreImports}
        header={configMessageBotTable}
        bodyConfig={messages}
        onChange={handleChangeStatus}
        deleteItem={handleDeleteObject}
      />
      <h3>{intl.formatMessage({ id: 'history', defaultMessage: 'History' })}</h3>
      <DynamicTbl
        handleShowMore={loadMoreHistoryDate}
        showMore={hasMoreHistory}
        header={configMessageBotHistoryTable}
        bodyConfig={history}
      />
      {visible && (
        <MessageBotImportModal
          visible={visible}
          toggleModal={toggleModal}
          onClose={() => setVisible(false)}
          updateMessagesList={updateMessagesList}
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

MessageBot.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(MessageBot);
