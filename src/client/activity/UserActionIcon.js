import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { includes, get } from 'lodash';
import * as accountHistoryConstants from '../../common/constants/accountHistory';
import Avatar from '../components/Avatar';
import { parseJSON } from '../../common/helpers/parseJSON';

class UserActionIcon extends React.Component {
  static propTypes = {
    actionType: PropTypes.string.isRequired,
    actionDetails: PropTypes.shape().isRequired,
    currentUsername: PropTypes.string.isRequired,
  };

  getIcon() {
    const { actionType, actionDetails, currentUsername } = this.props;

    switch (actionType) {
      case accountHistoryConstants.ACCOUNT_CREATE_WITH_DELEGATION:
      case accountHistoryConstants.ACCOUNT_CREATE:
        return 'icon-people_fill';
      case accountHistoryConstants.ACCOUNT_UPDATE:
        return 'icon-businesscard_fill';
      case accountHistoryConstants.VOTE:
        if (currentUsername === actionDetails.voter) {
          if (actionDetails.weight > 0) {
            return 'icon-praise_fill';
          } else if (actionDetails.weight < 0) {
            return 'icon-praise_fill UserActivityActions__icon__dislike';
          }

          return 'icon-praise';
        }

        return null;
      case accountHistoryConstants.CUSTOM_JSON: {
        try {
          const actionJSON = parseJSON(actionDetails.json);
          const customActionType = actionJSON[0];
          const customActionDetails = actionJSON[1];

          if (!includes(accountHistoryConstants.PARSED_CUSTOM_JSON_IDS, actionDetails.id)) {
            return 'icon-document';
          }
          if (
            customActionType === accountHistoryConstants.REBLOG &&
            currentUsername === customActionDetails.account
          ) {
            return 'icon-share1';
          } else if (
            customActionType === accountHistoryConstants.FOLLOW &&
            currentUsername === customActionDetails.follower
          ) {
            switch (customActionDetails.what[0]) {
              case 'ignore':
                return 'icon-delete_fill';
              case 'blog':
                return 'icon-addpeople_fill';
              default:
                return 'icon-addpeople';
            }
          }

          return null;
        } catch (err) {
          return 'icon-barrage';
        }
      }
      case accountHistoryConstants.AUTHOR_REWARD:
      case accountHistoryConstants.CURATION_REWARD:
        return 'icon-ranking';
      case accountHistoryConstants.COMMENT:
        if (actionDetails.parent_author === '') {
          return 'icon-brush_fill';
        }
        if (currentUsername === actionDetails.author) {
          return 'icon-message_fill';
        }

        return null;
      case accountHistoryConstants.DELETE_COMMENT:
        return 'icon-message';
      case accountHistoryConstants.FILL_VESTING_WITHDRAW:
        return 'icon-flashlight';
      default:
        return null;
    }
  }

  getAvatarUsername() {
    const { actionType, actionDetails } = this.props;

    switch (actionType) {
      case accountHistoryConstants.COMMENT:
        return actionDetails.author;
      case accountHistoryConstants.CUSTOM_JSON: {
        try {
          const actionJSON = parseJSON(actionDetails.json);
          const customActionType = actionJSON[0];
          const customActionDetails = actionJSON[1];

          if (customActionType === accountHistoryConstants.REBLOG) {
            return customActionDetails.account;
          } else if (customActionType === accountHistoryConstants.FOLLOW) {
            return customActionDetails.follower;
          }

          return null;
        } catch (err) {
          return 'icon-barrage';
        }
      }
      case accountHistoryConstants.VOTE:
        return actionDetails.voter;
      case accountHistoryConstants.ACCOUNT_WITNESS_VOTE:
      case accountHistoryConstants.ACCOUNT_UPDATE:
        return actionDetails.account;
      default:
        return get(actionDetails, 'author', '');
    }
  }

  getTypeOperation = () => {
    const { actionDetails } = this.props;
    const customActionDetails = parseJSON(actionDetails.json)[1];

    return customActionDetails.type_operation;
  };

  render() {
    const { actionDetails } = this.props;
    const iconName = this.getIcon();
    const avatarUsername = this.getAvatarUsername();

    if (includes(accountHistoryConstants.PARSED_CUSTOM_JSON_FOLLOW_WOBJECT, actionDetails.id)) {
      return (
        <div className="UserActivityActions__icon__container">
          {this.getTypeOperation() === accountHistoryConstants.FOLLOW_WOBJECT ? (
            <Icon type="file-done" />
          ) : (
            <Icon type="file-excel" />
          )}
        </div>
      );
    }

    if (iconName) {
      return (
        <div className="UserActivityActions__icon__container">
          <i className={`iconfont ${iconName} UserActivityActions__icon`} />
        </div>
      );
    }

    return (
      <div className="UserActivityActions__avatar">
        <Avatar username={avatarUsername} size={40} />
      </div>
    );
  }
}

export default UserActionIcon;
