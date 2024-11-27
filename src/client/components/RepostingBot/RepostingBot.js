import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import MatchBotsService from '../../rewards/MatchBots/MatchBotsService';
import MatchBotsTitle from '../../rewards/MatchBots/MatchBotsTitle';
import ChangeVotingModal from '../../widgets/ChangeVotingModal/ChangeVotingModal';
import DynamicTbl from '../Tools/DynamicTable/DynamicTable';
import { configRepostingBotHistoryTable, configRepostingBotTable } from '../DataImport/tableConfig';
import { MATCH_BOTS_TYPES } from '../../../common/helpers/matchBotsHelpers';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';

import {
  changeReposting,
  changeRepostingBotRc,
  deleteReposting,
  getHistoryRepostingBot,
  getRepostingBotHost,
  getRepostingBotRc,
  getRepostingList,
} from '../../../waivioApi/importApi';
import { closeImportSoket, getImportUpdate } from '../../../store/settingsStore/settingsActions';
import VoteInfoBlock from '../DataImport/VoteInfoBlock';
import RepostingBotImportModal from './RepostingBotImportModal';
import '../DataImport/DataImport.less';
import './RepostingBot.less';

const limit = 30;

export const DEFAULT_REPOSTING_HOST = 'www.waivio.com';

const RepostingBot = ({ intl }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const isGuest = useSelector(isGuestUser);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [visibleVoting, setVisibleVoting] = useState(false);
  const [votingValue, setVotingValue] = useState(100);
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [host, setHost] = useState('');

  const setListAndSetHasMore = (res, list, isLoadMore, setObjs, setMoreObjs) => {
    if (res.length > limit) {
      setMoreObjs(true);
      setObjs(isLoadMore ? [...list, ...res.slice(0, -1)] : res.slice(0, -1));
    } else {
      setObjs(isLoadMore ? [...list, ...res] : res);
      setMoreObjs(false);
    }
  };

  const updateRepostingList = () =>
    getRepostingList(authUserName, 0, limit + 1).then(res => {
      setListAndSetHasMore(res, posts, false, setPosts, setHasMorePosts);
    });

  const updateRepostingDate = () => {
    getRepostingList(authUserName, 0, limit + 1).then(res => {
      getHistoryRepostingBot(authUserName, 0, limit + 1).then(his => {
        setListAndSetHasMore(his, history, false, setHistory, setHasMoreHistory);
      });
      setListAndSetHasMore(res, posts, false, setPosts, setHasMorePosts);
    });
  };

  const loadMoreRepostingDate = () =>
    getRepostingList(authUserName, posts.length, limit + 1).then(res => {
      setListAndSetHasMore(res, posts, true, setPosts, setHasMorePosts);
    });
  const loadMoreHistoryDate = () =>
    getHistoryRepostingBot(authUserName, history.length, limit + 1).then(his => {
      setListAndSetHasMore(his, history, true, setHistory, setHasMoreHistory);
    });

  useEffect(() => {
    getRepostingBotRc(authUserName).then(res => {
      setVotingValue(res.minRc / 100);
    });

    getRepostingBotHost(authUserName).then(res =>
      setHost(isEmpty(res.host) ? DEFAULT_REPOSTING_HOST : res.host),
    );

    getRepostingList(authUserName, 0, limit + 1).then(res => {
      setListAndSetHasMore(res, posts, false, setPosts, setHasMorePosts());
    });
    getHistoryRepostingBot(authUserName, 0, limit + 1).then(his => {
      setListAndSetHasMore(his, history, false, setHistory, setHasMoreHistory);
    });

    dispatch(getImportUpdate(updateRepostingDate));

    return () => dispatch(closeImportSoket());
  }, []);

  const toggleModal = () => setVisible(!visible);

  const toggleVotingModal = () => setVisibleVoting(!visibleVoting);

  const handleSetMinVotingPower = voting => {
    changeRepostingBotRc(authUserName, voting * 100);
    setVotingValue(voting);
    toggleVotingModal();
  };

  const handleChangeStatus = (e, item) => {
    const status = ['active', 'waitingRecover', 'pending'].includes(item.status)
      ? 'onHold'
      : 'active';

    changeReposting(authUserName, status, item.importId).then(() => {
      getRepostingList(authUserName, 0, posts.length).then(res => {
        setPosts(res);
      });
    });
  };

  const handleDeleteObject = item => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'stop_reposting_bot',
        defaultMessage: 'Stop posts publishing',
      }),
      content: intl.formatMessage({
        id: 'stop_json_message_bot',
        defaultMessage:
          'Once stopped, posts publishing cannot be resumed. To temporarily suspend/resume posts publishing, please consider using the Active checkbox.',
      }),
      onOk: () => {
        deleteReposting(authUserName, item.importId).then(() => {
          getRepostingList(authUserName, 0, posts.length).then(res => {
            setPosts(res);
          });
        });
      },
      okText: intl.formatMessage({ id: 'stop', defaultMessage: 'Stop' }),
      cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
    });
  };

  return (
    <div className="ReposingBot">
      <MatchBotsTitle
        botType={MATCH_BOTS_TYPES.IMPORT}
        botTitle={intl.formatMessage({
          id: 'reposting_bot',
          defaultMessage: 'Reposting bot',
        })}
      />
      <p>
        {intl.formatMessage({
          id: 'reposting_bot_description1',
          defaultMessage:
            'This bot is designed to publish posts from various platforms to Waivio. By automating the reposting process using an extension, it ensures consistent content sharing, wider reach, and streamlined cross-platform engagement.',
        })}
      </p>

      <p>
        {intl.formatMessage({
          id: 'reposting_bot_description2',
          defaultMessage:
            'If the Resource credits on the account are insufficient to write a post, the reposting bot will gradually recover and publish at a slower pace.',
        })}
      </p>
      <MatchBotsService botType={MATCH_BOTS_TYPES.IMPORT} botName={'reposting_bot'} onlyAuth />
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
          id: 'reposting_bot_pause',
          defaultMessage: `The Reposting bot will pause if RC on the account drops below the set threshold.`,
        })}
      </p>
      <p>
        <div>
          <b>Publishing domain:</b> {host} (
          <span className={'main-color-button'} onClick={toggleModal}>
            change
          </span>
          )
        </div>
        <div>
          This domain will be associated with all published posts, serving as their canonical site.
        </div>
      </p>
      <VoteInfoBlock
        isRcBot
        info={intl.formatMessage({
          id: 'reposting_bot_service',
          defaultMessage: 'The Reposting bot service is provided on as-is / as-available basis.',
        })}
      />
      <hr />

      <DynamicTbl
        handleShowMore={loadMoreRepostingDate}
        showMore={hasMorePosts}
        header={configRepostingBotTable}
        bodyConfig={posts}
        onChange={handleChangeStatus}
        deleteItem={handleDeleteObject}
      />
      <h3>{intl.formatMessage({ id: 'history', defaultMessage: 'History' })}</h3>
      <DynamicTbl
        handleShowMore={loadMoreHistoryDate}
        showMore={hasMoreHistory}
        header={configRepostingBotHistoryTable}
        bodyConfig={history}
      />
      {visible && (
        <RepostingBotImportModal
          host={host}
          setHost={setHost}
          visible={visible}
          toggleModal={toggleModal}
          onClose={() => setVisible(false)}
          updateRepostingList={updateRepostingList}
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

RepostingBot.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(RepostingBot);
