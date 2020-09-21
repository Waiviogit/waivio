import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import urlParse from 'url-parse';

import { FormattedMessage, injectIntl } from 'react-intl';
import { getUserRankKey, getUserRank, getVoteValue } from '../helpers/user';
import AvatarLightbox from './AvatarLightbox';
import FollowButton from '../widgets/FollowButton';
import Action from './Button/Action';
import WeightTag from './WeightTag';
import USDDisplay from './Utils/USDDisplay';
import { unfollowUser, followUser } from '../user/usersActions';
import { getIsMobile } from '../reducers';
import BellButton from '../widgets/BellButton';

import './UserHeader.less';

const UserHeader = ({
  username,
  user,
  vestingShares,
  isSameUser,
  coverImage,
  hasCover,
  isFollowing,
  isActive,
  intl,
  rewardFund,
  rate,
  unfollow,
  follow,
  isGuest,
  isMobile,
}) => {
  const style = hasCover ? { backgroundImage: `url("${coverImage}")` } : {};
  let metadata = {};
  let location = null;
  let website = null;
  let about = null;
  let lastActive;

  if (user && user.posting_json_metadata && user.posting_json_metadata !== '') {
    lastActive = intl.formatRelative(Date.parse(user.updatedAt));

    if (user.posting_json_metadata.profile) {
      location = user.posting_json_metadata.profile.location;
      website = user.posting_json_metadata.profile.website;
      about = user.posting_json_metadata.profile.about;
    } else {
      try {
        metadata = JSON.parse(user.posting_json_metadata);
        location = metadata && get(metadata, 'profile.location');
        website = metadata && get(metadata, 'profile.website');
        about = metadata && get(metadata, 'profile.about');
      } catch (e) {
        // do nothing
      }
    }
  }

  if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
    website = `http://${website}`;
  }
  const url = urlParse(website);
  let hostWithoutWWW = url.host;

  if (hostWithoutWWW.indexOf('www.') === 0) {
    hostWithoutWWW = hostWithoutWWW.slice(4);
  }

  const voteWorth =
    user && rewardFund.recent_claims && rewardFund.reward_balance && rate
      ? getVoteValue(user, rewardFund.recent_claims, rewardFund.reward_balance, rate, 10000)
      : 0;

  const guestPrefix = ' (guest)';
  const mobileUserName = username.length < 26 ? username : `${`${username.slice(0, 20)}...`}`;
  const headerUserName = isMobile !== 'large' ? mobileUserName : username;

  return (
    <div className={classNames('UserHeader', { 'UserHeader--cover': hasCover })} style={style}>
      <div className="UserHeader__container">
        <AvatarLightbox username={user.name} size={100} isActive={isActive} />
        <div className="UserHeader__user">
          <div className="UserHeader__row">
            <h2 className="UserHeader__user__username">
              <span className="headerUsername">{headerUserName}</span>
              <WeightTag weight={user.wobjects_weight} />
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
                  <div className="UserHeader__buttons-container">
                    <FollowButton
                      unfollowUser={unfollow}
                      followUser={follow}
                      following={user.youFollows}
                      user={user}
                      followingType="user"
                    />
                    {user.youFollows && <BellButton user={user} />}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="UserHeader__handle-rank-container">
            <div className="UserHeader__row UserHeader__handle">
              @{user.name}
              {isGuest && guestPrefix}
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
      <div className="UserHeader__info-mobile">
        <p className="UserHeader__about">{about}</p>
        <div className="UserHeader__list">
          <div className="UserHeader__info-fields">
            {location && (
              <div>
                <i className="iconfont icon-coordinates text-icon" />
                {location}
              </div>
            )}
            <div>
              <i className="iconfont icon-dollar text-icon" />
              <FormattedMessage id="vote_price" defaultMessage="Vote Value" />:{' '}
              {isNaN(voteWorth) ? <USDDisplay value={0} /> : <USDDisplay value={voteWorth} />}
            </div>
          </div>
          <div className="UserHeader__info-fields">
            {website && (
              <div>
                <i className="iconfont icon-link text-icon" />
                <a target="_blank" rel="noopener noreferrer" href={website}>
                  {`${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`}
                </a>
              </div>
            )}
            <div>
              <i className="iconfont icon-time text-icon" />
              <FormattedMessage id="active_info" defaultMessage="Active" />: {lastActive}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserHeader.propTypes = {
  user: PropTypes.shape(),
  rate: PropTypes.number.isRequired,
  username: PropTypes.string,
  vestingShares: PropTypes.number,
  isSameUser: PropTypes.bool,
  coverImage: PropTypes.string,
  hasCover: PropTypes.bool,
  isFollowing: PropTypes.bool,
  isActive: PropTypes.bool.isRequired,
  rewardFund: PropTypes.shape({
    recent_claims: PropTypes.string,
    reward_balance: PropTypes.string,
  }).isRequired,
  intl: PropTypes.shape().isRequired,
  unfollow: PropTypes.func.isRequired,
  follow: PropTypes.func.isRequired,
  isGuest: PropTypes.bool,
  isMobile: PropTypes.bool.isRequired,
};

UserHeader.defaultProps = {
  user: {},
  username: '',
  handle: '',
  vestingShares: 0,
  isSameUser: false,
  coverImage: '',
  hasCover: false,
  isFollowing: false,
  onTransferClick: () => {},
  isGuest: false,
};

export default injectIntl(
  connect(
    state => ({
      isMobile: getIsMobile(state),
    }),
    {
      unfollow: unfollowUser,
      follow: followUser,
    },
  )(UserHeader),
);
