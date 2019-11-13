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
import ObjectExpertiseByType from '../../components/Sidebar/ObjectExpertiseByType/ObjectExpertiseByType';
import DiscoverFiltersSidebar from '../../discoverObjects/DiscoverFiltersSidebar/DiscoverFiltersSidebar';
import ObjectFilterBlock from '../../components/Sidebar/ObjectFilterBlock/ObjectFilterBlock';

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
            path="/discover-objects/:typeName"
            render={() => (
              <React.Fragment>
                <DiscoverFiltersSidebar />
                <ObjectExpertiseByType match={match} />
              </React.Fragment>
            )}
          />
          <Route
            path="/@:name"
            render={() =>
              authenticated && (
                <React.Fragment>
                  <ObjectWeightBlock username={match.params.name} />
                  <ObjectFilterBlock username={match.params.name} />
                </React.Fragment>
              )
            }
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
