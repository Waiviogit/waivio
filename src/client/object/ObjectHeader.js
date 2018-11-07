import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import WeightTag from '../components/WeightTag';
import ObjectLightbox from '../components/ObjectLightbox';
import FollowButton from '../widgets/FollowButton';
import Action from '../components/Button/Action';
import '../components/UserHeader.less';

const UserHeader = ({
  username,
  wobject,
  handle,
  isSameUser,
  coverImage,
  hasCover,
  isFollowing,
  isActive,
}) => {
  const style = hasCover
    ? { backgroundImage: `url("https://steemitimages.com/2048x512/${coverImage}")` }
    : {};
  return (
    <div className={classNames('UserHeader', { 'UserHeader--cover': hasCover })} style={style}>
      <div className="UserHeader__container">
        <ObjectLightbox username={wobject} size={100} isActive={isActive} />
        <div className="UserHeader__user">
          <div className="UserHeader__row">
            <h2 className="UserHeader__user__username">
              {username}
              <WeightTag weight={wobject.weight} />
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
                  <FollowButton username={handle} />
                )}
              </div>
            </div>
          </div>
          <div className="UserHeader__handle-rank-container">
            <div className="UserHeader__row UserHeader__handle">
              @{wobject.tag}
              {isFollowing && (
                <span className="UserHeader__follows-you">
                  <FormattedMessage id="follows_you" defaultMessage="Follows you" />
                </span>
              )}
            </div>
          </div>
          {isFollowing &&
            !isSameUser && (
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
  handle: PropTypes.string,
  isSameUser: PropTypes.bool,
  coverImage: PropTypes.string,
  hasCover: PropTypes.bool,
  isFollowing: PropTypes.bool,
  wobject: PropTypes.shape(),
  isActive: PropTypes.bool.isRequired,
};

UserHeader.defaultProps = {
  username: '',
  handle: '',
  userReputation: '0',
  vestingShares: 0,
  isSameUser: false,
  coverImage: '',
  hasCover: false,
  isFollowing: false,
  wobject: {},
  onTransferClick: () => {},
};

export default UserHeader;
