import { isEmpty } from 'lodash';
import { getImageForPreview, getVideoForPreview } from '../../../common/helpers/postHelpers';
import { getVideoPostsPriview } from '../../../waivioApi/ApiClient';

export const breakpointColumnsObj = (length, count) => {
  if (count) {
    return {
      default: length < count ? length : count,
      // 1240: length < 4 ? length : 4,
      999: length < 3 ? length : 3,
      650: length < 2 ? length : 2,
    };
  }

  return {
    default: length < 5 ? length : 5,
    1240: length < 4 ? length : 4,
    999: length < 3 ? length : 3,
    650: length < 2 ? length : 2,
  };
};

export const preparationPreview = postItems => {
  if (!postItems || !Array.isArray(postItems)) {
    return Promise.resolve([]);
  }

  const urls = postItems
    ?.map(p => {
      const embed = getVideoForPreview(p)[0];

      if (embed?.provider_name === 'TikTok') return embed?.url;

      return null;
    })
    .filter(i => i);

  if (!isEmpty(urls)) return getVideoPostsPriview(urls);

  return Promise.resolve([]);
};

export const preparationPostList = (postsIds, postsList) => {
  if (isEmpty(postsIds)) return [];

  return postsIds?.reduce((acc, curr) => {
    const post = postsList[curr];
    const imagePath = getImageForPreview(post);
    const embeds = getVideoForPreview(post);

    if (isEmpty(imagePath) && isEmpty(embeds)) return acc;

    return [...acc, { ...post, id: curr, imagePath, embeds }];
  }, []);
};

export default null;
