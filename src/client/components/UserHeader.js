import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import { getUserRankKey, getUserRank } from '../helpers/user';
import AvatarLightbox from './AvatarLightbox';
import FollowButton from '../widgets/FollowButton';
import Action from './Button/Action';
import './UserHeader.less';
import WeightTag from './WeightTag';

const UserHeader = ({
  username,
  authenticated,
  handle,
  wobjWeight,
  vestingShares,
  isSameUser,
  coverImage,
  hasCover,
  isFollowing,
  isActive,
  changeChatCondition,
  isChat,
  setPostMessageAction,
  isGuest,
  isGuestPage,
}) => {
  const style = hasCover
    ? { backgroundImage: `url("https://steemitimages.com/2048x512/${coverImage}")` }
    : {};
  const sendData = () => {
    setPostMessageAction('start_chat', handle);
    changeChatCondition();
  };
  const isChatVisible = !isGuest && !isGuestPage;
  return (
    <div className={classNames('UserHeader', { 'UserHeader--cover': hasCover })} style={style}>
      <div className="UserHeader__container">
        <AvatarLightbox username={handle} size={100} isActive={isActive} />
        <div className="UserHeader__user">
          <div className="UserHeader__row">
            <h2 className="UserHeader__user__username">
              {username}
              <WeightTag weight={wobjWeight} />
            </h2>
            <div className="UserHeader__user__buttons">
              <div
                className={classNames('UserHeader__user__button', {
                  'UserHeader__user__button-follows-you': isFollowing && !isSameUser,
                })}
              >
                {isSameUser ? (
                  <Link to="/edit-profile">
                    <Action>
                      <FormattedMessage id="edit_profile" defaultMessage="Edit profile" />
                    </Action>
                  </Link>
                ) : (
                  <FollowButton following={handle} followingType="user" />
                )}
              </div>
              {authenticated && !isChat && !isSameUser && isChatVisible ? (
                <div className="UserHeader__user__button">
                  <Button onClick={sendData} type="primary" shape="circle" icon="message" />
                </div>
              ) : null}
            </div>
          </div>
          <div className="UserHeader__handle-rank-container">
            <div className="UserHeader__row UserHeader__handle">
              @{handle}
              {isFollowing && (
                <span className="UserHeader__follows-you">
                  <FormattedMessage id="follows_you" defaultMessage="Follows you" />
                </span>
              )}
            </div>
            <div className="UserHeader__rank">
              <i className="iconfont icon-ranking" />
              <FormattedMessage
                id={getUserRankKey(vestingShares)}
                defaultMessage={getUserRank(vestingShares)}
              />
            </div>
          </div>
          {isFollowing && !isSameUser && (
            <span
              className={classNames('UserHeader__follows-you UserHeader__follows-you--mobile', {
                'UserHeader__follows-you-cover-text-color': hasCover,
              })}
            >
              <FormattedMessage id="follows_you" defaultMessage="Follows you" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

UserHeader.propTypes = {
  username: PropTypes.string,
  authenticated: PropTypes.bool.isRequired,
  handle: PropTypes.string,
  wobjWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  vestingShares: PropTypes.number,
  isSameUser: PropTypes.bool,
  coverImage: PropTypes.string,
  hasCover: PropTypes.bool,
  isFollowing: PropTypes.bool,
  isActive: PropTypes.bool.isRequired,
  changeChatCondition: PropTypes.func.isRequired,
  isChat: PropTypes.bool.isRequired,
  setPostMessageAction: PropTypes.func.isRequired,
  isGuest: PropTypes.bool,
  isGuestPage: PropTypes.bool,
};

UserHeader.defaultProps = {
  username: '',
  handle: '',
  wobjWeight: '0',
  vestingShares: 0,
  isSameUser: false,
  coverImage: '',
  hasCover: false,
  isFollowing: false,
  onTransferClick: () => {},
  isGuest: false,
  isGuestPage: false,
};

export default UserHeader;
