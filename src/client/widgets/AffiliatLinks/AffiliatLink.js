import React from 'react';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';

import './AffiliatLink.less';

const images = {
  walmart: '/images/walmart-logo.svg',
  amazon: '/images/amazon-logo.svg',
  target: '/images/target-logo.svg',
};

const AffiliatLink = ({ link, disabled }) => {
  const onClick = () => {
    if (window?.gtag) {
      window.gtag('event', 'buy_now', { debug_mode: true });
      window.gtag('event', 'gtag_report_conversion', { debug_mode: true });
    }
  };

  return (
    <a
      rel="noreferrer"
      onClick={onClick}
      key={link.link}
      target="_blank"
      href={link.link}
      className="AffiliatLink"
      disabled={disabled}
    >
      {link.image ? (
        <img
          className={'AffiliatLink__image'}
          src={link.image || images[link.type]}
          alt={'Affiliate button logo'}
        />
      ) : (
        <ReactSVG
          className={link.type !== 'amazon' ? 'AffiliatLink__icon' : 'AffiliatLink__icon-amazon'}
          src={images[link.type]}
        />
      )}
    </a>
  );
};

AffiliatLink.propTypes = {
  link: PropTypes.shape({
    link: PropTypes.string,
    type: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
};

export default AffiliatLink;
