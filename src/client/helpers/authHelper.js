import { get } from 'lodash';

const getUserAvatar = user => {
  let jsonMetadata = get(user, 'posting_json_metadata');

  if (jsonMetadata) {
    jsonMetadata = JSON.parse(user.posting_json_metadata);

    return get(jsonMetadata, 'profile.profile_image');
  }

  return undefined;
};

export default getUserAvatar;
