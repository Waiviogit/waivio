import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import { currentUserFollowersUser } from '../helpers/apiHelpers';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getUser,
  getIsUserFailed,
  getIsUserLoaded,
  getAuthenticatedUserName,
} from '../reducers';
import { openTransfer } from '../wallet/walletActions';
import { getUserAccount } from './usersActions';
import { getAvatarURL } from '../components/Avatar';
import Error404 from '../statics/Error404';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    user: getUser(state, ownProps.match.params.name),
    loaded: getIsUserLoaded(state, ownProps.match.params.name),
    failed: getIsUserFailed(state, ownProps.match.params.name),
  }),
  {
    getUserAccount,
    openTransfer,
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
    const { user, authenticated, authenticatedUserName } = this.props;
    if (!user.id && !user.failed) {
      this.props.getUserAccount(this.props.match.params.name);
    }

    if (authenticated) {
      currentUserFollowersUser(authenticatedUserName, this.props.match.params.name).then(resp => {
        const result = _.head(resp);
        const followingUsername = _.get(result, 'following', '');
        const isFollowing = this.props.authenticatedUserName === followingUsername;
        this.setState({
          isFollowing,
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const diffUsername = this.props.match.params.name !== nextProps.match.params.name;
    const diffAuthUsername = this.props.authenticatedUserName !== nextProps.authenticatedUserName;
    if (diffUsername || diffAuthUsername) {
      currentUserFollowersUser(nextProps.authenticatedUserName, nextProps.match.params.name).then(
        resp => {
          const result = _.head(resp);
          const followingUsername = _.get(result, 'following', '');
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
    const { authenticated, authenticatedUser, loaded, failed } = this.props;
    const { isFollowing } = this.state;
    if (failed) return <Error404 />;
    const username = this.props.match.params.name;
    const { user } = this.props;
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
    const busyHost = global.postOrigin || 'https://waiviodev.com';
    const image = getAvatarURL(username) || '/images/logo.png';
    const canonicalUrl = `${busyHost}/@${username}`;
    const url = `${busyHost}/@${username}`;
    const title = `${displayedUsername} - Waivio`;

    const isSameUser = authenticated && authenticatedUser.name === username;

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
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="Waivio" />
          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@steemit'} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={desc} />
          <meta
            property="twitter:image"
            content={image || 'https://steemit.com/images/steemit-twshare.png'}
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
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={72}>
              <div className="right">{loaded && <RightSidebar key={user.name} />}</div>
            </Affix>
            {loaded && <div className="center">{renderRoutes(this.props.route.routes)}</div>}
          </div>
        </div>
      </div>
    );
  }
}
