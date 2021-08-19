import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { getFeedContent } from '../../store/feedStore/feedActions';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import QuickPostEditor from '../components/QuickPostEditor/QuickPostEditor';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import { getIsAuthenticated, getIsLoaded } from '../../store/authStore/authSelectors';
import { getObject as getObjectState } from '../../store/wObjectStore/wObjectSelectors';
import { getCurrentHost, getHelmetIcon } from '../../store/appStore/appSelectors';

@injectIntl
@withRouter
@connect(state => ({
  authenticated: getIsAuthenticated(state),
  loaded: getIsLoaded(state),
  wobject: getObjectState(state),
  helmetIcon: getHelmetIcon(state),
  host: getCurrentHost(state),
}))
class Page extends React.Component {
  static fetchData({ store, match }) {
    const { sortBy, category } = match.params;

    return store.dispatch(getFeedContent({ sortBy, category, limit: 10 }));
  }

  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    helmetIcon: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    route: PropTypes.shape().isRequired,
    wobject: PropTypes.shape(),
  };

  static defaultProps = {
    authenticatedUserName: '',
    wobject: {},
    getObject: () => {},
  };

  handleSortChange = key => {
    const { category } = this.props.match.params;

    if (category) {
      this.props.history.push(`/${key}/${category}`);
    } else {
      this.props.history.push(`/${key}`);
    }
  };

  handleTopicClose = () => this.props.history.push('/trending');

  render() {
    const { authenticated, history, wobject, match } = this.props;
    const isPageMode = true;
    const sortBy = authenticated ? match.params.sortBy : match.params.sortBy || 'trending';
    const description = 'Waivio is an open distributed attention marketplace for business';

    return (
      <div>
        <Helmet>
          <title>Waivio</title>
          <meta property="description" content={description} />
          <link rel="canonical" href={this.props.host} />
          <meta property="og:title" content={'Waivio'} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={this.props.host} />
          <meta property="og:image" content={this.props.helmetIcon} />
          <meta property="og:image:url" content={this.props.helmetIcon} />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="600" />
          <meta property="og:description" content={description} />
          <meta name="twitter:card" content={'summary_large_image'} />
          <meta name="twitter:site" content={'@waivio'} />
          <meta name="twitter:title" content={'Waivio'} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" property="twitter:image" content={this.props.helmetIcon} />
          <meta property="og:site_name" content={'Waivio'} />
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
