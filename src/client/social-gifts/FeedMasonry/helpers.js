import { isEmpty } from 'lodash';
import { getImageForPreview, getVideoForPreview } from '../../../common/helpers/postHelpers';

export const breakpointColumnsObj = length => ({
  default: length < 5 ? length : 5,
  1100: length < 4 ? length : 4,
  999: length < 3 ? length : 3,
  650: length < 2 ? length : 2,
});

export const preparationPostList = (postsIds, postsList) =>
  postsIds.reduce((acc, curr) => {
    const post = postsList[curr];
    const imagePath = getImageForPreview(post);
    const embeds = getVideoForPreview(post);

    if (isEmpty(imagePath) && isEmpty(embeds)) return acc;

    return [...acc, { ...post, id: curr, imagePath, embeds }];
  }, []);

export default null;
