import React from 'react';
import socialProfiles, { socialWallets } from '../../../common/helpers/socialProfiles';
import SocialInputItem from './SocialInputItem';

const SocialInputs = ({ getFieldDecorator, getFieldValue, setHasErrors, intl }) => {
  const allProfiles = [...socialProfiles, ...socialWallets];

  return allProfiles.map(profile => (
    <SocialInputItem
      key={profile.id}
      profile={profile}
      getFieldDecorator={getFieldDecorator}
      setHasErrors={setHasErrors}
      getFieldValue={getFieldValue}
      intl={intl}
    />
  ));
};

export default SocialInputs;
