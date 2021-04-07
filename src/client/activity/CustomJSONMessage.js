import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as accountHistoryConstants from '../../common/constants/accountHistory';
import UserActionMessage from './UserActionMessage';

const CustomJSONMessage = ({ actionDetails, actionType }) => {
  const customFollowType = actionDetails.id;
  const customReblogType = JSON.parse(actionDetails.json)[0];
  const customActionDetails = JSON.parse(actionDetails.json)[1];
  const whatTypes = get(customActionDetails, 'what[0]', []);

  if (customReblogType === accountHistoryConstants.REBLOG) {
    return (
      <span className="capitalize-text">
        <FormattedMessage
          id="reblogged_post"
          defaultMessage="reblogged {postLink}"
          values={{
            postLink: (
              <Link
                to={`/@${customActionDetails.author}/${customActionDetails.permlink}`}
              >{`@${customActionDetails.author}/${customActionDetails.permlink}`}</Link>
            ),
          }}
        />
      </span>
    );
  }

  if (customFollowType === accountHistoryConstants.FOLLOW) {
    let messageId = '';
    let messageDefault = '';

    switch (whatTypes) {
      case 'ignore':
        messageId = 'ignore_user';
        messageDefault = 'Ignored {following}';
        break;
      case 'blog':
        messageId = 'followed_user';
        messageDefault = 'Followed {following}';
        break;
      default:
        messageId = 'unfollowed_user';
        messageDefault = 'Unfollowed {following}';
        break;
    }

    return (
      <span className="capitalize-text">
        <FormattedMessage
          id={messageId}
          defaultMessage={messageDefault}
          values={{
            following: (
              <Link to={`/@${customActionDetails.following}`}>{customActionDetails.following}</Link>
            ),
          }}
        />
      </span>
    );
  } else if (customFollowType === accountHistoryConstants.FOLLOW_WOBJECT) {
    if (customActionDetails.type_operation === accountHistoryConstants.FOLLOW_WOBJECT) {
      return (
        <FormattedMessage
          id="followed_wobject"
          defaultMessage="Followed {object_type} {name}"
          values={{
            object_type: customActionDetails.object_type,
            name: (
              <Link to={`/object/${customActionDetails.author_permlink}`}>
                {customActionDetails.object_name}
              </Link>
            ),
          }}
        />
      );
    }

    return (
      <FormattedMessage
        id="unfollowed_wobject"
        defaultMessage="Unfollowed {object_type} {name}"
        values={{
          object_type: customActionDetails.object_type,
          name: (
            <Link to={`/object/${customActionDetails.author_permlink}`}>
              {customActionDetails.object_name}
            </Link>
          ),
        }}
      />
    );
  } else if (customFollowType === accountHistoryConstants.WOBJ_RATING) {
    return UserActionMessage.renderDefault(actionType);
  }

  return null;
};

CustomJSONMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
  actionType: PropTypes.string,
};

CustomJSONMessage.defaultProps = {
  actionType: PropTypes.string,
};

export default CustomJSONMessage;
