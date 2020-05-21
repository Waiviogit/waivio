import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { calculateApprovePercent } from '../helpers/wObjectHelper';
import {
  getAuthenticatedUserName,
  getObjectAdmins,
  getObjectModerators,
  getRate,
  getRewardFund,
} from '../reducers';
import { mainerName } from './wObjectHelper';

import './AppendCard.less';

const ApprovingCard = ({ post, intl, rewardFund, rate, modal, adminsList, moderatorsList }) => {
  const isFullParams = rewardFund && rewardFund.recent_claims && rewardFund.reward_balance && rate;
  const voteValue = isFullParams
    ? (post.weight / rewardFund.recent_claims) *
      rewardFund.reward_balance.replace(' HIVE', '') *
      rate *
      1000000
    : 0;
  const percent =
    post.active_votes &&
    calculateApprovePercent(post.active_votes, post.weight, {
      moderators: moderatorsList,
      admins: adminsList,
    });
  const calcVoteValue = voteValue.toFixed(4) > 0 ? voteValue.toFixed(4) : voteValue.toFixed(2);
  const appendState = mainerName(post.active_votes, moderatorsList, adminsList);

  const classListApproveTag = classNames({
    AppendCard__green: percent >= 70,
    AppendCard__red: percent <= 70,
  });
  const classListModal = classNames('AppendCard__approving', {
    'AppendCard__approving--modal': modal,
  });

  const text = (mainer, name, status) => (
    <span>
      {intl.formatMessage({
        id: `${status}_by_${mainer}`,
        defaultMessage: `${status} by ${mainer}`,
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
            <span className={classListApproveTag}>{percent.toFixed(2)}%</span>
          </span>
        </Tag>
        {!appendState && !modal && (
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
            {appendState
              ? intl.formatMessage({
                  id: appendState.status,
                  defaultMessage: appendState.status,
                })
              : calcVoteValue}
          </span>
        </Tag>
        {appendState && text(appendState.mainer, appendState.name, appendState.status)}
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
  moderatorsList: getObjectAdmins(state),
  adminsList: getObjectModerators(state),
}))(injectIntl(ApprovingCard));
