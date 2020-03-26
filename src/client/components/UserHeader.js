import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { Icon } from 'antd';
import urlParse from 'url-parse';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getUserRankKey, getUserRank, getVoteValue } from '../helpers/user';
import AvatarLightbox from './AvatarLightbox';
import FollowButton from '../widgets/FollowButton';
import Action from './Button/Action';
import WeightTag from './WeightTag';
import USDDisplay from './Utils/USDDisplay';

import './UserHeader.less';

const UserHeader = ({
  username,
  user,
  handle,
  wobjWeight,
  vestingShares,
  isSameUser,
  coverImage,
  hasCover,
  isFollowing,
  isActive,
  intl,
  rewardFund,
  rate,
}) => {
  const style = hasCover
    ? { backgroundImage: `url("https://steemitimages.com/2048x512/${coverImage}")` }
    : {};
  let metadata = {};
  let location = null;
  let website = null;
  let about = null;
  let lastActive;

  if (user && user.json_metadata && user.json_metadata !== '') {
    lastActive = intl.formatRelative(Date.parse(user.updatedAt));

    if (user.json_metadata.profile) {
      location = user.json_metadata.profile.location;
      website = user.json_metadata.profile.website;
      about = user.json_metadata.profile.about;
    } else {
      try {
        metadata = JSON.parse(user.json_metadata);
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
              {isNaN(voteWorth) ? (
                <Icon type="loading" className="text-icon-right" />
              ) : (
                <USDDisplay value={voteWorth} />
              )}
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
  handle: PropTypes.string,
  username: PropTypes.string,
  wobjWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
};

UserHeader.defaultProps = {
  user: {},
  username: '',
  handle: '',
  wobjWeight: '0',
  vestingShares: 0,
  isSameUser: false,
  coverImage: '',
  hasCover: false,
  isFollowing: false,
  onTransferClick: () => {},
};

export default injectIntl(UserHeader);
