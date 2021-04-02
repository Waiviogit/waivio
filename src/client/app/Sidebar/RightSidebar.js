import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import * as store from '../../reducers';
import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import InterestingObjects from '../../components/Sidebar/InterestingObjects';
import SignUp from '../../components/Sidebar/SignUp';
import PostRecommendation from '../../components/Sidebar/PostRecommendation';
import Loading from '../../components/Icon/Loading';
import UserActivitySearch from '../../activity/UserActivitySearch';
import WalletSidebar from '../../components/Sidebar/WalletSidebar';
import FeedSidebar from '../../components/Sidebar/FeedSidebar';
import ObjectExpertiseByType from '../../components/Sidebar/ObjectExpertiseByType/ObjectExpertiseByType';
import DiscoverFiltersSidebar from '../../discoverObjects/DiscoverFiltersSidebar/DiscoverFiltersSidebar';
import { getFeedFromState } from '../../helpers/stateHelpers';
import UserSidebar from './UserSidebar';

@withRouter
@connect(state => ({
  authenticated: store.getIsAuthenticated(state),
  authUserName: store.getAuthenticatedUserName(state),
  isAuthFetching: store.getIsAuthFetching(state),
  locale: store.getLocale(state),
  isGuest: store.isGuestUser(state),
  feed: store.getFeed(state),
  filters: store.getTags(state),
}))
export default class RightSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    isAuthFetching: PropTypes.bool,
    showPostRecommendation: PropTypes.bool,
    match: PropTypes.shape(),
    authUserName: PropTypes.string,
    locale: PropTypes.string,
    isGuest: PropTypes.bool,
    feed: PropTypes.shape().isRequired,
    filters: PropTypes.shape(),
  };

  static defaultProps = {
    showPostRecommendation: false,
    match: {},
    authUserName: '',
    locale: 'en-US',
    authenticated: false,
    isAuthFetching: false,
    isGuest: false,
    filters: [],
  };

  render() {
    const {
      authenticated,
      showPostRecommendation,
      isAuthFetching,
      match,
      authUserName,
      locale,
      isGuest,
      feed,
      filters,
    } = this.props;

    const content = getFeedFromState('blog', authUserName, feed);

    if (isAuthFetching) {
      return <Loading />;
    }
    return (
      <div>
        {!authenticated && <SignUp />}
        <Switch>
          <Route path="/activity" component={UserActivitySearch} />
          <Route path="/@:name/activity" component={UserActivitySearch} />
          <Route path="/@:name/transfers" render={() => <WalletSidebar />} />
          <Route path="/trending/:tag" component={FeedSidebar} />
          <Route path="/created/:tag" component={FeedSidebar} />
          <Route path="/hot/:tag" component={FeedSidebar} />
          <Route path="/promoted/:tag" component={FeedSidebar} />
          <Route
            path="/@:name"
            render={() => (
              <UserSidebar
                authenticated={authenticated}
                isGuest={isGuest}
                content={content}
                match={match}
                authUserName={authUserName}
                locale={locale}
                filters={filters}
              />
            )}
          />
          <Route
            path="/discover-objects/:typeName"
            render={() => (
              <React.Fragment>
                <DiscoverFiltersSidebar />
                <ObjectExpertiseByType match={match} />
              </React.Fragment>
            )}
          />
          <Route
            path="/"
            render={() => (
              <React.Fragment>
                <InterestingObjects />
                <InterestingPeople />
              </React.Fragment>
            )}
          />
        </Switch>

        {showPostRecommendation && <PostRecommendation isAuthFetching={isAuthFetching} />}
      </div>
    );
  }
}
