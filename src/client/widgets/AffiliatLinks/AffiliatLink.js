import React from 'react';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';

import './AffiliatLink.less';

const images = {
  walmart: '/images/walmart-logo.svg',
  amazon: '/images/amazon-logo.svg',
  target: '/images/tagret-logo.svg',
};

const AffiliatLink = ({ link }) => (
  <a rel="noreferrer" key={link.link} target="_blank" href={link.link} className="AffiliatLink">
    <ReactSVG className="AffiliatLink__icon" src={images[link.type]} />
  </a>
);

AffiliatLink.propTypes = {
  link: PropTypes.shape({
    link: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default AffiliatLink;
