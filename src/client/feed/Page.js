import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { Switch } from 'antd';
import { injectIntl } from 'react-intl';
import { cleanFeed, getFeedContent, getUserFeedContent } from './feedActions';
import { getIsLoaded, getIsAuthenticated, getAuthenticatedUserName } from '../reducers';
import SubFeed from './SubFeed';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import TopicSelector from '../components/TopicSelector';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import QuickPostEditor from '../components/QuickPostEditor/QuickPostEditor';

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
  };

  static defaultProps = {
    userName: '',
  };

  static fetchData({ store, match }) {
    const { sortBy, category } = match.params;
    return store.dispatch(getFeedContent({ sortBy, category, limit: 10 }));
  }

  state = {
    checked: false,
  };

  componentDidMount() {
    const isAppFilterOn = !localStorage.getItem('isAppFilterOff');
    if (isAppFilterOn !== this.state.checked) {
      this.reloadContent(isAppFilterOn);
      this.setState({ checked: isAppFilterOn });
    }
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
  handleChangeFeed = isAppFilterOn => {
    this.setState({ checked: isAppFilterOn });
    if (isAppFilterOn) {
      if (localStorage) localStorage.removeItem('isAppFilterOff');
    } else if (localStorage) {
      localStorage.setItem('isAppFilterOff', `true`);
    }
    this.reloadContent(isAppFilterOn);
  };

  reloadContent = isAppFilterOn => {
    this.props.cleanFeed();
    if (this.props.match.path === '/') {
      this.props.getFeedContent({
        sortBy: isAppFilterOn ? 'feed' : 'trending',
        category: isAppFilterOn ? 'wia_feed' : 'all',
        limit: 10,
      });
    } else {
      this.props.getUserFeedContent({ userName: this.props.userName, limit: 10 });
    }
  };

  render() {
    const {
      authenticated,
      location: { pathname },
      match,
    } = this.props;
    const { category, sortBy } = match.params;
    const robots = pathname === '/' ? 'index,follow' : 'noindex,follow';

    const shouldDisplaySelector = pathname !== '/my_feed' && pathname !== '/';

    return (
      <div>
        <Helmet>
          <title>Waivio</title>
          <meta name="robots" content={robots} />
        </Helmet>
        <ScrollToTop />
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer" stickPosition={115}>
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={115}>
              <div className="right">
                <RightSidebar />
              </div>
            </Affix>
            <div className="center">
              {shouldDisplaySelector && (
                <TopicSelector
                  isSingle={false}
                  sort={sortBy}
                  topics={category ? [category] : []}
                  onSortChange={this.handleSortChange}
                  onTopicClose={this.handleTopicClose}
                />
              )}
              {authenticated && <QuickPostEditor />}
              <div className="feed-layout__switcher">
                <div className="feed-layout__text">
                  {this.props.intl.formatMessage({
                    id: 'onlyRelated',
                    defaultMessage: 'Show only related posts',
                  })}
                </div>
                <Switch
                  defaultChecked
                  onChange={this.handleChangeFeed}
                  checked={this.state.checked}
                  size="small"
                />
              </div>
              <SubFeed />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
