import React from 'react';
import PropTypes from 'prop-types';
// import WalmartIcon from './WalmartIcon';
// import AmazonIcon from './AmazonIcon';
// import TargetIcon from './TargetIcon';

const images = {
  walmart:
    'https://waivio.nyc3.digitaloceanspaces.com/1672832805_0effeade-faa9-43e1-bd2f-ea6c356df5f5',
  amazon:
    'https://waivio.nyc3.digitaloceanspaces.com/1671804032_96a37c3b-28a4-4228-be02-1d61a2e01878',
};

const AffiliatLink = ({ link }) => (
  <a
    rel="noreferrer"
    style={{
      textAlign: 'center',
      display: 'block',
      background: '#fff',
      borderRadius: '4px',
    }}
    key={link.link}
    target="_blank"
    href={link.link}
    className="AffiliatLink"
  >
    <img
      alt={link.type}
      src={images[link.type]}
      style={{
        height: link.type === 'amazon' ? '26px' : '21px',
        marginBottom: link.type === 'amazon' ? '0' : '3px',
        display: 'inline-block',
      }}
    />
  </a>
);

AffiliatLink.propTypes = {
  link: PropTypes.shape({
    link: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default AffiliatLink;
