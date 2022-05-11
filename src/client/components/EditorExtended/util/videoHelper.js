import classNames from 'classnames';
import { VIDEO_MATCH_URL } from '../../../../common/helpers/regexHelpers';

const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';
const DTUBE_PREFIX = 'https://emb.d.tube/#!/';
const THREESPEAK_PREFIX = 'https://3speak.online/embed?v=';
const THREESPEAK_TV_PREFIX = 'https://3speak.tv/embed?v=';
const RUMBLE_PREFIX = 'https://rumble.com/embed/';
const BITCHUTE_PREFIX = 'https://www.bitchute.com/embed/';

export const TWITCH_PREFIX = `https://player.twitch.tv/?parent=${currentHost}&`;
export const TIKTOK_PREFIX = 'https://www.tiktok.com/embed/v2/';
export const FACEBOOK_PREFIX = 'https://www.facebook.com/plugins/video.php?height=280&href=';
export const PEERTUBE_PREFIX = 'https://media.zat.im/videos/embed/';

export const isFacebook = url =>
  VIDEO_MATCH_URL.FACEBOOK.test(url) || VIDEO_MATCH_URL.FACEBOOK_SHORT.test(url);

export const isOdysee = url => VIDEO_MATCH_URL.ODYSEE.test(url);

export const isTwitchPlayer = url => VIDEO_MATCH_URL.TWITCH_PLAYER.test(url);

const isTwitch = url => VIDEO_MATCH_URL.TWITCH.test(url);

export const isYoutube = url =>
  url.includes('shorts')
    ? VIDEO_MATCH_URL.YOUTUBE_SHORTS.test(url)
    : VIDEO_MATCH_URL.YOUTUBE.test(url);

export const isVimeo = url => VIDEO_MATCH_URL.VIMEO.test(url);

export const isDTube = url => VIDEO_MATCH_URL.DTUBE.test(url);

export const isThreeSpeak = url => VIDEO_MATCH_URL.THREE_SPEAK.test(url);
export const isThreeSpeakTV = url => VIDEO_MATCH_URL.THREE_SPEAK_TV.test(url);

export const isRumble = url => VIDEO_MATCH_URL.RUMBLE.test(url);

export const isBitchute = url => VIDEO_MATCH_URL.BITCHUTE.test(url);

export const isTikTok = url => VIDEO_MATCH_URL.TIKTOK.test(url);

export const isInstagram = url => VIDEO_MATCH_URL.INSTAGRAM.test(url);
export const isInstagramReel = url => VIDEO_MATCH_URL.INSTAGRAM_REEL.test(url);

export const isPeerTube = url => VIDEO_MATCH_URL.PEERTUBE.test(url);

export const getIframeContainerClass = embed =>
  classNames('PostFeedEmbed__container', {
    'PostFeedEmbed__container-vimeo': embed.provider_name === 'Vimeo',
    PostFeedEmbed__container_high: embed.url && embed.url.includes('tiktok.com/'),
    'PostFeedEmbed__container_instagram-reel': VIDEO_MATCH_URL.INSTAGRAM_REEL.test(embed.url),
    PostFeedEmbed__container_instagram: VIDEO_MATCH_URL.INSTAGRAM.test(embed.url),
  });

export const getYoutubeSrc = url => {
  const id =
    url && url.includes('shorts')
      ? url.match(VIDEO_MATCH_URL.YOUTUBE_SHORTS)[1]
      : url.match(VIDEO_MATCH_URL.YOUTUBE)[1];

  return {
    srcID: id,
    srcType: 'youtube',
    url,
  };
};

export const getOdyseeLink = async url => {
  const match = url.replace(/(\?.*=.*)/, '').match(VIDEO_MATCH_URL.ODYSEE);
  const name = match && match[1];

  try {
    const body = {
      method: 'resolve',
      params: {
        urls: [name],
      },
    };
    const res = await fetch('https://api.na-backend.odysee.com/api/v1/proxy?m=get', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const _res = await res.json();
    const claimId = _res.result[name].claim_id;
    const claimName = _res.result[name].name;

    return `https://odysee.com/$/embed/${claimName}/${claimId}`;
  } catch (e) {
    return false;
  }
};

export const getOdyseeSrc = async url => ({
  srcID: url,
  srcType: 'odysee',
  url,
});

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

export const getThreeSpeakTVSrc = url => {
  const id = url.match(VIDEO_MATCH_URL.THREE_SPEAK_TV)[2];

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

export const getTwitchSrc = url => {
  let id = '';

  const match = url.match(VIDEO_MATCH_URL.TWITCH);

  if (match) {
    id = match[1] ? `video=${match[2]}` : `channel=${match[2]}`;
  }

  return {
    srcID: id,
    srcType: 'twitch',
    url,
  };
};

export const getTikTokSrc = url => {
  let srcID = '';

  const match = url.match(VIDEO_MATCH_URL.TIKTOK);

  if (match && match[2]) srcID = match[2];

  return {
    srcType: 'tiktok',
    url,
    srcID,
  };
};

export const getFacebookSrc = url => {
  let srcID = '';

  const match = url.match(VIDEO_MATCH_URL.FACEBOOK);

  if (match && match[1]) srcID = match[1];

  return {
    srcType: 'tiktok',
    url,
    srcID,
  };
};

export const getInstagramSrc = url => {
  let srcID = '';

  const match = url.match(VIDEO_MATCH_URL.INSTAGRAM) || url.match(VIDEO_MATCH_URL.INSTAGRAM_REEL);

  if (match) srcID = match[0];

  return {
    srcType: 'instagram',
    url,
    srcID,
  };
};

export const getPeerTubeSrc = url => {
  let srcID = '';

  const match = url.match(VIDEO_MATCH_URL.PEERTUBE);

  if (match && match[1]) srcID = match[1];

  return {
    srcType: 'PeerTube',
    url,
    srcID,
  };
};

export const getSrc = ({ src }) => {
  if (isYoutube(src)) {
    const { srcID } = getYoutubeSrc(src);

    return `${YOUTUBE_PREFIX}${srcID}`;
  }
  if (isOdysee(src)) {
    return src;
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
  if (isThreeSpeakTV(src)) {
    const { srcID } = getThreeSpeakTVSrc(src);

    return `${THREESPEAK_TV_PREFIX}${srcID}`;
  }
  if (isRumble(src)) {
    const { srcID } = getRumbleSrc(src);

    return `${RUMBLE_PREFIX}${srcID}`;
  }
  if (isBitchute(src)) {
    const { srcID } = getBitchuteSrc(src);

    return `${BITCHUTE_PREFIX}${srcID}/`;
  }

  if (isTwitch(src)) {
    const { srcID } = getTwitchSrc(src);

    return `${TWITCH_PREFIX}${srcID}`;
  }
  if (isTwitchPlayer(src)) return src;

  if (isTikTok(src)) {
    const { srcID } = getTikTokSrc(src);

    return `${TIKTOK_PREFIX}${srcID}`;
  }

  if (isFacebook(src)) return `${FACEBOOK_PREFIX}${src.replace(/(\/$)/, '')}`;

  if (isInstagram(src) || isInstagramReel(src)) {
    const { srcID } = getInstagramSrc(src);

    return `${srcID}embed`;
  }

  if (isPeerTube(src)) {
    const { srcID } = getPeerTubeSrc(src);

    return `${PEERTUBE_PREFIX}${srcID}`;
  }

  return undefined;
};

export const getBodyLink = previewResult => {
  const dTubeRegExp = /https:\/\/(emb\.)?d\.tube(\/#!)?(\/v)?\/([^/"]+\/[^/"]+)/;
  const threeSpeakRegExp = /https:\/\/3speak\.online\/(watch|embed)\?v=([\w\d-/._]*)/;
  const threeSpeakTvRegExp = /https:\/\/3speak\.tv\/(watch|embed)\?v=([\w\d-/._]*)/;
  const dTubeRes = previewResult[0].match(dTubeRegExp);
  const threeSpeakRes =
    previewResult[0].match(threeSpeakRegExp) || previewResult[0].match(threeSpeakTvRegExp);

  if (dTubeRes) return dTubeRes[0].split("'>")[0];
  else if (threeSpeakRes) return threeSpeakRes[0];

  return null;
};

export default getSrc;
