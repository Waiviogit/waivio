import { has, forOwn, isEmpty } from 'lodash';

const postingMetadataHelper = (jsonMetadata, postingJsonMetadata) => {
  const isJsonMetadata = !isEmpty(jsonMetadata);
  const isPostingMetadata = !isEmpty(postingJsonMetadata);

  if (isJsonMetadata && !isPostingMetadata) {
    return jsonMetadata;
  }

  if (
    isJsonMetadata &&
    isPostingMetadata &&
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

  if (!isJsonMetadata && !isPostingMetadata) return {};

  return postingJsonMetadata;
};

export default postingMetadataHelper;
