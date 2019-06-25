import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { getIsLoaded, getIsAuthenticated, getAuthenticatedUserName } from '../../reducers';
import CreateRewardForm from './CreateRewardForm';
import Affix from '../../components/Utils/Affix';
import ScrollToTop from '../../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../../components/Utils/ScrollToTopOnMount';
import './CreateReward.less';
import { assignProposition, declineProposition } from '../../user/userActions';

@injectIntl
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    userName: getAuthenticatedUserName(state),
    loaded: getIsLoaded(state),
  }),
  { assignProposition, declineProposition },
)
class CreateReward extends React.Component {
  static propTypes = {
    userName: PropTypes.string,
    location: PropTypes.shape().isRequired,
  };
  static defaultProps = {
    userName: '',
  };

  state = {};
  render() {
    const { location, userName } = this.props;
    const robots = location.pathname === '/' ? 'index,follow' : 'noindex,follow';
    return (
      <div className="CreateReward">
        <Helmet>
          <title>Waivio</title>
          <meta name="robots" content={robots} />
        </Helmet>
        <ScrollToTop />
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer" stickPosition={77}>
              <div className="left">guide navbar</div>
            </Affix>
            <div className="center">
              <CreateRewardForm userName={userName} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateReward;
