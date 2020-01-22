import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import GraphicCaller from './GraphicCaller';

const GraphicIcon = props => {
  const [isOpen, openModal] = useState(false);
  const handleClouseModal = () => {
    openModal(false);
    window.removeEventListener('click', handleClouseModal);
  };
  const handleOpenModal = () => {
    openModal(true);
    window.addEventListener('click', handleClouseModal);
  };

  return (
    <button className="graphic" onClick={handleOpenModal}>
      <Icon type="bar-chart" />
      {isOpen && <GraphicCaller id={props.id} onOpenModal={isOpen} />}
    </button>
  );
};

GraphicIcon.propTypes = {
  id: PropTypes.string.isRequired,
};

export default GraphicIcon;
