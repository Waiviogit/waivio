import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { Button, message, Modal, Slider, Switch, Tooltip } from 'antd';
import { setMatchBotVotingPower } from '../../../store/rewardsStore/rewardsActions';
import CreateRule from './CreateRule/CreateRule';
import { getMatchBotRules } from '../../../waivioApi/ApiClient';
import MatchBotTable from './MatchBotTable/MatchBotTable';
import Error401 from '../../statics/Error401';
import getMatchBotMessageData from './matchBotMessageData';
import { getAuthenticatedUser } from '../../../store/authStore/authSelectors';

import './MatchBotSponsors.less';

const MatchBotSponsors = ({ intl, userName }) => {
  const [editRule, setEditRule] = useState({});
  const [isLoading, setLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [minVotingPower, setMinVotingPower] = useState(0);
  const [rules, setRules] = useState({ results: [] });
  const [sliderValue, setSliderValue] = useState(100);
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const [isEnabledRule, setIsEnabledRule] = useState(false);

  const authenticatedUser = useSelector(getAuthenticatedUser);
  const authority = 'waiviocampaigns';
  const isAuthority =
    !isEmpty(authenticatedUser) &&
    !isEmpty(authenticatedUser.posting) &&
    authenticatedUser.posting.account_auths
      .map(auth => auth[0])
      .some(authName => authName === authority);
  const handleSwitcher = () => {
    const path = window.location.href;

    if (!isAuthority) {
      window.location = `https://hivesigner.com/authorize/waiviocampaigns?redirect_uri=${path}&callback`;
    } else {
      window.location = `https://hivesigner.com/revoke/waiviocampaigns?redirect_uri=${path}&callback`;
    }
  };
  const maxRulesLimit = 25;
  const isOverRules = rules.results.length >= maxRulesLimit;
  const marks = {
    1: '1%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%',
  };

  useEffect(() => {
    if (userName) {
      getMatchBotRules(userName).then(data => {
        setRules(data);
        setMinVotingPower(data.votingPower / 100);
      });
    }
  }, []);

  const localizer = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });
  const messageData = getMatchBotMessageData(localizer);

  const handleChangeModalVisible = () => {
    if (isOverRules) {
      message.error(messageData.cannotCreateRulesMore);

      return;
    }
    setModalVisible(!modalVisible);
  };
  const handleEditRule = rule => {
    setModalVisible(!modalVisible);
    setEditRule(rule);
  };
  const handleOpenVoteModal = () => setVoteModalVisible(!voteModalVisible);
  const handleChangeSliderValue = value => setSliderValue(value);
  const formatTooltip = value => `${value}%`;
  const dispatch = useDispatch();
  const handleSetMinVotingPower = () => {
    setLoaded(true);
    const preparedSliderValue = {
      voting_power: sliderValue * 100,
    };

    dispatch(setMatchBotVotingPower(preparedSliderValue)).then(() => {
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
          <div className="MatchBotSponsors__title-wrap">
            <div className="MatchBotSponsors__title">{messageData.manageMatchBot}</div>
            <div className="MatchBotSponsors__switcher">
              <Tooltip title={!isAuthority ? messageData.turnOn : messageData.turnOff}>
                <Switch checked={isAuthority} onChange={handleSwitcher} />
              </Tooltip>
            </div>
          </div>
          <div className="MatchBotSponsors__text-content">
            <p>{messageData.designedOffsetPortion}</p>
            <p>{messageData.contentUserPostedReview}</p>
            <p className="MatchBotSponsors__text fw6">{messageData.thirdPartyCampaignSponsors}</p>
            <div className="MatchBotSponsors__highlighted-block">
              <div className="MatchBotSponsors__text mb3 fw6">
                <p>
                  {messageData.matchBotRequiresAuthorization}:
                  {
                    <span
                      className="MatchBotSponsors__text-link"
                      onClick={handleSwitcher}
                      role="presentation"
                    >
                      {' '}
                      {!isAuthority ? messageData.authorizeNow : messageData.removeAuthorization}
                    </span>
                  }
                </p>
                <p>{messageData.authorizationCompletedSteemconnect}</p>
              </div>
              <p>
                <span>
                  {messageData.minimumVotingPower}:{` ${minVotingPower}% `}
                </span>
                (
                <span
                  className="MatchBotSponsors__highlighted-block-change-vote"
                  onClick={handleOpenVoteModal}
                  role="presentation"
                >
                  {messageData.change}
                </span>
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
              setIsEnabledRule={setIsEnabledRule}
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
            />
          )}
        </React.Fragment>
      ) : (
        <Error401 />
      )}
      <Modal
        confirmLoading={isLoading}
        onCancel={handleOpenVoteModal}
        onOk={handleSetMinVotingPower}
        title={messageData.changeMinVotingPower}
        visible={voteModalVisible}
      >
        <Slider
          defaultValue={minVotingPower}
          onChange={handleChangeSliderValue}
          min={1}
          marks={marks}
          tipFormatter={formatTooltip}
        />
      </Modal>
    </div>
  );
};

MatchBotSponsors.propTypes = {
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string,
};

MatchBotSponsors.defaultProps = {
  userName: '',
};

export default injectIntl(MatchBotSponsors);
