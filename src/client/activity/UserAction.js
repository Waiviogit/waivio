import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import UserActionIcon from './UserActionIcon';
import UserActionMessage from './UserActionMessage';
import UserActionContents from './UserActionContents';

const UserAction = ({ action, totalVestingShares, totalVestingFundSteem, currentUsername }) => {
  const actionType = action.op[0];
  const actionDetails = action.op[1];

  if (actionType === 'effective_comment_vote') return null;

  return (
    <div className="UserActivityActions__action">
      <UserActionIcon
        actionType={actionType}
        actionDetails={actionDetails}
        currentUsername={currentUsername}
      />
      <div className="UserActivityActions__content">
        <UserActionMessage
          actionType={actionType}
          actionDetails={actionDetails}
          totalVestingShares={totalVestingShares}
          totalVestingFundSteem={totalVestingFundSteem}
          currentUsername={currentUsername}
        />
        <span className="UserActivityActions__timestamp">
          <BTooltip
            title={
              <span>
                <FormattedDate value={`${action.timestamp}Z`} />{' '}
                <FormattedTime value={`${action.timestamp}Z`} />
              </span>
            }
          >
            <span>
              <FormattedRelative value={`${action.timestamp}Z`} />
            </span>
          </BTooltip>
        </span>
        <UserActionContents actionType={actionType} actionDetails={actionDetails} />
      </div>
    </div>
  );
};

UserAction.propTypes = {
  action: PropTypes.shape(),
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  currentUsername: PropTypes.string.isRequired,
};

UserAction.defaultProps = {
  action: {
    op: [],
  },
};

export default UserAction;
