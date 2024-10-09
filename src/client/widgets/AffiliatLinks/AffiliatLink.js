import React from 'react';
import { isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';
import { useSelector } from 'react-redux';
import { getSettingsSite } from '../../../store/websiteStore/websiteSelectors';
import './AffiliatLink.less';

const images = {
  walmart: '/images/walmart-logo.svg',
  amazon: '/images/amazon-logo.svg',
  target: '/images/target-logo.svg',
};
const fitIcons = [
  'https://waivio.nyc3.digitaloceanspaces.com/cae90a4e92904f47101071d6c283b9f3a8ca38d5610a485fde91223e7e36babc',
  'https://waivio.nyc3.digitaloceanspaces.com/402e4b97b8e9e4796519950a957ca8bfae23b0fc47280fe1980e43212c07fb81',
];

const AffiliatLink = ({ link, disabled }) => {
  const settings = useSelector(getSettingsSite);
  const isAmazon = link.link?.includes('amazon');
  const needsFitContent = fitIcons.includes(link.link);

  const onClick = () => {
    if (typeof window !== 'undefined' && window?.gtag) {
      window.gtag('event', 'buy_now', { debug_mode: true });
      if (!isEmpty(settings.googleEventSnippet) && !isNil(link.link)) {
        // window.gtag('event', 'gtag_report_conversion', { debug_mode: true });
        window.gtag_report_conversion(link.link);
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
      disabled={disabled}
    >
      {link.image ? (
        <img
          className={!isAmazon ? 'AffiliatLink__image' : 'AffiliatLink__image-amazon'}
          style={needsFitContent ? { width: '-webkit-fill-available' } : {}}
          src={link.image || images[link.type]}
          alt={'Affiliate button logo'}
        />
      ) : (
        <ReactSVG
          style={needsFitContent ? { width: '-webkit-fill-available' } : {}}
          className={!isAmazon ? 'AffiliatLink__icon' : 'AffiliatLink__icon-amazon'}
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
