import { Icon } from 'antd';
import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import './widgetsStyle.less';

const ViewMapButton = props => (
  <div className="SearchAllResult__buttonWrap">
    <button className="ViewMapButton" onClick={props.handleClick}>
      <Icon type="compass" />{' '}
      {props.intl.formatMessage({ id: 'view_map', defaultMessage: 'View map' })}
    </button>
  </div>
);

ViewMapButton.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default injectIntl(ViewMapButton);
