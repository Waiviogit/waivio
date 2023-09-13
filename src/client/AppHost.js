import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { ConnectedRouter } from 'connected-react-router';
import { useSelector } from 'react-redux';
import { getWebsiteStartPage } from '../store/appStore/appSelectors';
import routes from './routes';
import { getCurrentAppSettings } from '../waivioApi/ApiClient';

import './styles/base.less';

const AppHost = ({ history }) => {
  const [host, setHost] = useState('');
  const page = useSelector(getWebsiteStartPage);

  useEffect(() => {
    getCurrentAppSettings().then(res => {
      setHost(res?.parentHost || '');
    });
  }, []);

  return <ConnectedRouter history={history}>{routes(page, host)}</ConnectedRouter>;
};

AppHost.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default hot(module)(AppHost);
