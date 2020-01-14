import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import classNames from 'classnames';
import { currentUserFollowersUser } from '../helpers/apiHelpers';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getUser,
  getIsUserFailed,
  getIsUserLoaded,
  getAuthenticatedUserName,
  getUsersAccountHistory,
  getChatCondition,
} from '../reducers';
import { getUserAccountHistory, openTransfer } from '../wallet/walletActions';
import { getUserAccount } from './usersActions';
import { changeChatCondition } from './userActions';
import { setPostMessageAction } from '../components/Chat/chatActions';
import { getAvatarURL } from '../components/Avatar';
import Error404 from '../statics/Error404';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import { getUserDetailsKey } from '../helpers/stateHelpers';

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    user: getUser(state, ownProps.match.params.name),
    loaded: getIsUserLoaded(state, ownProps.match.params.name),
    failed: getIsUserFailed(state, ownProps.match.params.name),
    usersAccountHistory: getUsersAccountHistory(state),
    isChat: getChatCondition(state),
  }),
  {
    getUserAccount,
    openTransfer,
    getUserAccountHistory,
    changeChatCondition,
    setPostMessageAction,
  },
)
export default class User extends React.Component {
  static fetchData({ store, match }) {
    return store.dispatch(getUserAccount(match.params.name));
  }

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
    changeChatCondition: PropTypes.func.isRequired,
    isChat: PropTypes.bool.isRequired,
    setPostMessageAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getUserAccount: () => {},
    openTransfer: () => {},
  };

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
        const result = _.head(resp);
        const followingUsername = _.get(result, 'following', '');
        const isFollowing = this.props.authenticatedUserName === followingUsername;
        this.setState({
          isFollowing,
        });
      });
    }
    if (_.isEmpty(usersAccountHistory[getUserDetailsKey(match.params.name)])) {
      getUserAccountHistory(match.params.name);
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
    const { authenticated, authenticatedUser, loaded, failed, match } = this.props;
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
    const waivioHost = global.postOrigin || 'https://investarena.com';
    const image = getAvatarURL(username) || '/images/logo.png';
    const canonicalUrl = `${waivioHost}/@${username}`;
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
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="InvestArena" />
          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@steemit'} />
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
            changeChatCondition={this.props.changeChatCondition}
            setPostMessageAction={this.props.setPostMessageAction}
            isChat={this.props.isChat}
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
            <Affix className="leftContainer leftContainer__user" stickPosition={110}>
              <div className={classNames('left', { 'display-none': isAboutPage })}>
                <LeftSidebar />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={110}>
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
