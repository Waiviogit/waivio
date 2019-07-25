import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { Switch } from 'antd';
import { injectIntl } from 'react-intl';
import { cleanFeed, getFeedContent, getUserFeedContent } from './feedActions';
import { getIsAuthenticated, getAuthenticatedUserName } from '../reducers';
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
    userName: PropTypes.string.isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
  };

  static fetchData({ store, match }) {
    const { sortBy, category } = match.params;
    return store.dispatch(getFeedContent({ sortBy, category, limit: 10 }));
  }

  state = {
    checked: false,
  };

  componentDidMount() {
    this.setState({
      checked: !localStorage.getItem('isAppFilterOff'),
    });
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
  handleChangeFeed = () => {
    this.state.checked
      ? localStorage.setItem('isAppFilterOff', `true`)
      : localStorage.removeItem('isAppFilterOff');
    this.props.cleanFeed();
    this.props.match.path === '/'
      ? this.props.getFeedContent({ sortBy: 'wia_feed', category: null, limit: 10 })
      : this.props.getUserFeedContent({ userName: this.props.userName, limit: 10 });
    this.setState({ checked: !this.state.checked });
  };

  render() {
    const {
      authenticated,
      location: { pathname },
      match,
    } = this.props;
    const { category, sortBy } = match.params;
    const robots = location.pathname === '/' ? 'index,follow' : 'noindex,follow';

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
