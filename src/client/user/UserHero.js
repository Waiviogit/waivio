import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import UserHeader from '../components/UserHeader';
import UserHeaderLoading from '../components/UserHeaderLoading';
import UserMenu from '../components/UserMenu';
import Hero from '../components/Hero';

const activityFields = [
  'last_owner_update',
  'last_account_update',
  'last_vote_time',
  'last_account_recovery',
  'last_post',
  'last_root_post',
];

@withRouter
class UserMenuWrapper extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    objectsSharesCount: PropTypes.number,
  };
  static defaultProps = {
    objectsSharesCount: 0,
  };

  onChange = key => {
    const { match, history } = this.props;
    const section = key === 'discussions' ? '' : `/${key}`;
    history.push(`${match.url.replace(/\/$/, '')}${section}`);
  };

  render() {
    const { match, location, history, ...otherProps } = this.props;
    const current = this.props.location.pathname.split('/')[2];
    const currentKey = current || 'discussions';
    return <UserMenu defaultKey={currentKey} onChange={this.onChange} {...otherProps} />;
  }
}

const isUserActive = user =>
  activityFields.some(
    field =>
      new Date(new Date().valueOf() + new Date().getTimezoneOffset() * 60000).valueOf() -
        Date.parse(user[field]) <
      5 * 60 * 1000,
  );

const UserHero = ({
  authenticated,
  user,
  username,
  isSameUser,
  coverImage,
  hasCover,
  isFollowing,
  onTransferClick,
  changeChatCondition,
  isChat,
  setPostMessageAction,
  isGuest,
  isGuestPage,
}) => {
  const objectsFollowingCount = user.objects_following_count ? user.objects_following_count : 0;
  const usersFollowingCount = user.users_following_count ? user.users_following_count : 0;
  const followingCount = usersFollowingCount + objectsFollowingCount;
  const followersCount = user.followers_count ? user.followers_count : 0;

  return (
    <div>
      <Switch>
        <Route
          path="/@:name"
          render={() => (
            <div>
              {user.fetching ? (
                <UserHeaderLoading />
              ) : (
                <UserHeader
                  isGuest={isGuest}
                  isGuestPage={isGuestPage}
                  username={username}
                  authenticated={authenticated}
                  isChat={isChat}
                  changeChatCondition={changeChatCondition}
                  setPostMessageAction={setPostMessageAction}
                  handle={user.name}
                  wobjWeight={user.wobjects_weight}
                  vestingShares={parseFloat(user.vesting_shares)}
                  isSameUser={isSameUser}
                  coverImage={coverImage}
                  hasCover={hasCover}
                  isFollowing={isFollowing}
                  onTransferClick={onTransferClick}
                  isActive={isUserActive(user)}
                />
              )}
              <UserMenuWrapper
                followers={followersCount}
                following={followingCount}
                isGuest={isGuest}
              />
            </div>
          )}
        />
        <Route render={() => (authenticated ? <Hero /> : <div />)} />
      </Switch>
    </div>
  );
};

UserHero.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  isSameUser: PropTypes.bool,
  coverImage: PropTypes.string,
  hasCover: PropTypes.bool,
  isFollowing: PropTypes.bool,
  onTransferClick: PropTypes.func,
  changeChatCondition: PropTypes.func.isRequired,
  isChat: PropTypes.bool.isRequired,
  setPostMessageAction: PropTypes.func.isRequired,
  isGuest: PropTypes.bool,
  isGuestPage: PropTypes.bool,
};

UserHero.defaultProps = {
  isSameUser: false,
  coverImage: '',
  hasCover: false,
  isFollowing: false,
  isPopoverVisible: false,
  onTransferClick: () => {},
  isGuest: false,
  isGuestPage: false,
};

export default UserHero;
