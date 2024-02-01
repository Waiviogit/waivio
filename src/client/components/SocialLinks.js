import React from 'react';
import { ReactSVG } from 'react-svg';
import PropTypes from 'prop-types';
import { intersection } from 'lodash';
import socialProfiles, { transform } from '../../common/helpers/socialProfiles';

const SocialLinks = ({ profile, isSocial }) => {
  const union = intersection(
    socialProfiles.map(socialProfile => socialProfile.id),
    Object.keys(profile),
  );

  const availableProfiles = socialProfiles.filter(
    socialProfile => union.indexOf(socialProfile.id) !== -1 && profile[socialProfile.id] !== '',
  );

  return (
    <div>
      {availableProfiles.map(socialProfile =>
        socialProfile.id === 'twitter' ? (
          <div
            key={socialProfile.id}
            className={`${isSocial ? 'mb5px' : ''} twitter-icon-container`}
          >
            <ReactSVG
              className={'twitter-icon'}
              src="/images/icons/twitter-x.svg"
              wrapper={'span'}
            />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={transform(socialProfile.id, profile[socialProfile.id])}
            >
              X
            </a>
          </div>
        ) : (
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
        ),
      )}
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
