import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import GraphicCaller from './GraphicCaller';

const GraphicIcon = props => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button className="graphic" onClick={() => setIsOpen(true)}>
      <Icon type="bar-chart" />
      {isOpen && <GraphicCaller id={props.id} inOpenModal={isOpen} setOpen={setIsOpen} />}
    </button>
  );
};

GraphicIcon.propTypes = {
  id: PropTypes.string.isRequired,
};

export default GraphicIcon;
