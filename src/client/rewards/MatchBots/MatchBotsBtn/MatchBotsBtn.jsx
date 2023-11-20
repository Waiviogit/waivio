import { Button } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';

import './MatchBotsBtn.less';

const MatchBotsBtn = ({ onClick, name }) => (
  <div className="MatchBot__button">
    <Button type="primary" onClick={onClick}>
      {name}
    </Button>
  </div>
);

MatchBotsBtn.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MatchBotsBtn;
