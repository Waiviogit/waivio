import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../feed/Page';

const MainPage = ({ currPage, route }) => {
  switch (currPage) {
    case 'dining':
      return <div>dining</div>;

    default:
      return <Page route={route} />;
  }
};

MainPage.propTypes = {
  currPage: PropTypes.string.isRequired,
  route: PropTypes.shape({}).isRequired,
};

export default MainPage;
