import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { getFeedContent } from './feedActions';
import {
  getIsAuthenticated,
  getIsLoaded,
  getAuthenticatedUserName,
  getSuitableLanguage,
  getObject as getObjectState,
} from '../reducers';
import { getObject } from '../object/wobjectsActions';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import QuickPostEditor from '../components/QuickPostEditor/QuickPostEditor';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';

@injectIntl
@withRouter
@connect(
  state => ({
    authenticatedUserName: getAuthenticatedUserName(state),
    authenticated: getIsAuthenticated(state),
    loaded: getIsLoaded(state),
    locale: getSuitableLanguage(state),
    wobject: getObjectState(state),
  }),
  {
    getObject,
  },
)
class Page extends React.Component {
  static fetchData({ store, match }) {
    const { sortBy, category } = match.params;
    return store.dispatch(getFeedContent({ sortBy, category, limit: 10 }));
  }

  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    route: PropTypes.shape().isRequired,
    authenticatedUserName: PropTypes.string,
    wobject: PropTypes.shape(),
    getObject: PropTypes.func,
  };

  static defaultProps = {
    authenticatedUserName: '',
    wobject: {},
    getObject: () => {},
  };

  componentDidMount() {
    const { authenticatedUserName } = this.props;
    const wobjectPermlink = location.pathname.split('/feed/')[1];
    this.props.getObject(wobjectPermlink, authenticatedUserName);
  }

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
    const { authenticated, history, wobject } = this.props;
    const isPageMode = true;

    return (
      <div>
        <Helmet>
          <title>Waivio</title>
          <meta
            property="twitter:description"
            content="Waivio is an open distributed attention marketplace for business"
          />
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
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
