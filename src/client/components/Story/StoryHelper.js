const START_WITH_PERCENT = 5;

const getPositions = text => {
  const imgPos = text?.indexOf('<img');
  const embedPos = text?.indexOf('<iframe');
  const percentMultiplier = 100 / text.length;
  const firstEmbed = embedPos !== -1 ? embedPos * percentMultiplier : undefined;
  const firstImage = imgPos !== -1 ? imgPos * percentMultiplier : undefined;

  return { embed: firstEmbed, image: firstImage };
};

const getFirstMediaFromHtml = value => {
  const indexVideo = value?.indexOf('<iframe');
  const indexImage = value?.indexOf('<img');

  if (indexVideo >= 0 && indexImage >= 0) {
    if (indexVideo > indexImage) {
      return 'image';
    }

    return 'video';
  }

  if (indexVideo < 0 && indexImage >= 0) {
    return 'image';
  }

  if (indexImage < 0 && indexVideo >= 0) {
    return 'video';
  }

  return '';
};

const postWithPicture = (tagPositions, searchPosition) => {
  const result = tagPositions.image && tagPositions.image < searchPosition;

  if (tagPositions.embed !== undefined) {
    return tagPositions.embed > tagPositions.image && result;
  }

  return result;
};

const postWithAnEmbed = (tagPositions, searchPosition) => {
  const result = tagPositions.embed && tagPositions.embed < searchPosition;

  if (tagPositions.image !== undefined) {
    return tagPositions.image > tagPositions.embed && result;
  }

  return result;
};

const isPostStartsWithAPicture = tagPositions => postWithPicture(tagPositions, START_WITH_PERCENT);
const isPostStartsWithAnEmbed = tagPositions => postWithAnEmbed(tagPositions, START_WITH_PERCENT);
const isPostWithPictureBeforeFirstHalf = tagPositions => postWithPicture(tagPositions, 50);
const isPostWithEmbedBeforeFirstHalf = tagPositions => postWithAnEmbed(tagPositions, 50);
const isPostVideo = (providerName, shouldRenderThumb) => {
  const providerNames = ['YouTube', 'DTube', 'TikTok', '3Speak'];

  return providerNames?.includes(providerName) && shouldRenderThumb;
};

export {
  getPositions,
  postWithPicture,
  postWithAnEmbed,
  isPostStartsWithAPicture,
  isPostStartsWithAnEmbed,
  isPostWithPictureBeforeFirstHalf,
  isPostWithEmbedBeforeFirstHalf,
  isPostVideo,
  getFirstMediaFromHtml,
};
