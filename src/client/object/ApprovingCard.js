import React from 'react';
import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { calculateApprovePercent } from '../helpers/wObjectHelper';
import { getAuthenticatedUserName, getRate, getRewardFund } from '../reducers';

import './AppendCard.less';

const ApprovingCard = ({ post, intl, rewardFund, rate, modal, adminsList, moderatorsList }) => {
  const isFullParams = rewardFund && rewardFund.recent_claims && rewardFund.reward_balance && rate;
  const voteValue = isFullParams
    ? (post.weight / rewardFund.recent_claims) *
      rewardFund.reward_balance.replace(' HIVE', '') *
      rate *
      1000000
    : 0;
  const percent = post.active_votes && calculateApprovePercent(post.active_votes, post.weight);
  const calcVoteValue = voteValue.toFixed(4) > 0 ? voteValue.toFixed(4) : voteValue.toFixed(2);

  const classListApproveTag = classNames({
    AppendCard__green: percent >= 70 || post.upvotedByModerator,
    AppendCard__red: percent <= 70 || !post.upvotedByModerator,
  });
  const classListVoteValueTag = classNames({
    AppendCard__green: post.upvotedByModerator || voteValue > 0,
    AppendCard__red: !post.upvotedByModerator || voteValue < 0,
  });
  const classListModal = classNames('AppendCard__approving', {
    'AppendCard__approving--modal': modal,
  });
  const adminName = post.active_votes.find(vote => adminsList.includes(vote.voter));
  const moderatorName = post.active_votes.find(vote => moderatorsList.includes(vote.voter));
  const textApproving = moderatorName ? (
    <span>
      {intl.formatMessage({
        id: 'approved_by_moderator',
        defaultMessage: 'approved by moderator',
      })}{' '}
      <a href={`/@${moderatorName && moderatorName.voter}`} className="AppendCard__name-admin">
        @{moderatorName && moderatorName.voter}
      </a>
    </span>
  ) : (
    <span>
      {intl.formatMessage({
        id: 'approved_by_admin',
        defaultMessage: 'approved by admin',
      })}{' '}
      <a href={`/@${adminName && adminName.voter}`} className="AppendCard__name-admin">
        @{adminName && adminName.voter}
      </a>
    </span>
  );

  return (
    <div className={classListModal}>
      {!isNil(post.append_field_weight) && (
        <div>
          {intl.formatMessage({
            id: 'approval',
            defaultMessage: 'Approval',
          })}
          :{' '}
          <Tag>
            <span>
              <span className={classListApproveTag}>
                {post.upvotedByModerator ? 100 : percent.toFixed(2)}%
              </span>
            </span>
          </Tag>
          {!post.upvotedByModerator && !modal && (
            <span className="MinPercent">
              {intl.formatMessage({
                id: 'min_70_is_required',
                defaultMessage: 'Min 70% is required',
              })}
            </span>
          )}
        </div>
      )}
      <div>
        {intl.formatMessage({
          id: 'vote_count_tag',
          defaultMessage: 'Vote count',
        })}
        :{' '}
        <Tag>
          <span className={classListVoteValueTag} title={voteValue}>
            {post.upvotedByModerator
              ? intl.formatMessage({
                  id: 'approved',
                  defaultMessage: 'Approved',
                })
              : calcVoteValue}
          </span>
        </Tag>
        {post.upvotedByModerator && textApproving}
      </div>
    </div>
  );
};

ApprovingCard.propTypes = {
  post: PropTypes.shape({
    upvotedByModerator: PropTypes.bool,
    append_field_weight: PropTypes.number,
    weight: PropTypes.number,
    active_votes: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  rewardFund: PropTypes.shape({
    recent_claims: PropTypes.string,
    reward_balance: PropTypes.string,
  }).isRequired,
  rate: PropTypes.number.isRequired,
  modal: PropTypes.bool,
  adminsList: PropTypes.arrayOf(PropTypes.string).isRequired,
  moderatorsList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ApprovingCard.defaultProps = {
  modal: false,
};

export default connect(state => ({
  userName: getAuthenticatedUserName(state),
  rewardFund: getRewardFund(state),
  rate: getRate(state),
}))(injectIntl(ApprovingCard));
