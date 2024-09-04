import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import { MATCH_BOTS_TYPES, redirectAuthHiveSigner } from '../../../common/helpers/matchBotsHelpers';
import { getSponsorsMatchBots } from '../../../waivioApi/ApiClient';
import MatchBotsService from '../../rewards/MatchBots/MatchBotsService';
import MatchBotsTitle from '../../rewards/MatchBots/MatchBotsTitle';
import getMatchBotMessageData from '../../rewards/MatchBotSponsors/matchBotMessageData';
import MatchBotTable from '../../rewards/MatchBotSponsors/MatchBotTable/MatchBotTable';
import CreateRule from '../../rewards/MatchBotSponsors/CreateRule/CreateRule';
import Error401 from '../../statics/Error401';
import {
  getAuthenticatedUserName,
  getIsConnectMatchBot,
} from '../../../store/authStore/authSelectors';
import { setMatchBotVotingPower } from '../../../store/newRewards/newRewardsActions';
import ChangeVotingModal from '../../widgets/ChangeVotingModal/ChangeVotingModal';

const SponsorsMatchBots = ({ intl, isEngLocale }) => {
  const userName = useSelector(getAuthenticatedUserName);
  const isAuthority = useSelector(state =>
    getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.SPONSORS }),
  );
  const [editRule, setEditRule] = useState({});
  const [isLoading, setLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [minVotingPower, setMinVotingPower] = useState(0);
  const [rules, setRules] = useState({ results: [] });
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const [isEnabledRule, setIsEnabledRule] = useState(false);

  const handleSwitcher = () => redirectAuthHiveSigner(isAuthority, MATCH_BOTS_TYPES.SPONSORS);
  const maxRulesLimit = 25;
  const isOverRules = rules?.results?.length >= maxRulesLimit;
  const handleShowMore = () => {
    getSponsorsMatchBots(userName, 10, rules.results.length).then(data => {
      setRules({
        ...rules,
        hasMore: data?.hasMore,
        results: [...rules.results, ...data.results],
      });
    });
  };

  const getSponsors = () =>
    getSponsorsMatchBots(userName, 10, 0).then(data => {
      setRules(data);
      setMinVotingPower(data.minVotingPower / 100);
    });

  useEffect(() => {
    if (userName) {
      getSponsors();
    }
  }, []);

  const localizer = (id, defaultMessage, values) =>
    intl.formatMessage({ id, defaultMessage }, values);
  const messageData = getMatchBotMessageData(localizer, { currency: 'WAIV' });

  const handleChangeModalVisible = () => {
    if (isOverRules) {
      message.error(messageData.cannotCreateRulesMore);

      return;
    }
    setModalVisible(!modalVisible);
    setEditRule({});
  };

  const handleEditRule = rule => {
    setModalVisible(!modalVisible);
    setEditRule(rule);
    getSponsors();
  };
  const handleOpenVoteModal = () => setVoteModalVisible(!voteModalVisible);
  const dispatch = useDispatch();
  const handleSetMinVotingPower = sliderValue => {
    setLoaded(true);

    dispatch(setMatchBotVotingPower(sliderValue * 100)).then(() => {
      setLoaded(false);
      handleOpenVoteModal();
      setMinVotingPower(sliderValue);
      message.success(messageData.successMinVotedChanged);
    });
  };

  return (
    <div className="MatchBotSponsors">
      {userName ? (
        <React.Fragment>
          <MatchBotsTitle
            botType={MATCH_BOTS_TYPES.SPONSORS}
            botTitle={messageData.manageMatchBot}
            turnOffTitle={messageData.turnOff}
            turnOnTitle={messageData.turnOn}
          />
          <div className="MatchBotSponsors__text-content">
            <p className="mb3">
              {isEngLocale && <span>The</span>}
              <span className="fw6">{messageData.manageMatchBot}</span>
              <span>{messageData.designedOffsetPortion}</span>
            </p>
            <p>{messageData.contentUserPostedReview}</p>
            <p className="MatchBotSponsors__text fw6 mt3">
              {messageData.thirdPartyCampaignSponsors}
            </p>
            <MatchBotsService
              onlyAuth
              botType={MATCH_BOTS_TYPES.SPONSORS}
              botName={MATCH_BOTS_TYPES.SPONSORS}
            />
            <div>
              <p>
                <span>
                  {messageData.minimumVotingPower}:{` ${minVotingPower}% `}
                </span>
                (
                <button
                  className="MatchBotSponsors__highlighted-block-change-vote"
                  onClick={handleOpenVoteModal}
                  disabled={isEmpty(rules.results)}
                >
                  {messageData.change}
                </button>
                )
              </p>
              <p>{messageData.upvoteEligiblePosts}</p>
              <p className="mt3">
                <span className="fw6">{messageData.disclaimer}</span>
                <span>{messageData.matchBotsProvided}</span>
              </p>
            </div>
          </div>
          {!isEmpty(rules) && !isEmpty(rules.results) && (
            <MatchBotTable
              handleEditRule={handleEditRule}
              handleSwitcher={handleSwitcher}
              messageData={messageData}
              isAuthority={isAuthority}
              rules={rules.results}
              hasMore={rules.hasMore}
              handleShowMore={handleShowMore}
              setIsEnabledRule={setIsEnabledRule}
              isNew
            />
          )}
          <div className="MatchBotSponsors__button">
            <Button type="primary" onClick={handleChangeModalVisible}>
              {messageData.addSponsor}
            </Button>
          </div>
          {modalVisible && (
            <CreateRule
              editRule={editRule}
              handleChangeModalVisible={handleChangeModalVisible}
              modalVisible={modalVisible}
              setEditRule={setEditRule}
              isEnabledRule={isEnabledRule}
              updateSponsorList={getSponsors}
              isNew
            />
          )}
        </React.Fragment>
      ) : (
        <Error401 />
      )}
      <ChangeVotingModal
        title={messageData.changeMinVotingPower}
        minVotingPower={minVotingPower}
        visible={voteModalVisible}
        isLoading={isLoading}
        handleOpenVoteModal={handleOpenVoteModal}
        handleSetMinVotingPower={handleSetMinVotingPower}
      />
    </div>
  );
};

SponsorsMatchBots.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool,
};

SponsorsMatchBots.defaultProps = {
  isEngLocale: false,
};

export default injectIntl(SponsorsMatchBots);
