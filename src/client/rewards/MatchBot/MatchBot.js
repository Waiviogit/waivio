import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { Button, message, Modal, Slider } from 'antd';
import { setMatchBotVotingPower } from '../rewardsActions';
import CreateRule from './CreateRule/CreateRule';
import { getMatchBotRules } from '../../../waivioApi/ApiClient';
import MatchBotTable from './MatchBotTable/MatchBotTable';
import './MatchBot.less';

const MatchBot = ({ intl, userName, ...props }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const [isLoading, setLoaded] = useState(false);
  const [sliderValue, setSliderValue] = useState(100);
  const [editRule, setEditRule] = useState({});
  const [rules, setRules] = useState({ results: [] });
  const [minVotingPower, setMinVotingPower] = useState(0);
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
    getMatchBotRules(userName).then(data => {
      setRules(data);
      setMinVotingPower(80);
    });
  }, []);

  const handleChangeModalVisible = () => {
    if (isOverRules) {
      message.error(
        intl.formatMessage({
          id: 'match_bot_cannot_create_rules_more',
          defaultMessage: `You cannot create more then 25 rules`,
        }),
      );
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
  const handleSetMinVotingPower = () => {
    setLoaded(true);
    const preparedSliderValue = sliderValue / 100;
    props.setMatchBotVotingPower(preparedSliderValue).then(() => {
      setLoaded(false);
      handleOpenVoteModal();
      message.success(
        intl.formatMessage({
          id: 'match_bot_success_min_voted_changed',
          defaultMessage: 'Minimum voting power changed',
        }),
      );
    });
  };

  return (
    <div className="MatchBot">
      <div className="MatchBot__title">
        {intl.formatMessage({
          id: 'sponsor_match_bot',
          defaultMessage: 'Sponsor match bot',
        })}
      </div>
      <div className="MatchBot__text-content">
        <p>
          {intl.formatMessage({
            id: 'match_bot_designed_offset_portion_of_direct_rewards',
            defaultMessage:
              'Match bot is designed to offset portion of direct rewards with upvotes.',
          })}
        </p>
        <p>
          {intl.formatMessage({
            id: 'match_bot_content_user_has_posted_review_eligible_receive_direct_reward',
            defaultMessage:
              "For example, the user has posted a review that is eligible to receive a direct reward of 5.00 STEEM. Match bot can upvote that post for a specified value of, say, 10% of the reward (assuming Match bot has enough voting value). This way, the user will receive 0.50 STEEM in author's rewards and the direct payment can be reduced to 4.50 STEEM.",
          })}
        </p>
        <p>
          {intl.formatMessage({
            id: 'third_party_campaign_sponsors_must_pre_register_match_bot_sponsor_in_campaign',
            defaultMessage:
              'Important: Third-party campaign sponsors must pre-register match bot sponsor in each campaign so that its vote value is subtracted from the direct obligations.',
          })}
        </p>
        <div className="MatchBot__highlighted-block">
          <p>
            <span>
              {intl.formatMessage({
                id: 'minimum_voting_power',
                defaultMessage: 'Minimum voting power',
              })}
              :{` ${minVotingPower}% `}
            </span>
            (
            <span
              className="MatchBot__highlighted-block-change-vote"
              onClick={handleOpenVoteModal}
              role="presentation"
            >
              {intl.formatMessage({
                id: 'minimum_voting_power_change',
                defaultMessage: 'change',
              })}
            </span>
            )
          </p>
          <p>
            {intl.formatMessage({
              id: 'match_bot_will_upvote_eligible_posts_only_if_VP',
              defaultMessage:
                'Match bot will upvote eligible posts only if VP on the account exceeds the set value.',
            })}
          </p>
        </div>
      </div>
      {!isEmpty(rules) && !isEmpty(rules.results) && (
        <MatchBotTable intl={intl} rules={rules.results} handleEditRule={handleEditRule} />
      )}
      <div className="MatchBot__button">
        <Button type="primary" onClick={handleChangeModalVisible}>
          {intl.formatMessage({
            id: 'createNewCampaign',
            defaultMessage: `Create new rule`,
          })}
        </Button>
      </div>
      {modalVisible && (
        <CreateRule
          modalVisible={modalVisible}
          handleChangeModalVisible={handleChangeModalVisible}
          editRule={editRule}
          setEditRule={setEditRule}
        />
      )}
      <Modal
        title={intl.formatMessage({
          id: 'match_bot_change_min_voting_power',
          defaultMessage: 'Change minimum voting power',
        })}
        visible={voteModalVisible}
        onCancel={handleOpenVoteModal}
        onOk={handleSetMinVotingPower}
        confirmLoading={isLoading}
      >
        <Slider
          min={1}
          defaultValue={minVotingPower}
          marks={marks}
          tipFormatter={formatTooltip}
          onChange={handleChangeSliderValue}
        />
      </Modal>
    </div>
  );
};

MatchBot.propTypes = {
  intl: PropTypes.shape().isRequired,
  setMatchBotVotingPower: PropTypes.func.isRequired,
  userName: PropTypes.string,
};

MatchBot.defaultProps = {
  userName: '',
};

export default injectIntl(connect(null, { setMatchBotVotingPower })(MatchBot));
