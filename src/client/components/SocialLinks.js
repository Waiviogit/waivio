import React from 'react';
import { ReactSVG } from 'react-svg';
import { useHistory, useParams } from 'react-router';
import PropTypes from 'prop-types';
import { intersection } from 'lodash';
import socialProfiles, {
  defaultSocialWallets,
  socialWallets,
  transform,
} from '../../common/helpers/socialProfiles';
import WalletItem from './WalletItem';

const SocialLinks = ({ profile, isSocial }) => {
  const params = useParams();
  const history = useHistory();
  const currHost = typeof location !== 'undefined' && location.hostname;
  const isUserProfile = history?.location?.pathname?.includes(`/@${params.name}`);
  const union = intersection(
    socialProfiles.map(socialProfile => socialProfile.id),
    Object.keys(profile),
  );

  const filteredProfiles = socialProfiles.filter(
    socialProfile =>
      union?.includes(socialProfile.id) &&
      profile[socialProfile.id] !== '' &&
      !['bitcoin', 'ethereum'].includes(socialProfile.id),
  );

  const availableProfiles = isUserProfile
    ? filteredProfiles.filter(p => p?.identifier !== 'hive-link')
    : filteredProfiles;

  const wallets = intersection(
    socialWallets.map(wallet => wallet.id),
    Object.keys(profile),
  );

  const hiveHbdWallets = isUserProfile ? defaultSocialWallets : [];

  const availableWallets = [
    ...hiveHbdWallets,
    ...socialWallets.filter(wallet => wallets?.includes(wallet.id) && profile[wallet.id] !== ''),
  ];

  return (
    <div>
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
                <ReactSVG
                  className="snapchat-icon"
                  src="/images/icons/snapchat.svg"
                  wrapper="span"
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
                <ReactSVG
                  className="twitter-icon"
                  src="/images/icons/twitter-x.svg"
                  wrapper="span"
                />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={transform(socialProfile.id, profile[socialProfile.id])}
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
      {availableWallets?.map(wallet => (
        <WalletItem key={wallet.id} profile={profile} wallet={wallet} />
      ))}
    </div>
  );
};

SocialLinks.propTypes = {
  profile: PropTypes.shape().isRequired,
  isSocial: PropTypes.bool,
};

SocialLinks.defaultProps = {
  isSocial: false,
};

export default SocialLinks;
