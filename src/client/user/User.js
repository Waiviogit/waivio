import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { get, isEmpty } from 'lodash';
import classNames from 'classnames';
import { getUserAccountHistory, openTransfer } from '../../store/walletStore/walletActions';
import { getUserAccount } from '../../store/usersStore/usersActions';
import { getAvatarURL } from '../components/Avatar';
import Error404 from '../statics/Error404';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import NotFound from '../statics/NotFound';
import { getMetadata } from '../../common/helpers/postingMetadata';
import { BXY_GUEST_PREFIX, GUEST_PREFIX } from '../../common/constants/waivio';
import DEFAULTS from '../object/const/defaultValues';
import Loading from '../components/Icon/Loading';
import {
  getAppUrl,
  getHelmetIcon,
  getRate,
  getRewardFund,
  getWebsiteName,
} from '../../store/appStore/appSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../store/authStore/authSelectors';
import {
  getAllUsers,
  getIsUserFailed,
  getIsUserLoaded,
  getUser,
} from '../../store/usersStore/usersSelectors';
import { getIsOpenWalletTable } from '../../store/walletStore/walletSelectors';

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    user: getUser(state, ownProps.match.params.name),
    loaded: getIsUserLoaded(state, ownProps.match.params.name),
    failed: getIsUserFailed(state, ownProps.match.params.name),
    rewardFund: getRewardFund(state),
    rate: getRate(state),
    allUsers: getAllUsers(state), // DO NOT DELETE! Auxiliary selector. Without it, "user" is not always updated
    isOpenWalletTable: getIsOpenWalletTable(state),
    helmetIcon: getHelmetIcon(state),
    siteName: getWebsiteName(state),
    appUrl: getAppUrl(state),
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
    helmetIcon: PropTypes.string.isRequired,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    loaded: PropTypes.bool,
    failed: PropTypes.bool,
    getUserAccount: PropTypes.func,
    getUserAccountHistory: PropTypes.func.isRequired,
    openTransfer: PropTypes.func,
    rate: PropTypes.number.isRequired,
    rewardFund: PropTypes.shape().isRequired,
    isOpenWalletTable: PropTypes.bool,
    siteName: PropTypes.string.isRequired,
    appUrl: PropTypes.string.isRequired,
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getUserAccount: () => {},
    openTransfer: () => {},
    isOpenWalletTable: false,
  };

  static fetchData({ store, match }) {
    return Promise.all([store.dispatch(getUserAccount(match.params.name))]);
  }

  componentDidMount() {
    const { name } = this.props.match.params;

    if (window.gtag) window.gtag('event', 'view_user_profile');

    this.props.getUserAccount(name);
    this.props.getUserAccountHistory(name);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.name !== this.props.match.params.name ||
      (!prevProps.authenticatedUserName && this.props.authenticatedUserName)
    ) {
      this.props.getUserAccount(this.props.match.params.name);
      this.props.getUserAccountHistory(this.props.match.params.name);
    }
  }

  handleTransferClick = () => {
    this.props.openTransfer(this.props.match.params.name);
  };

  render() {
    const {
      authenticated,
      authenticatedUser,
      loaded,
      failed,
      match,
      rewardFund,
      rate,
      user,
      isOpenWalletTable,
      helmetIcon,
      siteName,
      appUrl,
    } = this.props;

    if (failed) return <Error404 />;
    const username = this.props.match.params.name;

    if (!isEmpty(user) && !user.id && !user.fetching)
      return (
        <div className="main-panel">
          <NotFound
            item={username}
            title={'there_are_not user with name'}
            titleDefault={'Sorry! There are no user with name {item} on Waivio'}
          />
        </div>
      );

    const metadata = getMetadata(user);
    const profile = get(metadata, 'profile', {});

    let desc = `Posts by ${username}`;
    let displayedUsername = username;
    let coverImage = null;

    if (profile) {
      desc = profile.about || `Posts by ${username}`;
      displayedUsername = profile.name || username || '';
      coverImage = profile.cover_image;
    }
    const hasCover = !!coverImage;
    const image = getAvatarURL(username) || DEFAULTS.AVATAR;
    const url = `${appUrl}/@${username}`;
    const title = displayedUsername;
    const isSameUser = authenticated && authenticatedUser.name === username;
    const isAboutPage = match.params['0'] === 'about';
    const isGuest =
      match.params.name.startsWith(GUEST_PREFIX) || match.params.name.startsWith(BXY_GUEST_PREFIX);
    const currentClassName = isOpenWalletTable
      ? 'display-table'
      : classNames('center', { pa3: isAboutPage });

    return (
      <div className="main-panel">
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={url} />
          <meta property="description" content={desc} />
          <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta name="twitter:site" content={`@${siteName}`} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={desc} />
          <meta
            name="twitter:image"
            content={
              image ||
              'https://waivio.nyc3.digitaloceanspaces.com/1587571702_96367762-1996-4b56-bafe-0793f04a9d79'
            }
          />
          <meta property="og:title" content={title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image} />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="600" />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content={siteName} />
          <link id="favicon" rel="icon" href={helmetIcon} type="image/x-icon" />
        </Helmet>
        <ScrollToTopOnMount />
        {user.fetching ? (
          <Loading style={{ marginTop: '130px' }} />
        ) : (
          <UserHero
            authenticated={authenticated}
            user={user}
            username={displayedUsername}
            isSameUser={isSameUser}
            coverImage={coverImage}
            hasCover={hasCover}
            onTransferClick={this.handleTransferClick}
            rewardFund={rewardFund}
            rate={rate}
            isGuest={isGuest}
          />
        )}
        <div className="shifted">
          <div className={'feed-layout container'}>
            {!isOpenWalletTable && (
              <React.Fragment>
                <Affix className="leftContainer leftContainer__user" stickPosition={72}>
                  <div className={classNames('left', { 'display-none': isAboutPage })}>
                    <LeftSidebar />
                  </div>
                </Affix>
                <Affix className="rightContainer" stickPosition={72}>
                  <div className="right">{loaded && <RightSidebar key={user.name} />}</div>
                </Affix>
              </React.Fragment>
            )}
            {loaded && (
              <div className={currentClassName}>{renderRoutes(this.props.route.routes)}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
