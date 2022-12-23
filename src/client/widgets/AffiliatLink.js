import React from 'react';
import PropTypes from 'prop-types';

const images = {
  walmart:
    'https://waivio.nyc3.digitaloceanspaces.com/1671804010_a8c62266-e57c-4c2b-9fc8-6f4b6a78d74e',
  amazon:
    'https://waivio.nyc3.digitaloceanspaces.com/1671804032_96a37c3b-28a4-4228-be02-1d61a2e01878',
};

const AffiliatLink = ({ link }) => (
  <a
    rel="noreferrer"
    style={{
      width: '150px',
      padding: '5px 0',
      textAlign: 'center',
      display: 'block',
      border: '1px solid #f1f0f0',
      background: '#fff',
      borderRadius: '4px',
    }}
    key={link.link}
    target="_blank"
    href={link.link}
  >
    <img
      alt={link.type}
      src={images[link.type]}
      style={{
        height: '26px',
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
