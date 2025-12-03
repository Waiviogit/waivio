import React from 'react';
import { ReactSVG } from 'react-svg';
import PropTypes from 'prop-types';
import { transform } from '../../../../common/helpers/socialProfiles';

const ClassicSocialLinksView = ({ availableProfiles, profile, currHost, isSocial }) => (
  <>
    {availableProfiles.map(socialProfile => {
      switch (socialProfile.id) {
        case 'tiktok':
          return (
            <div
              key={socialProfile.id}
              className={`${isSocial ? 'mb5px' : ''} tiktok-icon-container`}
            >
              <ReactSVG className="tiktok-icon" src="/images/icons/tiktok.svg" wrapper="span" />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={transform(socialProfile.id, profile[socialProfile.id])}
              >
                {' '}
                {socialProfile.name}
              </a>
            </div>
          );
        case 'snapchat':
          return (
            <div
              key={socialProfile.id}
              className={`${isSocial ? 'mb5px' : ''} tiktok-icon-container`}
            >
              <ReactSVG className="snapchat-icon" src="/images/icons/snapchat.svg" wrapper="span" />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={transform(socialProfile.id, profile[socialProfile.id])}
              >
                {' '}
                {socialProfile.name}
              </a>
            </div>
          );
        case 'hive':
          return (
            <div
              key={socialProfile.id}
              className={`${isSocial ? 'mb5px' : ''} tiktok-icon-container`}
            >
              <img
                className="hive-icon"
                src="/images/icons/cryptocurrencies/hive.png"
                alt={'hive-logo'}
              />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://${currHost}/@${profile[socialProfile.id]}`}
              >
                {' '}
                {socialProfile.name}
              </a>
            </div>
          );
        case 'twitch':
        case 'pinterest':
        case 'reddit':
        case 'telegram':
        case 'whatsapp':
          return (
            <div
              key={socialProfile.id}
              className={`${isSocial ? 'mb5px' : ''} tiktok-icon-container`}
            >
              <img
                style={{
                  width: socialProfile.icon === 'whatsapp' ? '18px' : '16px',
                  height: socialProfile.icon === 'whatsapp' ? '18px' : '16px',
                }}
                className="hive-icon"
                src={`/images/icons/${socialProfile.id}.png`}
                alt={`${socialProfile.id} logo`}
              />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={transform(socialProfile.id, profile[socialProfile.id])}
              >
                {' '}
                {socialProfile.name}
              </a>
            </div>
          );
        case 'twitter':
          return (
            <div
              key={socialProfile.id}
              className={`${isSocial ? 'mb5px' : ''} twitter-icon-container`}
            >
              <ReactSVG className="twitter-icon" src="/images/icons/twitter-x.svg" wrapper="span" />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={transform(
                  socialProfile.id,
                  availableProfiles.find(p => p.id === socialProfile.id).value,
                )}
              >
                X
              </a>
            </div>
          );

        default:
          return (
            <div key={socialProfile.id} className={isSocial ? 'mb5px' : ''}>
              <i
                className={`iconfont text-icon icon-${socialProfile.icon}`}
                style={{
                  color: socialProfile.color,
                }}
              />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={transform(socialProfile.id, profile[socialProfile.id])}
              >
                {socialProfile.name}
              </a>
            </div>
          );
      }
    })}
  </>
);

ClassicSocialLinksView.propTypes = {
  availableProfiles: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  profile: PropTypes.shape().isRequired,
  currHost: PropTypes.string,
  isSocial: PropTypes.bool,
};

export default ClassicSocialLinksView;
