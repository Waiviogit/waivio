import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import * as store from '../../reducers';
import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import SignUp from '../../components/Sidebar/SignUp';
import PostRecommendation from '../../components/Sidebar/PostRecommendation';
import Loading from '../../components/Icon/Loading';
import UserActivitySearch from '../../activity/UserActivitySearch';
import WalletSidebar from '../../components/Sidebar/WalletSidebar';
import ForecastBlock from '../../components/ForecastBlock';

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
          <Route
            path="/@:name"
            render={() =>
              authenticated ? (
                <React.Fragment>
                  <ForecastBlock username={match.params.name} renderPlace={'rightSidebar'} />
                  <InterestingPeople />
                </React.Fragment>
              ) : (
                <InterestingPeople />
              )
            }
          />
          <Route path="/" render={() => <InterestingPeople />} />
        </Switch>
        {showPostRecommendation && <PostRecommendation isAuthFetching={isAuthFetching} />}
      </div>
    );
  }
}
