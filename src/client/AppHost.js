import React, { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { ConnectedRouter } from 'connected-react-router';
import { useSelector } from 'react-redux';
import { getWebsiteStartPage } from '../store/appStore/appSelectors';
import routes from './routes';
import { getParentHost } from '../waivioApi/ApiClient';
import { isCustomDomain } from './social-gifts/listOfSocialWebsites';

import './styles/base.less';

const AppHost = ({ history }) => {
  const [parentHost, setHost] = useState('');
  const [loading, setLoading] = useState(true);
  const page = useSelector(getWebsiteStartPage);

  useLayoutEffect(() => {
    if (isCustomDomain(location?.hostname)) {
      getParentHost(location?.hostname).then(res => {
        setHost(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <ConnectedRouter history={history}>
      {loading ? null : routes(page, location?.hostname, parentHost)}
    </ConnectedRouter>
  );
};

AppHost.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default hot(module)(AppHost);
