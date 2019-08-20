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
import ObjectWeightBlock from '../../components/Sidebar/ObjectWeightBlock';
import DiscoverObjectsFilters from '../../discoverObjects/DiscoverObjectsFilters';

@withRouter
@connect(state => ({
  authenticated: store.getIsAuthenticated(state),
  isAuthFetching: store.getIsAuthFetching(state),
}))
export default class RightSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    isAuthFetching: PropTypes.bool.isRequired,
    showPostRecommendation: PropTypes.bool,
    match: PropTypes.shape(),
  };

  static defaultProps = {
    showPostRecommendation: false,
    match: {},
  };

  render() {
    const { authenticated, showPostRecommendation, isAuthFetching, match } = this.props;

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
            render={() => authenticated && <ObjectWeightBlock username={match.params.name} />}
          />
          <Route path="/discover-objects/:objectType" component={DiscoverObjectsFilters} />
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
