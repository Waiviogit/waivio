import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { getIsLoaded, getIsAuthenticated, getAuthenticatedUserName } from '../reducers';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import './Rewards.less';
import Propositions from './Propositions/Propositions';
import { assignProposition, declineProposition } from '../user/userActions';
import TopNavigation from '../components/Navigation/TopNavigation';
import Campaigns from './Campaigns/Campaigns';
import CreateRewardForm from './Create/CreateRewardForm';
import RewardsFiltersPanel from './RewardsFiltersPanel/RewardsFiltersPanel';

@withRouter
@injectIntl
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    loaded: getIsLoaded(state),
    username: getAuthenticatedUserName(state),
  }),
  { assignProposition, declineProposition },
)
class Rewards extends React.Component {
  static propTypes = {
    assignProposition: PropTypes.func.isRequired,
    declineProposition: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
  };
  static defaultProps = {
    username: '',
  };

  campaignsLayoutWrapLayout = (IsRequiredObjectWrap, filterKey, username, match) =>
    IsRequiredObjectWrap ? (
      <Campaigns filterKey={filterKey} userName={username} />
    ) : (
      <Propositions
        filterKey={filterKey}
        userName={username}
        assignProposition={this.props.assignProposition}
        discardProposition={this.props.declineProposition}
        campaignParent={match.params.campaignParent}
      />
    );

  render() {
    const { location, match, authenticated, username } = this.props;
    const robots = location.pathname === '/' ? 'index,follow' : 'noindex,follow';
    const filterKey = match.params.filterKey;
    const IsRequiredObjectWrap = !match.params.campaignParent;
    return (
      <div className="Rewards">
        <Helmet>
          <title>Waivio</title>
          <meta name="robots" content={robots} />
        </Helmet>
        <ScrollToTop />
        <ScrollToTopOnMount />
        <div className="feed-layout container">
          <TopNavigation authenticated={authenticated} userName={username} />
          <Affix className="leftContainer" stickPosition={122}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            {location.pathname === '/rewards/create' ? (
              <CreateRewardForm userName={username} />
            ) : (
              this.campaignsLayoutWrapLayout(IsRequiredObjectWrap, filterKey, username, match)
            )}
          </div>
          <Affix className="rightContainer leftContainer__user" stickPosition={122}>
            <div className="right">
              <RewardsFiltersPanel
              // activefilters={this.state.activeFilters}
              // setFilterValue={this.setFilterValue}
              />
            </div>
          </Affix>
        </div>
      </div>
    );
  }
}

export default Rewards;
