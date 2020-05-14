import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { Switch } from 'antd';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { cleanFeed, getFeedContent, getUserFeedContent } from './feedActions';
import { getIsLoaded, getIsAuthenticated, getAuthenticatedUserName } from '../reducers';
import SubFeed from './SubFeed';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import QuickPostEditor from '../components/QuickPostEditor/QuickPostEditor';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import HeroBannerContainer from './HeroBannerContainer';

@withRouter
@injectIntl
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    loaded: getIsLoaded(state),
    userName: getAuthenticatedUserName(state),
  }),
  {
    cleanFeed,
    getFeedContent,
    getUserFeedContent,
  },
)
class Page extends React.Component {
  static fetchData({ store, match }) {
    const { sortBy, category } = match.params;
    return store.dispatch(getFeedContent({ sortBy, category, limit: 10 }));
  }

  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    cleanFeed: PropTypes.func.isRequired,
    getFeedContent: PropTypes.func.isRequired,
    getUserFeedContent: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    userName: PropTypes.string,
    isMobileNavMenuOpen: PropTypes.bool.isRequired,
    toggleMobileNavMenu: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userName: '',
  };

  state = {
    checked: false,
    isNewFeed: false,
    isFetching: false,
  };

  componentDidMount() {
    if (this.props.match.path === '/') {
      const isAppFilterOn = !localStorage.getItem('isAppHomeFilterOff');
      const isCategoryFilterOn = !localStorage.getItem('isCategoryFilterOff');
      if (isAppFilterOn !== this.state.checked) {
        this.reloadContent(isCategoryFilterOn, isAppFilterOn);
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ checked: isAppFilterOn, isNewFeed: isCategoryFilterOn });
      }
    } else {
      const isAppFilterOn = localStorage.getItem('isAppMyFeedFilterOn');
      if (isAppFilterOn !== this.state.checked) {
        this.reloadContent();
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ checked: isAppFilterOn });
      }
    }
  }

  setFetched = value => this.setState({ isFetching: value });

  handleChangeFeed = isAppFilterOn => {
    const { isNewFeed } = this.state;
    this.setState({ checked: !!isAppFilterOn });
    if (typeof localStorage !== 'undefined') {
      if (this.props.match.path === '/') {
        // eslint-disable-next-line no-unused-expressions
        isAppFilterOn
          ? localStorage.removeItem('isAppHomeFilterOff')
          : localStorage.setItem('isAppHomeFilterOff', `true`);
      } else {
        // eslint-disable-next-line no-unused-expressions
        isAppFilterOn
          ? localStorage.setItem('isAppMyFeedFilterOn', `true`)
          : localStorage.removeItem('isAppMyFeedFilterOn');
      }
    }
    this.reloadContent(isNewFeed, isAppFilterOn);
  };

  handleChangeFeedCategory = isCategoryFilterOn => {
    const { checked } = this.state;
    this.setState({ isNewFeed: !!isCategoryFilterOn });
    if (typeof localStorage !== 'undefined') {
      if (this.props.match.path === '/') {
        // eslint-disable-next-line no-unused-expressions
        isCategoryFilterOn
          ? localStorage.removeItem('isCategoryFilterOff')
          : localStorage.setItem('isCategoryFilterOff', `true`);
      }
    }
    this.reloadContent(isCategoryFilterOn, checked);
  };

  reloadContent = (isCategoryFilter = false, isCryptoFilter = false) => {
    this.props.cleanFeed();
    if (this.props.match.path === '/') {
      this.props.getFeedContent({
        sortBy: isCategoryFilter ? 'trending' : 'created',
        category: isCryptoFilter ? 'crypto_feed' : 'all',
        limit: 10,
      });
    } else {
      this.props.getUserFeedContent({ userName: this.props.userName, limit: 10 });
    }
  };

  render() {
    const {
      authenticated,
      history,
      match,
      location: { pathname },
      toggleMobileNavMenu,
      isMobileNavMenuOpen,
    } = this.props;
    const { isFetching } = this.state;
    const robots = pathname === '/' ? 'index,follow' : 'noindex,follow';
    const isHomePage = match.path === '/';
    return (
      <div>
        <Helmet>
          <title>InvestArena</title>
          <meta name="robots" content={robots} />
        </Helmet>
        <ScrollToTop />
        <ScrollToTopOnMount />
        <HeroBannerContainer />
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer" stickPosition={116}>
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={116}>
              <div className="right">
                <RightSidebar />
              </div>
            </Affix>
            <div className="center">
              <MobileNavigation
                toggleMobileNavMenu={toggleMobileNavMenu}
                isMobileNavMenuOpen={isMobileNavMenuOpen}
              />
              {authenticated && <QuickPostEditor history={history} />}
              <div className={classNames('feed-layout__switcher', { 'justify-end': !isHomePage })}>
                {isHomePage && (
                  <div className="feed-layout__switcher-item">
                    <div className="feed-layout__text">
                      {this.props.intl.formatMessage({
                        id: 'feed_new',
                        defaultMessage: 'New',
                      })}
                    </div>
                    <Switch
                      defaultChecked
                      onChange={this.handleChangeFeedCategory}
                      disabled={isFetching}
                      checked={this.state.isNewFeed}
                      size="small"
                    />
                    <div className="feed-layout__text">
                      {this.props.intl.formatMessage({
                        id: 'feed_by_profit',
                        defaultMessage: 'By profit',
                      })}
                    </div>
                  </div>
                )}
                <div className="feed-layout__switcher-item">
                  <div className="feed-layout__text">
                    {this.props.intl.formatMessage({
                      id: 'feed_all',
                      defaultMessage: 'All',
                    })}
                  </div>
                  <Switch
                    defaultChecked
                    onChange={this.handleChangeFeed}
                    disabled={isFetching}
                    checked={this.state.checked}
                    size="small"
                  />
                  <div className="feed-layout__text">
                    {this.props.intl.formatMessage({
                      id: 'feed_only_crypto',
                      defaultMessage: 'Only crypto',
                    })}
                  </div>
                </div>
              </div>
              <SubFeed setFetched={this.setFetched} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
