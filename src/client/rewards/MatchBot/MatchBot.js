import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import MatchBotTable from './MatchBotTable/MatchBotTable';
import './MatchBot.less';
import CreateRule from './CreateRule/CreateRule';
import { getMatchBotRules } from '../../../waivioApi/ApiClient';

const MatchBot = ({ intl, userName }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editRule, setEditRule] = useState({});
  const [rules, setRules] = useState([]);
  const handleChangeModalVisible = () => setModalVisible(!modalVisible);
  const handleEditRule = rule => {
    setModalVisible(!modalVisible);
    setEditRule(rule);
  };
  useEffect(() => {
    getMatchBotRules(userName).then(data => setRules(data));
  }, []);
  console.log('editRule', editRule);
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
            {intl.formatMessage({
              id: 'minimum_voting_power',
              defaultMessage: 'Minimum voting power: 80% (change).',
            })}
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
      <button className="MatchBot__button" onClick={handleChangeModalVisible}>
        {intl.formatMessage({
          id: 'createNewCampaign',
          defaultMessage: `Create new rule`,
        })}
      </button>
      {modalVisible && (
        <CreateRule
          modalVisible={modalVisible}
          handleChangeModalVisible={handleChangeModalVisible}
          editRule={editRule}
          setEditRule={setEditRule}
        />
      )}
    </div>
  );
};

MatchBot.propTypes = {
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string,
};

MatchBot.defaultProps = {
  userName: '',
};

export default injectIntl(MatchBot);
