import { has, forOwn, isEmpty } from 'lodash';

const postingMetadataHelper = (jsonMetadata, postingJsonMetadata) => {
  if (!isEmpty(jsonMetadata) && isEmpty(postingJsonMetadata)) {
    return jsonMetadata;
  }

  if (
    !isEmpty(jsonMetadata) &&
    !isEmpty(postingJsonMetadata) &&
    has(jsonMetadata, 'profile') &&
    has(postingJsonMetadata, 'profile')
  ) {
    const { profile: jsonProfile } = jsonMetadata;
    const { profile: postingProfile } = postingJsonMetadata;

    forOwn(jsonProfile, (value, key) => {
      if (!has(postingProfile, key)) postingProfile[key] = value;
    });

    return postingJsonMetadata;
  }

  if (isEmpty(jsonMetadata) && isEmpty(postingJsonMetadata)) return {};

  return postingJsonMetadata;
};

export default postingMetadataHelper;
