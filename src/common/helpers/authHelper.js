import { get } from 'lodash';
import { parseJSON } from './parseJSON';

const getUserAvatar = user => {
  let jsonMetadata = get(user, 'posting_json_metadata');

  if (jsonMetadata) {
    jsonMetadata = parseJSON(user.posting_json_metadata);

    return get(jsonMetadata, 'profile.profile_image');
  }

  return undefined;
};

export default getUserAvatar;
