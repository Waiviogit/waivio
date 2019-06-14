import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { getIsAuthenticated, getIsAuthFetching, getRandomExperts } from '../../reducers';
import { getRandomExperts as getRandomExpertsApi } from '../../user/usersActions';
import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import InterestingObjects from '../../components/Sidebar/InterestingObjects';
import SignUp from '../../components/Sidebar/SignUp';
import PostRecommendation from '../../components/Sidebar/PostRecommendation';
import Loading from '../../components/Icon/Loading';
import UserActivitySearch from '../../activity/UserActivitySearch';
import WalletSidebar from '../../components/Sidebar/WalletSidebar';
import FeedSidebar from '../../components/Sidebar/FeedSidebar';
import RightSidebarLoading from './RightSidebarLoading';
import ObjectWeightBlock from '../../components/Sidebar/ObjectWeightBlock';

@withRouter
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    isAuthFetching: getIsAuthFetching(state),
    randomExperts: getRandomExperts(state),
  }),
  {
    updateRandomExperts: getRandomExpertsApi,
  },
)
export default class RightSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    isAuthFetching: PropTypes.bool.isRequired,
    showPostRecommendation: PropTypes.bool,
    randomExperts: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
    updateRandomExperts: PropTypes.func,
    match: PropTypes.shape(),
  };

  static defaultProps = {
    showPostRecommendation: false,
    updateRandomExperts: () => {},
    recommendedObjects: [],
    match: {},
  };

  handleRandomExpertsRefresh = () => this.props.updateRandomExperts();

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
          <Route
            path="/"
            render={() => (
              <React.Fragment>
                <InterestingObjects />
                {authenticated &&
                  (this.props.randomExperts.length > 0 && !showPostRecommendation ? (
                    <InterestingPeople
                      users={this.props.randomExperts}
                      onRefresh={this.handleRandomExpertsRefresh}
                    />
                  ) : (
                    <RightSidebarLoading />
                  ))}
              </React.Fragment>
            )}
          />
        </Switch>
        {showPostRecommendation && <PostRecommendation isAuthFetching={isAuthFetching} />}
      </div>
    );
  }
}
