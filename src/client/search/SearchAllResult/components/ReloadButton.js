import { ReactSVG } from 'react-svg';
import React from 'react';

const ReloadButton = props => (
  <div className={props.className} role="presentation" onClick={props.reloadSearchList}>
    <ReactSVG wrapper="span" src="/images/icons/redo-alt-solid.svg" /> Reload
  </div>
);

export default ReloadButton;
