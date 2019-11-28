import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { getFeedContent } from './feedActions';
import { getIsAuthenticated, getIsLoaded } from '../reducers';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import QuickPostEditor from '../components/QuickPostEditor/QuickPostEditor';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';

@injectIntl
@withRouter
@connect(state => ({
  authenticated: getIsAuthenticated(state),
  loaded: getIsLoaded(state),
}))
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
  };

  state = { isModalOpen: false };

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
    const { authenticated } = this.props;

    return (
      <div>
        <Helmet>
          <title>Waivio</title>
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
              {authenticated && <QuickPostEditor />}
              {renderRoutes(this.props.route.routes)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
