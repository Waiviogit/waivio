import React from 'react';
import socialProfiles, { socialWallets } from '../../../common/helpers/socialProfiles';
import SocialInputItem from './SocialInputItem';

const SocialInputs = ({ getFieldDecorator, getFieldValue, setErrors, intl, errors, metadata }) => {
  const allProfiles = [...socialProfiles, ...socialWallets];

  return allProfiles.map(profile => (
    <SocialInputItem
      metadata={metadata}
      key={profile.id}
      profile={profile}
      getFieldDecorator={getFieldDecorator}
      setErrors={setErrors}
      getFieldValue={getFieldValue}
      intl={intl}
      errors={errors}
    />
  ));
};

export default SocialInputs;
