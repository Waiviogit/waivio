import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import * as store from '../../reducers';
import { getRandomExperts } from '../../user/usersActions';
import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import SignUp from '../../components/Sidebar/SignUp';
import PostRecommendation from '../../components/Sidebar/PostRecommendation';
import Loading from '../../components/Icon/Loading';
import UserActivitySearch from '../../activity/UserActivitySearch';
import WalletSidebar from '../../components/Sidebar/WalletSidebar';
import ObjectWeightBlock from '../../components/Sidebar/ObjectWeightBlock';

@withRouter
@connect(
  state => ({
    authenticated: store.getIsAuthenticated(state),
    isAuthFetching: store.getIsAuthFetching(state),
    randomExperts: store.getRandomExperts(state),
    randomExpertsLoaded: store.getRandomExpertsLoaded(state),
  }),
  {
    getRandomExperts,
  },
)
export default class RightSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    isAuthFetching: PropTypes.bool.isRequired,
    showPostRecommendation: PropTypes.bool,
    randomExperts: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
    randomExpertsLoaded: PropTypes.bool.isRequired,
    getRandomExperts: PropTypes.func,
    match: PropTypes.shape(),
  };

  static defaultProps = {
    showPostRecommendation: false,
    getRandomExperts: () => {},
    recommendedObjects: [],
    match: {},
  };

  componentDidMount() {
    if (!this.props.randomExpertsLoaded) {
      this.props.getRandomExperts();
    }
  }

  handleRandomExpertsRefresh = () => this.props.getRandomExperts();

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
            render={() => authenticated && <ObjectWeightBlock username={match.params.name} />}
          />
          <Route
            path="/"
            render={() => (
                <InterestingPeople
                  users={this.props.randomExperts}
                  onRefresh={this.handleRandomExpertsRefresh}
                />
            )}
          />
        </Switch>
        {showPostRecommendation && <PostRecommendation isAuthFetching={isAuthFetching} />}
      </div>
    );
  }
}
