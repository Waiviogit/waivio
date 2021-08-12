import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { get, isEmpty } from 'lodash';
import classNames from 'classnames';
import { openTransfer } from '../../store/walletStore/walletActions';
import { getUserAccount } from '../../store/usersStore/usersActions';
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
import { getRate, getRewardFund } from '../../store/appStore/appSelectors';
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
import Seo from '../SEO/Seo';

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

  static fetchData({ store, match }) {
    return Promise.all([store.dispatch(getUserAccount(match.params.name))]);
  }

  componentDidMount() {
    const { name } = this.props.match.params;

    if (window.gtag) window.gtag('event', 'view_user_profile');

    this.props.getUserAccount(name);
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
    const isSameUser = authenticated && authenticatedUser.name === username;
    const isAboutPage = match.params['0'] === 'about';
    const isGuest =
      match.params.name.startsWith(GUEST_PREFIX) || match.params.name.startsWith(BXY_GUEST_PREFIX);
    const currentClassName = isOpenWalletTable
      ? 'display-table'
      : classNames('center', { pa3: isAboutPage });

    return (
      <div className="main-panel">
        <Seo image={image} desc={desc} title={displayedUsername} params={`/@${username}`} />
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
