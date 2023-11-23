import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

const AvatarComp = ({ link, isBanner }) => (
  <React.Fragment>
    {link ? (
      <div
        className={`WebsitesConfigurations__${isBanner ? 'banner' : 'avatar'}`}
        style={{
          backgroundImage: `url(${link})`,
          backgroundPosition: `${isBanner ? 'left' : 'center'}`,
          backgroundSize: 'contain',
        }}
      />
    ) : (
      <div
        className="WebsitesConfigurations__avatar"
        style={{
          backgroundColor: '#cccccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <Icon type="picture" />
      </div>
    )}
  </React.Fragment>
);

AvatarComp.propTypes = {
  link: PropTypes.string,
  isBanner: PropTypes.bool,
};

export default AvatarComp;
