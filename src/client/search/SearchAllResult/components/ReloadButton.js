import { ReactSVG } from 'react-svg';
import React from 'react';
import PropTypes from 'prop-types';
import ReloadIcon from '@icons/redo-alt-solid.svg';

const ReloadButton = props => (
  <div className={props.className} role="presentation" onClick={props.reloadSearchList}>
    <ReactSVG wrapper="span" src={ReloadIcon} /> Reload
  </div>
);

ReloadButton.propTypes = {
  className: PropTypes.string.isRequired,
  reloadSearchList: PropTypes.func.isRequired,
};

export default ReloadButton;
