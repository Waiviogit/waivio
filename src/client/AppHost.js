import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { ConnectedRouter } from 'connected-react-router';
import { useSelector } from 'react-redux';
import { getWebsiteStartPage } from '../store/appStore/appSelectors';
import routes from './routes';

import './styles/base.less';

const AppHost = ({ history }) => {
  const page = useSelector(getWebsiteStartPage);

  return <ConnectedRouter history={history}>{routes(page)}</ConnectedRouter>;
};

AppHost.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default hot(module)(AppHost);
