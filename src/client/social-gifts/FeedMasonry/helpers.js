import { isEmpty } from 'lodash';
import { getImageForPreview, getVideoForPreview } from '../../../common/helpers/postHelpers';
import { getVideoPostsPriview } from '../../../waivioApi/ApiClient';

export const breakpointColumnsObj = length => ({
  default: length < 5 ? length : 5,
  1100: length < 4 ? length : 4,
  999: length < 3 ? length : 3,
  650: length < 2 ? length : 2,
});

export const preparationPreview = postItems => {
  const urls = postItems
    .map(p => {
      const embed = getVideoForPreview(p)[0];

      if (embed?.provider_name === 'TikTok') return embed?.url;

      return null;
    })
    .filter(i => i);

  if (!isEmpty(urls)) return getVideoPostsPriview(urls);

  return Promise.resolve([]);
};

export const preparationPostList = (postsIds, postsList) =>
  postsIds.reduce((acc, curr) => {
    const post = postsList[curr];
    const imagePath = getImageForPreview(post);
    const embeds = getVideoForPreview(post);

    if (isEmpty(imagePath) && isEmpty(embeds)) return acc;

    return [...acc, { ...post, id: curr, imagePath, embeds }];
  }, []);

export default null;
