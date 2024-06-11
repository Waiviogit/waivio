import React from 'react';
import socialProfiles, { socialWallets } from '../../../common/helpers/socialProfiles';
import SocialInputItem from './SocialInputItem';

const SocialInputs = ({ getFieldDecorator, getFieldValue, setErrors, intl, errors }) => {
  const allProfiles = [...socialProfiles, ...socialWallets];

  return allProfiles.map(profile => (
    <SocialInputItem
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
