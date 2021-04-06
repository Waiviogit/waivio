import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { getAuthenticatedUserName } from '../../store/reducers';
import { getRate, getRewardFund } from '../../store/appStore/appSelectors';

import './AppendCard.less';

const ApprovingCard = ({ post, intl, rewardFund, rate, modal }) => {
  const isFullParams = rewardFund && rewardFund.recent_claims && rewardFund.reward_balance && rate;
  const voteValue = isFullParams
    ? (post.weight / rewardFund.recent_claims) *
      rewardFund.reward_balance.replace(' HIVE', '') *
      rate *
      1000000
    : 0;
  const calcVoteValue = voteValue.toFixed(4) > 0 ? voteValue.toFixed(4) : voteValue.toFixed(2);

  const classListApproveTag = classNames({
    AppendCard__green: post.approvePercent >= 70,
    AppendCard__red: post.approvePercent <= 70,
  });
  const classListModal = classNames('AppendCard__approving', {
    'AppendCard__approving--modal': modal,
  });

  const text = (role, name, status) => (
    <span>
      {intl.formatMessage({
        id: `${status}_by_${role}`,
        defaultMessage: `${status} by ${role}`,
      })}{' '}
      <a href={`/@${name}`} className="AppendCard__name-admin">
        @{name}
      </a>
    </span>
  );

  return (
    <div className={classListModal}>
      <div>
        {intl.formatMessage({
          id: 'approval',
          defaultMessage: 'Approval',
        })}
        :{' '}
        <Tag>
          <span>
            <span className={classListApproveTag}>{post.approvePercent.toFixed(2)}%</span>
          </span>
        </Tag>
        {!post.adminVote && !modal && (
          <span className="MinPercent">
            {intl.formatMessage({
              id: 'min_70_is_required',
              defaultMessage: 'Min 70% is required',
            })}
          </span>
        )}
      </div>
      <div>
        {intl.formatMessage({
          id: 'vote_count_tag',
          defaultMessage: 'Vote count',
        })}
        :{' '}
        <Tag>
          <span className={classListApproveTag} title={voteValue}>
            {post.adminVote
              ? intl.formatMessage({
                  id: post.adminVote.status,
                  defaultMessage: post.adminVote.status,
                })
              : calcVoteValue}
          </span>
        </Tag>
        {post.adminVote && text(post.adminVote.role, post.adminVote.name, post.adminVote.status)}
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
    approvePercent: PropTypes.number,
    adminVote: PropTypes.shape({
      role: PropTypes.string,
      name: PropTypes.string,
      status: PropTypes.string,
    }),
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
};

ApprovingCard.defaultProps = {
  modal: false,
};

export default connect(state => ({
  userName: getAuthenticatedUserName(state),
  rewardFund: getRewardFund(state),
  rate: getRate(state),
}))(injectIntl(ApprovingCard));
