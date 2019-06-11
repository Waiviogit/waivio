// import _ from 'lodash';
import React from 'react';
import { Switch } from 'antd';
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
// import Proposition from './Proposition/Proposition';
import Propositions from './Propositions/Propositions';

@withRouter
@injectIntl
@connect(state => ({
  authenticated: getIsAuthenticated(state),
  loaded: getIsLoaded(state),
}))
class Rewards extends React.Component {
  static propTypes = {
    // authenticated: PropTypes.bool.isRequired,
    history: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  state = {
    filter: true,
  };

  handleSortChange = key => {
    const { category } = this.props.match.params;
    if (category) {
      this.props.history.push(`/${key}/${category}`);
    } else {
      this.props.history.push(`/${key}`);
    }
  };

  handleTopicClose = () => this.props.history.push('/trending');

  toggleFilter = () => {
    this.setState({ filter: !this.state.filter });
  };
  render() {
    const { location, intl, match } = this.props;
    const robots = location.pathname === '/' ? 'index,follow' : 'noindex,follow';
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
              <div className="Rewards__title">
                {`${intl.formatMessage({
                  id: 'propositionsTitle',
                  defaultMessage: 'Propositions',
                })}`}
                {match.params && match.params[0] !== 'reserved' && (
                  <div className="Rewards__toggler-wrap">
                    {`${intl.formatMessage({
                      id: 'only_for_my',
                      defaultMessage: 'Only for me',
                    })}`}
                    <Switch checked={this.state.filter} onChange={this.toggleFilter} />
                  </div>
                )}
              </div>
              <Propositions filterKey={match.params[0]} />
              {/* {_.map(['pr1', 'pr2', 'pr3'], proposition => ( */}
              {/* <Proposition proposition={proposition} /> */}
              {/* ))} */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(Rewards);
