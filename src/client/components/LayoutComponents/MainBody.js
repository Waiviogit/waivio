import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../feed/Page';

const MainBody = ({ currPage, route }) => {
  switch (currPage) {
    case 'dining':
      return <div>dining</div>;

    default:
      return <Page route={route} />;
  }
};

MainBody.propTypes = {
  currPage: PropTypes.string.isRequired,
  route: PropTypes.shape({}).isRequired,
};

export default MainBody;
