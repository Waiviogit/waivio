import React from 'react';
import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { calculateApprovePercent } from '../helpers/wObjectHelper';
import { getAuthenticatedUserName, getRate, getRewardFund } from '../reducers';

import './AppendCard.less';

const ApprovingCard = ({ post, intl, rewardFund, rate, modal }) => {
  const isFullParams = rewardFund && rewardFund.recent_claims && rewardFund.reward_balance && rate;
  const voteValue = isFullParams
    ? (post.weight / rewardFund.recent_claims) *
      rewardFund.reward_balance.replace(' HIVE', '') *
      rate *
      1000000
    : 0;
  const percent = post.active_votes && calculateApprovePercent(post.active_votes);

  return (
    <div
      className={
        modal ? 'AppendCard__approving AppendCard__approving--modal' : 'AppendCard__approving'
      }
    >
      {!isNil(post.append_field_weight) && (
        <div>
          Approval:{' '}
          <Tag>
            <span>
              <span
                className={`AppendCard__${
                  percent >= 70 || post.upvotedByModerator ? 'green' : 'red'
                }`}
              >
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
        Vote count:{' '}
        <Tag>
          <span
            className={`AppendCard__${post.upvotedByModerator || voteValue > 0 ? 'green' : 'red'}`}
          >
            {post.upvotedByModerator ? 'Approved' : voteValue.toFixed(2)}
          </span>
        </Tag>
        {post.upvotedByModerator && <span>approved by admin @admin</span>}
      </div>
    </div>
  );
};

ApprovingCard.propTypes = {
  post: PropTypes.shape({
    upvotedByModerator: PropTypes.bool,
    append_field_weight: PropTypes.number,
    weight: PropTypes.number,
    active_votes: PropTypes.arrayOf({}),
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  rewardFund: PropTypes.shape().isRequired,
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
