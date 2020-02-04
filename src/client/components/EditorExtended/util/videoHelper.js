const YOUTUBEMATCH_URL = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
const VIMEOMATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/; // eslint-disable-line no-useless-escape
const DTUBEMATCH_URL = /^https:\/\/(emb\.)?d\.tube(\/#!)?(\/v)?\/([^/"]+\/[^/"]+)$/;

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';
const DTUBE_PREFIX = 'https://emb.d.tube/#!/';

export const isYoutube = url => YOUTUBEMATCH_URL.test(url);

export const isVimeo = url => VIMEOMATCH_URL.test(url);

export const isDTube = url => DTUBEMATCH_URL.test(url);

export const getYoutubeSrc = url => {
  const id = url && url.match(YOUTUBEMATCH_URL)[1];
  return {
    srcID: id,
    srcType: 'youtube',
    url,
  };
};

export const getVimeoSrc = url => {
  const id = url.match(VIMEOMATCH_URL)[3];
  return {
    srcID: id,
    srcType: 'vimeo',
    url,
  };
};

export const getDTubeSrc = url => {
  const id = url.match(DTUBEMATCH_URL)[4];
  return {
    srcID: id,
    srcType: 'dtube',
    url,
  };
};

export const getSrc = ({ src }) => {
  if (isYoutube(src)) {
    const { srcID } = getYoutubeSrc(src);
    return `${YOUTUBE_PREFIX}${srcID}`;
  }
  if (isVimeo(src)) {
    const { srcID } = getVimeoSrc(src);
    return `${VIMEO_PREFIX}${srcID}`;
  }
  if (isDTube(src)) {
    const { srcID } = getDTubeSrc(src);
    return `${DTUBE_PREFIX}${srcID}`;
  }

  return undefined;
};

export default getSrc;
