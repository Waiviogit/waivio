import { VIDEO_MATCH_URL } from '../../../../common/helpers/regexHelpers';

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';
const DTUBE_PREFIX = 'https://emb.d.tube/#!/';
const THREESPEAK_PREFIX = 'https://3speak.online/embed?v=';
const RUMBLE_PREFIX = 'https://rumble.com/embed/';
const BITCHUTE_PREFIX = 'https://www.bitchute.com/embed/';

export const isYoutube = url => VIDEO_MATCH_URL.YOUTUBE.test(url);

export const isVimeo = url => VIDEO_MATCH_URL.VIMEO.test(url);

export const isDTube = url => VIDEO_MATCH_URL.DTUBE.test(url);

export const isThreeSpeak = url => VIDEO_MATCH_URL.THREE_SPEAK.test(url);

export const isRumble = url => VIDEO_MATCH_URL.RUMBLE.test(url);

export const isBitchute = url => VIDEO_MATCH_URL.BITCHUTE.test(url);

export const getYoutubeSrc = url => {
  const id = url && url.match(VIDEO_MATCH_URL.YOUTUBE)[1];

  return {
    srcID: id,
    srcType: 'youtube',
    url,
  };
};

export const getVimeoSrc = url => {
  const id = url.match(VIDEO_MATCH_URL.VIMEO)[3];

  return {
    srcID: id,
    srcType: 'vimeo',
    url,
  };
};

export const getDTubeSrc = url => {
  const id = url.match(VIDEO_MATCH_URL.DTUBE)[4];

  return {
    srcID: id,
    srcType: 'dtube',
    url,
  };
};

export const getThreeSpeakSrc = url => {
  const id = url.match(VIDEO_MATCH_URL.THREE_SPEAK)[2];

  return {
    srcID: id,
    srcType: '3speak',
    url,
  };
};

export const getRumbleSrc = url => {
  const id = url.match(VIDEO_MATCH_URL.RUMBLE)[1];

  return {
    srcID: id,
    srcType: 'rumble',
    url,
  };
};

export const getBitchuteSrc = url => {
  const id = url.match(VIDEO_MATCH_URL.BITCHUTE)[2];

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
