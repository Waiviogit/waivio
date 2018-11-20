import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import WobjHeader from './WobjHeader';
import UserHeaderLoading from '../components/UserHeaderLoading';
import ObjectMenu from '../components/ObjectMenu';
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
class WobjMenuWrapper extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
  };

  onChange = key => {
    const { match, history } = this.props;
    const section = key === 'discussions' ? '' : `/${key}`;
    history.push(`${match.url.replace(/\/$/, '')}${section}`);
  };

  render() {
    const { match, location, history, ...otherProps } = this.props;
    // const current = this.props.location.pathname.split('/')[2];
    const currentKey = 'discussions';
    return <ObjectMenu defaultKey={currentKey} onChange={this.onChange} {...otherProps} />;
  }
}

const isUserActive = user =>
  activityFields.some(
    field =>
      new Date(new Date().valueOf() + new Date().getTimezoneOffset() * 60000).valueOf() -
        Date.parse(user[field]) <
      5 * 60 * 1000,
  );

const WobjHero = ({
  authenticated,
  wobject,
  user,
  username,
  coverImage,
  hasCover,
  isFollowing,
  onTransferClick,
}) => (
  <div>
    <Switch>
      <Route
        path="/object/@:name"
        render={() => (
          <div>
            {user.fetching ? (
              <UserHeaderLoading />
            ) : (
              <WobjHeader
                username={username}
                wobject={wobject}
                handle={user.name}
                coverImage={coverImage}
                hasCover={hasCover}
                isFollowing={isFollowing}
                onTransferClick={onTransferClick}
                isActive={isUserActive(user)}
              />
            )}
            <WobjMenuWrapper followers={wobject.followers ? wobject.followers.length : 0} />
          </div>
        )}
      />
      <Route render={() => (authenticated ? <Hero /> : <div />)} />
    </Switch>
  </div>
);

WobjHero.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  coverImage: PropTypes.string,
  hasCover: PropTypes.bool,
  isFollowing: PropTypes.bool,
  onTransferClick: PropTypes.func,
  wobject: PropTypes.shape(),
};

WobjHero.defaultProps = {
  isSameUser: false,
  coverImage: '',
  hasCover: false,
  isFollowing: false,
  isPopoverVisible: false,
  onTransferClick: () => {},
  wobject: {},
};

export default WobjHero;
