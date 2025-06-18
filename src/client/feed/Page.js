import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { setGoogleTagEvent } from '../../common/helpers';
import { getFeedContent, getUserFeedContent } from '../../store/feedStore/feedActions';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import QuickPostEditor from '../components/QuickPostEditor/QuickPostEditor';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import {
  getIsAuthenticated,
  getIsLoaded,
  getAuthenticatedUserName,
} from '../../store/authStore/authSelectors';
import { getObject as getObjectState } from '../../store/wObjectStore/wObjectSelectors';
import { getAppUrl, getHelmetIcon, getSiteName } from '../../store/appStore/appSelectors';

@injectIntl
@withRouter
@connect(state => ({
  authenticated: getIsAuthenticated(state),
  loaded: getIsLoaded(state),
  wobject: getObjectState(state),
  helmetIcon: getHelmetIcon(state),
  appUrl: getAppUrl(state),
  siteName: getSiteName(state),
}))
class Page extends React.Component {
  static fetchData({ store, match }) {
    const { sortBy, category } = match.params;
    const userName = getAuthenticatedUserName(store.getState());

    if (userName && !sortBy) return store.dispatch(getUserFeedContent({ userName, limit: 20 }));

    return store.dispatch(getFeedContent({ sortBy: sortBy || 'trending', category, limit: 10 }));
  }

  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    helmetIcon: PropTypes.string.isRequired,
    appUrl: PropTypes.string.isRequired,
    siteName: PropTypes.string.isRequired,
    history: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    route: PropTypes.shape().isRequired,
    wobject: PropTypes.shape(),
  };

  static defaultProps = {
    authenticatedUserName: '',
    wobject: {},
    getObject: () => {},
  };

  componentDidMount() {
    setGoogleTagEvent('view_myfeed');
  }

  render() {
    const { authenticated, history, wobject, match, appUrl, siteName } = this.props;
    const isPageMode = true;
    const sortBy = authenticated ? match.params.sortBy : match.params.sortBy || 'trending';
    const description =
      'Discover Waivio, a unique social media platform built on the Hive blockchain. Earn crypto rewards for your posts and maintain full control over your social profile in a censorship-free environment. Dive into the future of social media with Waivio today.\n';
    const title = 'Waivio | Decentralized Social Media Platform on Hive Blockchain';
    const canonicalUrl = `${appUrl}${this.props.location?.pathname}`;

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={canonicalUrl} />
          <meta property="og:title" content={title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:image" content={this.props.helmetIcon} />
          <meta property="og:image:url" content={this.props.helmetIcon} />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="600" />
          <meta property="og:description" content={description} />
          <meta name="twitter:card" content={'summary_large_image'} />
          <meta name="twitter:site" content={`@${siteName}`} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" property="twitter:image" content={this.props.helmetIcon} />
          <meta property="og:site_name" content={siteName} />
          <link rel="image_src" href={this.props.helmetIcon} />
          <link id="favicon" rel="icon" href={this.props.helmetIcon} type="image/x-icon" />
        </Helmet>
        <ScrollToTop />
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer" stickPosition={77}>
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={77}>
              <div className="right">
                <RightSidebar />
              </div>
            </Affix>
            <div className="center">
              <MobileNavigation />
              {authenticated && <QuickPostEditor history={history} />}
              {renderRoutes(this.props.route.routes, {
                isPageMode,
                wobject,
                sortBy,
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
