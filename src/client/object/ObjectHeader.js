import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import WeightTag from '../components/WeightTag';
import ObjectLightbox from '../components/ObjectLightbox';
import FollowButton from '../widgets/FollowButton';
import Action from '../components/Button/Action';
import '../components/ObjectHeader.less';

const ObjectHeader = ({
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
    <div className={classNames('ObjectHeader', { 'ObjectHeader--cover': hasCover })} style={style}>
      <div className="ObjectHeader__container">
        <ObjectLightbox username={wobject} size={100} isActive={isActive} />
        <div className="ObjectHeader__user">
          <div className="ObjectHeader__row">
            <h2 className="ObjectHeader__user__username">
              {username}
              <WeightTag weight={wobject.weight} />
            </h2>
            <div className="ObjectHeader__user__buttons">
              <div
                className={classNames('ObjectHeader__user__button', {
                  'ObjectHeader__user__button-follows-you': isFollowing && !isSameUser,
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
          <div className="ObjectHeader__handle-rank-container">
            <div className="ObjectHeader__row ObjectHeader__handle">
              @{wobject.tag}
              {isFollowing && (
                <span className="ObjectHeader__follows-you">
                  <FormattedMessage id="follows_you" defaultMessage="Follows you" />
                </span>
              )}
            </div>
          </div>
          {isFollowing &&
            !isSameUser && (
              <span
                className={classNames(
                  'ObjectHeader__follows-you ObjectHeader__follows-you--mobile',
                  {
                    'ObjectHeader__follows-you-cover-text-color': hasCover,
                  },
                )}
              >
                <FormattedMessage id="follows_you" defaultMessage="Follows you" />
              </span>
            )}
        </div>
      </div>
    </div>
  );
};

ObjectHeader.propTypes = {
  username: PropTypes.string,
  handle: PropTypes.string,
  isSameUser: PropTypes.bool,
  coverImage: PropTypes.string,
  hasCover: PropTypes.bool,
  isFollowing: PropTypes.bool,
  wobject: PropTypes.shape(),
  isActive: PropTypes.bool.isRequired,
};

ObjectHeader.defaultProps = {
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

export default ObjectHeader;
