import { has, forOwn, isEmpty, attempt, isError, isString, get } from 'lodash';

export const postingMetadataHelper = (jsonMetadata, postingJsonMetadata) => {
  const isJsonMetadata = !isEmpty(jsonMetadata);
  const isPostingMetadata = !isEmpty(postingJsonMetadata);

  if (isJsonMetadata && !isPostingMetadata) {
    return jsonMetadata;
  }

  if (
    isJsonMetadata &&
    isPostingMetadata &&
    has(jsonMetadata, 'profile') &&
    has(postingJsonMetadata, 'profile') &&
    !has(postingJsonMetadata, 'profile.version')
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

export const getMetadata = user => {
  let jsonMetadata = get(user, 'json_metadata', {});

  if (isString(jsonMetadata)) {
    jsonMetadata = attempt(JSON.parse, jsonMetadata);
    if (isError(jsonMetadata)) jsonMetadata = {};
  }

  let postingJsonMetadata = get(user, 'posting_json_metadata', {});

  if (isString(postingJsonMetadata)) {
    postingJsonMetadata = attempt(JSON.parse, postingJsonMetadata);
    if (isError(postingJsonMetadata)) postingJsonMetadata = {};
  }

  return postingMetadataHelper(jsonMetadata, postingJsonMetadata);
};
