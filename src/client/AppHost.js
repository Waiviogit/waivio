import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { useSelector } from 'react-redux';
import { getWebsiteStartPage, getWebsiteParentHost } from '../store/appStore/appSelectors';
import useTemplateFonts from '../hooks/useTemplateFonts';
import routes from './routes';

import './styles/base.less';

const AppHost = ({ history }) => {
  const page = useSelector(getWebsiteStartPage);
  const parentHost = useSelector(getWebsiteParentHost);

  useTemplateFonts();

  return (
    <ConnectedRouter history={history}>
      {routes(page, typeof location !== 'undefined' && location?.hostname, parentHost)}
    </ConnectedRouter>
  );
};

AppHost.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default AppHost;
