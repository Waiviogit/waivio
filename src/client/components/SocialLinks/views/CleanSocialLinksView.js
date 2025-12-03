import React from 'react';
import { ReactSVG } from 'react-svg';
import PropTypes from 'prop-types';
import { transform } from '../../../../common/helpers/socialProfiles';

import '../SocialLinks.clean.less';

const CleanSocialLinksView = ({ availableProfiles, profile, currHost }) => (
  <div className="SocialLinksClean">
    {availableProfiles.map(socialProfile => {
      const href =
        socialProfile.id === 'hive'
          ? `https://${currHost}/@${profile[socialProfile.id]}`
          : transform(socialProfile.id, profile[socialProfile.id]);

      switch (socialProfile.id) {
        case 'tiktok':
          return (
            <a
              key={socialProfile.id}
              target="_blank"
              rel="noopener noreferrer"
              href={href}
              className="SocialLinksClean__icon"
              title={socialProfile.name}
            >
              <ReactSVG src="/images/icons/tiktok.svg" wrapper="span" />
            </a>
          );
        case 'snapchat':
          return (
            <a
              key={socialProfile.id}
              target="_blank"
              rel="noopener noreferrer"
              href={href}
              className="SocialLinksClean__icon"
              title={socialProfile.name}
            >
              <ReactSVG src="/images/icons/snapchat.svg" wrapper="span" />
            </a>
          );
        case 'hive':
          return (
            <a
              key={socialProfile.id}
              target="_blank"
              rel="noopener noreferrer"
              href={href}
              className="SocialLinksClean__icon"
              title={socialProfile.name}
            >
              <img src="/images/icons/cryptocurrencies/hive.png" alt={socialProfile.name} />
            </a>
          );
        case 'twitter':
          return (
            <a
              key={socialProfile.id}
              target="_blank"
              rel="noopener noreferrer"
              href={href}
              className="SocialLinksClean__icon"
              title="X (Twitter)"
            >
              <ReactSVG src="/images/icons/twitter-x.svg" wrapper="span" />
            </a>
          );
        case 'twitch':
        case 'pinterest':
        case 'reddit':
        case 'telegram':
        case 'whatsapp':
          return (
            <a
              key={socialProfile.id}
              target="_blank"
              rel="noopener noreferrer"
              href={href}
              className="SocialLinksClean__icon"
              title={socialProfile.name}
            >
              <img src={`/images/icons/${socialProfile.id}.png`} alt={socialProfile.name} />
            </a>
          );

        default:
          return (
            <a
              key={socialProfile.id}
              target="_blank"
              rel="noopener noreferrer"
              href={href}
              className="SocialLinksClean__icon"
              title={socialProfile.name}
            >
              <i className={`iconfont icon-${socialProfile.icon}`} />
            </a>
          );
      }
    })}
  </div>
);

CleanSocialLinksView.propTypes = {
  availableProfiles: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  profile: PropTypes.shape().isRequired,
  currHost: PropTypes.string,
};

export default CleanSocialLinksView;
