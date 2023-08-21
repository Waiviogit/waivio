import React from 'react';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';

import './AffiliatLink.less';

const images = {
  walmart: '/images/walmart-logo.svg',
  amazon: '/images/amazon-logo.svg',
  target: '/images/target-logo.svg',
};

const AffiliatLink = ({ link }) => {
  const onClick = () => {
    if (window?.gtag) {
      if (link?.type) window.gtag('event', `click_${link.type}_com`);
      else {
        const extractDomain = url => {
          const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im;
          const match = url.match(domainRegex);

          if (match && match[1]) {
            return match[1].split('.')[0];
          }

          return null;
        };

        window.gtag('event', `click_${extractDomain(link?.link)}_com`);
      }
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
};

export default AffiliatLink;
