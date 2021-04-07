import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { get, isEmpty } from 'lodash';
import classNames from 'classnames';
import { getIsOpenWalletTable, getUsersAccountHistory } from '../store/reducers';
import { getUserAccountHistory, openTransfer } from '../wallet/walletActions';
import { getUserAccount } from '../store/usersStore/usersActions';
import { getAvatarURL } from '../components/Avatar';
import Error404 from '../statics/Error404';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import NotFound from '../statics/NotFound';
import { getMetadata } from '../helpers/postingMetadata';
import { BXY_GUEST_PREFIX, GUEST_PREFIX } from '../../common/constants/waivio';
import DEFAULTS from '../object/const/defaultValues';
import Loading from '../components/Icon/Loading';
import { getHelmetIcon, getRate, getRewardFund } from '../store/appStore/appSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../store/authStore/authSelectors';
import {
  getAllUsers,
  getIsUserFailed,
  getIsUserLoaded,
  getUser,
} from '../store/usersStore/usersSelectors';

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    user: getUser(state, ownProps.match.params.name),
    loaded: getIsUserLoaded(state, ownProps.match.params.name),
    failed: getIsUserFailed(state, ownProps.match.params.name),
    usersAccountHistory: getUsersAccountHistory(state),
    rewardFund: getRewardFund(state),
    rate: getRate(state),
    allUsers: getAllUsers(state), // DO NOT DELETE! Auxiliary selector. Without it, "user" is not always updated
    isOpenWalletTable: getIsOpenWalletTable(state),
    helmetIcon: getHelmetIcon(state),
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
    openTransfer: PropTypes.func,
    getUserAccountHistory: PropTypes.func.isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    rate: PropTypes.number.isRequired,
    rewardFund: PropTypes.shape().isRequired,
    isOpenWalletTable: PropTypes.bool,
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getUserAccount: () => {},
    openTransfer: () => {},
    isOpenWalletTable: false,
  };

  componentDidMount() {
    const {
      usersAccountHistory,
      // eslint-disable-next-line no-shadow
      getUserAccountHistory,
      match,
    } = this.props;

    this.props.getUserAccount(match.params.name);

    if (isEmpty(usersAccountHistory[match.params.name])) getUserAccountHistory(match.params.name);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.name !== this.props.match.params.name ||
      (!prevProps.authenticatedUserName && this.props.authenticatedUserName)
    ) {
      this.props.getUserAccount(this.props.match.params.name);
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
    const waivioHost = global.postOrigin || 'https://www.waivio.com';
    const image = getAvatarURL(username) || DEFAULTS.AVATAR;
    const canonicalUrl = `https://www.waivio.com/@${username}`;
    const url = `${waivioHost}/@${username}`;
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
          <link rel="canonical" href={canonicalUrl} />
          <meta name="description" property="description" content={desc} />
          <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta name="twitter:site" content={'@waivio'} />
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
          <meta property="og:site_name" content="Waivio" />
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
            onFollowClick={this.handleFollowClick}
            onTransferClick={this.handleTransferClick}
            rewardFund={rewardFund}
            rate={rate}
            isGuest={isGuest}
          />
        )}
        <div className="shifted">
          <div className={`feed-layout ${isOpenWalletTable ? 'table-wrap' : 'container'}`}>
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
