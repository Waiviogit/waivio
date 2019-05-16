import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { getIsAuthenticated, getIsAuthFetching, getRecommendations } from '../../reducers';
import { updateRecommendations } from '../../user/userActions';
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
    recommendations: getRecommendations(state),
  }),
  {
    updateRecommendations,
  },
)
export default class RightSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    isAuthFetching: PropTypes.bool.isRequired,
    showPostRecommendation: PropTypes.bool,
    recommendations: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
    updateRecommendations: PropTypes.func,
    match: PropTypes.shape(),
  };

  static defaultProps = {
    showPostRecommendation: false,
    updateRecommendations: () => {},
    recommendedObjects: [],
    match: {},
  };

  handleInterestingPeopleRefresh = () => this.props.updateRecommendations();

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
                  (this.props.recommendations.length > 0 && !showPostRecommendation ? (
                    <InterestingPeople
                      users={this.props.recommendations}
                      onRefresh={this.handleInterestingPeopleRefresh}
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
