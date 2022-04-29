import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { get, isEmpty, includes } from 'lodash';
import urlParse from 'url-parse';
import DollarIcon from '@icons/dollar.svg';

import { FormattedMessage, injectIntl } from 'react-intl';
import { getUserRankKey, getUserRank } from '../../../common/helpers/user';
import AvatarLightbox from '../../components/AvatarLightbox';
import FollowButton from '../../widgets/FollowButton';
import WeightTag from '../../components/WeightTag';
import USDDisplay from '../../components/Utils/USDDisplay';
import { unfollowUser, followUser, muteUserBlog } from '../../../store/usersStore/usersActions';
import BellButton from '../../widgets/BellButton';
import MuteModal from '../../widgets/MuteModal';
import UserPopoverMenu from '../../components/UserPopoverMenu';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getImagePathPost } from '../../../common/helpers/image';

import './UserHeader.less';

const UserHeader = ({
  username,
  user,
  vestingShares,
  isSameUser,
  coverImage,
  hasCover,
  isActive,
  intl,
  unfollow,
  follow,
  isGuest,
  authUserName,
  handleMuteUserBlog,
}) => {
  const [visible, setVisible] = useState(false);
  const style = hasCover ? { backgroundImage: `url("${getImagePathPost(coverImage)}")` } : {};
  const mutedByModerator = !isEmpty(user.mutedBy) && !includes(user.mutedBy, authUserName);
  const mutedLabelText = mutedByModerator ? 'Blocked' : 'Muted';
  const isMobileDevice = isMobile();

  let metadata = {};
  let location = null;
  let website = null;
  let about = null;
  let lastActive;

  const handleMuteCurrUser = () => setVisible(true);

  if (user && user.posting_json_metadata && user.posting_json_metadata !== '') {
    lastActive = intl.formatRelative(`${user.last_activity}Z`);

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

  const guestPrefix = ' (guest)';
  const mobileUserName = username.length < 26 ? username : `${`${username.slice(0, 20)}...`}`;
  const headerUserName = isMobileDevice ? mobileUserName : username;
  const buttons = isSameUser ? (
    <Link to="/edit-profile" className="UserHeader__edit">
      {intl.formatMessage({ id: 'edit_profile', defaultMessage: 'Edit profile' })}
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
      {user.muted && <span className="UserHeader__muteCard">{mutedLabelText}</span>}
      {!mutedByModerator && (
        <UserPopoverMenu
          user={user}
          handleMuteCurrUser={handleMuteCurrUser}
          handleUnMuteUserBlog={handleMuteUserBlog}
        />
      )}
    </div>
  );

  return (
    <div className={classNames('UserHeader', { 'UserHeader--cover': hasCover })} style={style}>
      <div className="UserHeader__container">
        <AvatarLightbox username={user.name} size={100} isActive={isActive} />
        <div className="UserHeader__user">
          <div className="UserHeader__flexWrap">
            <h2 className="UserHeader__name-container">
              <span className="UserHeader__name">{headerUserName}</span>
              <WeightTag weight={user.wobjects_weight} />
            </h2>
            {!isMobileDevice && buttons}
          </div>
          <div className="UserHeader__userInfo">
            <span className="UserHeader__nick">
              @{user.name}
              {isGuest && guestPrefix}
            </span>
            <div className="UserHeader__flexWrap">
              <div className="UserHeader__rank">
                <i className="iconfont icon-ranking" />
                <FormattedMessage
                  id={getUserRankKey(vestingShares)}
                  defaultMessage={getUserRank(vestingShares)}
                />
              </div>
              {!isGuest && (
                <div className="UserHeader__voteValue">
                  <img src={DollarIcon} alt={'dollar'} className="UserHeader__dollarIcon" />
                  <span>
                    <FormattedMessage id="vote_price" defaultMessage="Vote Value" />:{' '}
                    <USDDisplay value={user.totalVotingPowerPrice} />
                  </span>
                </div>
              )}
            </div>
            {isMobileDevice && buttons}
          </div>
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
            {!isGuest && (
              <div>
                <i className="iconfont icon-dollar text-icon" />
                <FormattedMessage id="vote_price" defaultMessage="Vote Value" />:{' '}
                <USDDisplay value={user.totalVotingPowerPrice} />
              </div>
            )}
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
      <MuteModal
        item={user}
        username={username}
        visible={visible}
        setVisibleMuteModal={setVisible}
      />
    </div>
  );
};

UserHeader.propTypes = {
  user: PropTypes.shape(),
  username: PropTypes.string,
  vestingShares: PropTypes.number,
  isSameUser: PropTypes.bool,
  coverImage: PropTypes.string,
  hasCover: PropTypes.bool,
  isActive: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  unfollow: PropTypes.func.isRequired,
  follow: PropTypes.func.isRequired,
  isGuest: PropTypes.bool,
  handleMuteUserBlog: PropTypes.func,
  authUserName: PropTypes.string,
};

UserHeader.defaultProps = {
  user: {},
  username: '',
  authUserName: '',
  handle: '',
  vestingShares: 0,
  isSameUser: false,
  coverImage: '',
  hasCover: false,
  handleMuteUserBlog: () => {},
  isGuest: false,
};

export default injectIntl(
  connect(
    state => ({
      authUserName: getAuthenticatedUserName(state),
    }),
    {
      unfollow: unfollowUser,
      follow: followUser,
      handleMuteUserBlog: muteUserBlog,
    },
  )(UserHeader),
);
