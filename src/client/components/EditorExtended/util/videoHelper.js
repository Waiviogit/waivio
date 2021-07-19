const YOUTUBEMATCH_URL = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
const VIMEOMATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/; // eslint-disable-line no-useless-escape
const DTUBEMATCH_URL = /^https:\/\/(emb\.)?d\.tube(\/#!)?(\/v)?\/([^/"]+\/[^/"]+)$/;
const THREESPEAKMATCH_URL = /^https:\/\/3speak\.online\/(watch|embed)\?v=([\w\d-/._]*)(&|$)/;
const RUMBLE_URL = /^https:\/\/rumble\.com\/embed\/([a-zA-Z0-9-_]*)/;
const BITCHUTE_URL = /^https:\/\/www\.bitchute\.com\/(video|embed)\/([a-zA-Z0-9-_]*)/;

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';
const DTUBE_PREFIX = 'https://emb.d.tube/#!/';
const THREESPEAK_PREFIX = 'https://3speak.online/embed?v=';
const RUMBLE_PREFIX = 'https://rumble.com/embed/';
const BITCHUTE_PREFIX = 'https://www.bitchute.com/embed/';

export const isYoutube = url => YOUTUBEMATCH_URL.test(url);

export const isVimeo = url => VIMEOMATCH_URL.test(url);

export const isDTube = url => DTUBEMATCH_URL.test(url);

export const isThreeSpeak = url => THREESPEAKMATCH_URL.test(url);

export const isRumble = url => RUMBLE_URL.test(url);

export const isBitchute = url => BITCHUTE_URL.test(url);

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

export const getThreeSpeakSrc = url => {
  const id = url.match(THREESPEAKMATCH_URL)[2];

  return {
    srcID: id,
    srcType: '3speak',
    url,
  };
};

export const getRumbleSrc = url => {
  const id = url.match(RUMBLE_URL)[1];

  return {
    srcID: id,
    srcType: 'rumble',
    url,
  };
};

export const getBitchuteSrc = url => {
  const id = url.match(BITCHUTE_URL)[2];

  return {
    srcID: id,
    srcType: 'bitchute',
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
  if (isThreeSpeak(src)) {
    const { srcID } = getThreeSpeakSrc(src);

    return `${THREESPEAK_PREFIX}${srcID}`;
  }
  if (isRumble(src)) {
    const { srcID } = getRumbleSrc(src);

    return `${RUMBLE_PREFIX}${srcID}`;
  }
  if (isBitchute(src)) {
    const { srcID } = getBitchuteSrc(src);

    return `${BITCHUTE_PREFIX}${srcID}/`;
  }

  return undefined;
};

export const getBodyLink = previewResult => {
  const dTubeRegExp = /https:\/\/(emb\.)?d\.tube(\/#!)?(\/v)?\/([^/"]+\/[^/"]+)/;
  const threeSpeakRegExp = /https:\/\/3speak\.online\/(watch|embed)\?v=([\w\d-/._]*)/;
  const dTubeRes = previewResult[0].match(dTubeRegExp);
  const threeSpeakRes = previewResult[0].match(threeSpeakRegExp);

  if (dTubeRes) return dTubeRes[0].split("'>")[0];
  else if (threeSpeakRes) return threeSpeakRes[0];

  return null;
};

export default getSrc;
