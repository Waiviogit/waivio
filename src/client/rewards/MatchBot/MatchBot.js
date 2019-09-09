import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import './MatchBot.less';
import MatchBotTable from './MatchBotTable/MatchBotTable';

const MatchBot = ({ intl }) => {
  // Mock
  const sponsors = [
    { id: 1, isActive: true, name: 'sponsor_1', upvote: 100, action: 'edit', notes: 'some note' },
  ];
  return (
    <div className="MatchBot">
      <div className="MatchBot__title">
        {intl.formatMessage({
          id: 'sponsor_match_bot',
          defaultMessage: '@Sponsor match bot',
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
              "For example, the user has posted a review that is eligible to receive a direct reward of 5.00 SBD. Match bot can upvote that post for a specified value of, say, 10% of the reward (assuming Match bot has enough voting value). This way, the user will receive 0.50 SBD in author's rewards and the direct payment can be reduced to 4.50 SBD.",
          })}
        </p>
        <p>
          {intl.formatMessage({
            id: 'third_party_campaign_sponsors_must_pre_register_match_bot_sponsor_in_campaign',
            defaultMessage:
              'Important: Third-party campaign sponsors must pre-register match bot sponsor in each campaign so that its vote value is subtracted from the direct obligations.',
          })}
        </p>
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
      {!_.isEmpty(sponsors) ? <MatchBotTable intl={intl} sponsors={sponsors} /> : null}
      <div>*** THE TABLE CONTAINS MOCK DATA</div>
      <div>
        {
          '{id:1, isActive: true, name: "sponsor_1", upvote: 100, action: "edit", notes: "some note"}'
        }
      </div>
      <button className="MatchBot__button">
        {/* Mock link */}
        <Link to={`/rewards/create-rule`}>
          {intl.formatMessage({
            id: 'createNewCampaign',
            defaultMessage: `Create new rule`,
          })}
        </Link>
      </button>
    </div>
  );
};

MatchBot.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(MatchBot);
