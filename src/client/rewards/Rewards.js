import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { getIsLoaded, getIsAuthenticated } from '../reducers';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import './Rewards.less';
import Propositions from './Propositions/Propositions';
import { assignProposition, declineProposition } from '../user/userActions';

@withRouter
@injectIntl
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    loaded: getIsLoaded(state),
  }),
  { assignProposition, declineProposition },
)
class Rewards extends React.Component {
  static propTypes = {
    assignProposition: PropTypes.func.isRequired,
    declineProposition: PropTypes.func.isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
  };
  static defaultProps = {
    currentUserName: '',
  };
  render() {
    const { location, match } = this.props;
    const robots = location.pathname === '/' ? 'index,follow' : 'noindex,follow';
    const filterKey = match.params[0];
    return (
      <div className="Rewards">
        <Helmet>
          <title>Waivio</title>
          <meta name="robots" content={robots} />
        </Helmet>
        <ScrollToTop />
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer" stickPosition={77}>
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            <div className="center">
              <Propositions
                filterKey={filterKey}
                userName={match.params.userName}
                assignProposition={this.props.assignProposition}
                discardProposition={this.props.declineProposition}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Rewards;
