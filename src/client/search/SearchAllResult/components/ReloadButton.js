import { ReactSVG } from 'react-svg';
import React from 'react';
import PropTypes from 'prop-types';

const ReloadButton = props => (
  <div className={props.className} role="presentation" onClick={props.reloadSearchList}>
    <ReactSVG wrapper="span" src="/images/icons/redo-alt-solid.svg" /> Reload
  </div>
);

ReloadButton.propTypes = {
  className: PropTypes.string.isRequired,
  reloadSearchList: PropTypes.func.isRequired,
};

export default ReloadButton;
