import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { get, isEmpty } from 'lodash';
import classNames from 'classnames';
import { useParams } from 'react-router';

import {
  getGlobalProperties,
  getTokenBalance,
  getUserAccountHistory,
  openTransfer,
} from '../../store/walletStore/walletActions';
import { getUserAccount, getInfoForSideBar } from '../../store/usersStore/usersActions';
import { getAvatarURL } from '../components/Avatar';
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
  getSiteName,
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
import { resetBreadCrumb } from '../../store/shopStore/shopActions';
import { useSeoInfoWithAppUrl } from '../../hooks/useSeoInfo';
import Error404 from '../statics/Error404';
import {
  resetFavorites,
  setFavoriteObjects,
  setFavoriteObjectTypes,
} from '../../store/favoritesStore/favoritesActions';

const getDescriptions = (username, siteName) => ({
  activity: `Track real-time user interactions on our platform, backed by open blockchain technology. Experience unparalleled transparency and authenticity as you witness the vibrant activity of our community members.`,
  userShop: `Discover a wide selection of quality products at unbeatable prices. Shop with pleasure at ${siteName}, where finding and buying your favorite items is easy and enjoyable!`,
  comments: `Explore genuine user feedback! Dive into our collection of authentic comments left by engaged readers under our posts. Discover what our community is saying, share your thoughts, and join the conversation today.`,
  followers: `Explore the growing community of ${username}'s followers. Connect, engage, and discover like-minded individuals following ${username}. Join us today!`,
  following: `Explore the network of users that ${username} is following. Connect with like-minded individuals, discover new content, and expand your community with ${username}.`,
  transfers: `Explore ${username}'s Wallet page to view balances, transactions, and more. Experience the transparency and security of open blockchain technology with ${username}.`,
  'following-objects': `Discover the objects that ${username} follows, reflecting personal interests, passions, and curiosities. Browse the selection and find inspiration in ${username}'s choices.`,
  'expertise-hashtags': `Discover ${username}'s expertise in trending hashtags. Explore the topics and conversations that ${username} excels in, and engage with the community of experts.`,
  'expertise-objects': `View ${username}'s specialized expertise in various objects. Learn from a master, engage with in-depth content, and connect with a community passionate about the same subjects.`,
});

const getTitle = tab => {
  const titles = {
    transfers: 'wallet',
    userShop: 'shop',
    'following-objects': 'objects',
    'expertise-hashtags': 'hashtags expertise',
    'expertise-objects': 'objects expertise',
  };

  return titles[tab] || tab || '';
};

const User = props => {
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
  } = props;
  const { 0: tab, name } = useParams();

  useEffect(() => {
    props.getGlobalProperties();

    return () => props.resetBreadCrumb();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag)
      window.gtag('event', 'view_user_profile', { debug_mode: false });

    props.getUserAccount(name).then(res => props.getInfoForSideBar(name, res.las));
    props.getUserAccountHistory(name);
    props.getTokenBalance('WAIV', name);
    props.resetBreadCrumb();

    return () => props.resetFavorites();
  }, [name, props.authenticatedUserName]);

  const handleTransferClick = () => {
    props.openTransfer(name);
  };

  if (failed) return <Error404 />;

  const metadata = getMetadata(user);
  const profile = get(metadata, 'profile', {});

  const desc =
    getDescriptions(name, siteName)[match.params['0']] ||
    profile?.about ||
    "Browse a rich collection of user-generated posts, covering a myriad of topics. Engage with our diverse community's insights, stories, and perspectives. Share, comment, and become part of the conversation.";
  let displayedUsername = name;
  let coverImage = null;

  if (profile) {
    displayedUsername = profile.name || name || '';
    coverImage = typeof profile.cover_image === 'string' ? profile.cover_image : '';
  }

  const hasCover = !!coverImage;
  const image = getAvatarURL(name) || DEFAULTS.AVATAR;
  const { canonicalUrl } = useSeoInfoWithAppUrl(user?.canonical);
  const title = `${displayedUsername} ${getTitle(tab)}`;
  const isSameUser = authenticated && authenticatedUser.name === name;
  const isAboutPage = match.params['0'] === 'about';
  const isGuest = name.startsWith(GUEST_PREFIX) || name.startsWith(BXY_GUEST_PREFIX);
  const currentClassName = isOpenWalletTable
    ? 'display-table'
    : classNames('center', { pa3: isAboutPage });

  return (
    <div className="main-panel">
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={desc} />
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
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content={siteName} />
        <link id="favicon" rel="icon" href={helmetIcon} type="image/x-icon" />
      </Helmet>
      {!isEmpty(user) && !user.id && !user.fetching ? (
        <NotFound
          item={name}
          title={'there_are_not user with name'}
          titleDefault={'Sorry! There are no user with name {item} on Waivio'}
        />
      ) : (
        <React.Fragment>
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
              onTransferClick={handleTransferClick}
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
              {loaded && <div className={currentClassName}>{renderRoutes(props.route.routes)}</div>}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

User.propTypes = {
  route: PropTypes.shape().isRequired,
  authenticated: PropTypes.bool.isRequired,
  authenticatedUser: PropTypes.shape().isRequired,
  authenticatedUserName: PropTypes.string,
  helmetIcon: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired,
  loaded: PropTypes.bool,
  failed: PropTypes.bool,
  getTokenBalance: PropTypes.func,
  getUserAccountHistory: PropTypes.func.isRequired,
  resetBreadCrumb: PropTypes.func.isRequired,
  getGlobalProperties: PropTypes.func.isRequired,
  openTransfer: PropTypes.func,
  resetFavorites: PropTypes.func,
  getUserAccount: PropTypes.func,
  getInfoForSideBar: PropTypes.func,
  rate: PropTypes.number.isRequired,
  rewardFund: PropTypes.shape().isRequired,
  isOpenWalletTable: PropTypes.bool,
  siteName: PropTypes.string.isRequired,
};

User.defaultProps = {
  authenticatedUserName: '',
  loaded: false,
  failed: false,
  getUserAccount: () => {},
  openTransfer: () => {},
  isOpenWalletTable: false,
};

User.fetchData = async ({ store, match }) => {
  const promises = [
    store
      .dispatch(getUserAccount(match.params.name))
      .then(res => store.dispatch(getInfoForSideBar(match.params.name, res?.lastActivity))),
  ];

  // if (match.params[0] === 'favorites') {
  //   promises.push(
  //     store
  //       .dispatch(setFavoriteObjectTypes(match.params.name))
  //       .then(types =>
  //         Promise.allSettled([
  //           store.dispatch(setFavoriteObjects(match.params.name, types.value[0])),
  //         ]),
  //       ),
  //   );
  // }

  return Promise.allSettled([...promises]);
};

export default connect(
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
    siteName: getSiteName(state),
    appUrl: getAppUrl(state),
  }),
  {
    getUserAccount,
    openTransfer,
    getUserAccountHistory,
    getInfoForSideBar,
    getTokenBalance,
    getGlobalProperties,
    resetBreadCrumb,
    setFavoriteObjects,
    setFavoriteObjectTypes,
    resetFavorites,
    setFavObjects: setFavoriteObjects,
  },
)(User);
