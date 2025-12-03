import React from 'react';
import { useHistory, useParams } from 'react-router';
import PropTypes from 'prop-types';
import { intersection } from 'lodash';
import socialProfiles, {
  defaultSocialWallets,
  socialWallets,
} from '../../../common/helpers/socialProfiles';
import WalletItem from '../WalletItem';
import useTemplateProvider from '../../../designTemplates/TemplateProvider';

import './SocialLinks.less';

const SocialLinks = ({ profile, isSocial }) => {
  const templateComponents = useTemplateProvider();
  const SocialLinksView = templateComponents?.SocialLinksView;
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

  if (!SocialLinksView) return null;

  return (
    <div>
      <SocialLinksView
        availableProfiles={availableProfiles}
        profile={profile}
        currHost={currHost}
        isSocial={isSocial}
      />
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
