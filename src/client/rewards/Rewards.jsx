import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';

import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@withRouter
@injectIntl
class Rewards extends React.Component {
  render() {
    const renderedRoutes = renderRoutes(this.props.route.routes);
    const isWidget =
      typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('isWidget') : false;

    return (
      <div className="Rewards">
        <div className="shifted">
          <Helmet>
            <title>Rewards</title>
          </Helmet>
          <ScrollToTop />
          <ScrollToTopOnMount />
          <div className={classNames('feed-layout container', { 'isWidget-container': isWidget })}>
            <div className="center">{renderedRoutes}</div>
          </div>
        </div>
      </div>
    );
  }
}

Rewards.propTypes = {
  route: PropTypes.shape().isRequired,
};

export default Rewards;
