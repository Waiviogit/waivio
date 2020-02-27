import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { get, head, isEmpty } from 'lodash';
import classNames from 'classnames';
import { currentUserFollowersUser } from '../helpers/apiHelpers';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsUserFailed,
  getIsUserLoaded,
  getUser,
  getUsersAccountHistory,
} from '../reducers';
import { getUserAccountHistory, openTransfer } from '../wallet/walletActions';
import { getUserAccount } from './usersActions';
import { getAvatarURL } from '../components/Avatar';
import Error404 from '../statics/Error404';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import { getUserDetailsKey } from '../helpers/stateHelpers';
import NotFound from '../statics/NotFound';

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    user: getUser(state, ownProps.match.params.name),
    loaded: getIsUserLoaded(state, ownProps.match.params.name),
    failed: getIsUserFailed(state, ownProps.match.params.name),
    usersAccountHistory: getUsersAccountHistory(state),
  }),
  {
    getUserAccount,
    openTransfer,
    getUserAccountHistory,
  },
)
export default class User extends React.Component {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    authenticatedUserName: PropTypes.string,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    loaded: PropTypes.bool,
    failed: PropTypes.bool,
    getUserAccount: PropTypes.func,
    openTransfer: PropTypes.func,
    getUserAccountHistory: PropTypes.func.isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getUserAccount: () => {},
    openTransfer: () => {},
  };

  static fetchData({ store, match }) {
    return store.dispatch(getUserAccount(match.params.name));
  }

  state = {
    isFollowing: false,
  };

  componentDidMount() {
    const {
      user,
      authenticated,
      authenticatedUserName,
      usersAccountHistory,
      // eslint-disable-next-line no-shadow
      getUserAccountHistory,
      match,
    } = this.props;
    if (!user.id && !user.failed) {
      this.props.getUserAccount(this.props.match.params.name);
    }

    if (authenticated) {
      currentUserFollowersUser(authenticatedUserName, this.props.match.params.name).then(resp => {
        const result = head(resp);
        const followingUsername = get(result, 'following', null);
        const isFollowing = this.props.authenticatedUserName === followingUsername;
        this.setState({
          isFollowing,
        });
      });
    }
    if (isEmpty(usersAccountHistory[getUserDetailsKey(match.params.name)])) {
      getUserAccountHistory(match.params.name);
    }
  }

  componentWillReceiveProps(nextProps) {
    const diffUsername = this.props.match.params.name !== nextProps.match.params.name;
    const diffAuthUsername = this.props.authenticatedUserName !== nextProps.authenticatedUserName;
    if (diffUsername || diffAuthUsername) {
      currentUserFollowersUser(nextProps.authenticatedUserName, nextProps.match.params.name).then(
        resp => {
          const result = head(resp);
          const followingUsername = get(result, 'following', null);
          const isFollowing = nextProps.authenticatedUserName === followingUsername;
          this.setState({
            isFollowing,
          });
        },
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.props.getUserAccount(this.props.match.params.name);
    }
  }

  handleTransferClick = () => {
    this.props.openTransfer(this.props.match.params.name);
  };

  render() {
    const { authenticated, authenticatedUser, loaded, failed, match } = this.props;
    const { isFollowing } = this.state;
    if (failed) return <Error404 />;
    const username = this.props.match.params.name;
    const { user } = this.props;
    if (!user.id && !user.fetching)
      return (
        <div className="main-panel">
          <NotFound
            item={username}
            title={'there_are_not user with name'}
            titleDefault={'Sorry! There are no user with name {item} on Waivio'}
          />
        </div>
      );
    let profile = {};
    try {
      if (user.json_metadata) {
        if (user.json_metadata.profile) {
          profile = user.json_metadata.profile;
        } else {
          profile = JSON.parse(user.json_metadata).profile;
        }
      }
    } catch (error) {
      // jsonMetadata = user.json_metadata || {}
    }
    let desc = `Posts by ${username}`;
    let displayedUsername = username;
    let coverImage = null;
    if (profile) {
      desc = profile.about || `Posts by ${username}`;
      displayedUsername = profile.name || username || '';
      coverImage = profile.cover_image;
    }
    const hasCover = !!coverImage;
    const waivioHost = global.postOrigin || 'https://www.waivio.com';
    const image = getAvatarURL(username) || '/images/logo.png';
    const canonicalUrl = `https://www.waivio.com/@${username}`;
    const url = `${waivioHost}/@${username}`;
    const title = `${displayedUsername} - Waivio`;

    const isSameUser = authenticated && authenticatedUser.name === username;
    const isAboutPage = match.params['0'] === 'about';

    return (
      <div className="main-panel">
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta property="description" content={desc} />
          <meta property="og:title" content={title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image} />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="600" />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="Waivio" />
          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@waivio'} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={desc} />
          <meta
            property="twitter:image"
            content={
              image ||
              'https://cdn.steemitimages.com/DQmVRiHgKNWhWpDXSmD7ZK4G48mYkLMPcoNT8VzgXNWZ8aN/image.png'
            }
          />
        </Helmet>
        <ScrollToTopOnMount />
        {user && (
          <UserHero
            authenticated={authenticated}
            user={user}
            username={displayedUsername}
            isSameUser={isSameUser}
            coverImage={coverImage}
            isFollowing={isFollowing}
            hasCover={hasCover}
            onFollowClick={this.handleFollowClick}
            onTransferClick={this.handleTransferClick}
          />
        )}
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer leftContainer__user" stickPosition={72}>
              <div className={classNames('left', { 'display-none': isAboutPage })}>
                <LeftSidebar />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={72}>
              <div className="right">{loaded && <RightSidebar key={user.name} />}</div>
            </Affix>
            {loaded && (
              <div className={classNames('center', { pa3: isAboutPage })}>
                {renderRoutes(this.props.route.routes)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
