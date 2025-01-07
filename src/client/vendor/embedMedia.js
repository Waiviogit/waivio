/**
 * This function is from busyorg source code
 * that was extended to support dtube and 3speak links
 * https://github.com/busyorg/embedjs/blob/dev/lib/embedjs.js
 */
import React from 'react';

import { VIDEO_MATCH_URL } from '../../common/helpers/regexHelpers';
import AsyncVideo from './asyncVideo';
import {
  FACEBOOK_PREFIX,
  getTwitchSrc,
  PEERTUBE_PREFIX,
  TIKTOK_PREFIX,
  TWITCH_PREFIX,
} from '../components/EditorExtended/util/videoHelper';

const SteemEmbed = {};

SteemEmbed.getUrls = function(text) {
  let urls = [];
  try {
    urls = text.match(/(https?:\/\/[^\s]+)/g) || [];
  } catch (e) {
    console.log(e);
  }
  return urls;
};

SteemEmbed.getAll = function(text, options, mediaSize) {
  const embeds = [];

  if (!options) options = {};
  options.width = options.width || '100%';
  options.height = options.height || '400';
  options.autoplay = 'autoplay' in options ? options.autoplay : true;

  let urls = this.getUrls(text.replace('\\', ''));
  urls.forEach(
    function(url) {
      let embed = this.get(url, options, mediaSize);
      if (embed) {
        embeds.push(this.get(url, options, mediaSize));
      }
    }.bind(this),
  );
  return embeds;
};

SteemEmbed.get = function(url, options = {}, mediumSize) {
  const youtubeId = this.isYoutube(url);
  if (youtubeId) {
    const imageName = mediumSize ? '/mqdefault.jpg' : '/hqdefault.jpg';
    return {
      type: 'video',
      url: url,
      provider_name: 'YouTube',
      thumbnail: 'https://img.youtube.com/vi/' + youtubeId + imageName,
      id: youtubeId,
      embed: this.youtube(url, youtubeId, options),
    };
  }
  const dTubeId = this.isDTube(url);
  const threeSpeakId = this.is3Speak(url);
  const twitch = this.isTwitch(url);
  const twitchPlayer = this.isTwitchPlayer(url);
  const periscopeId = this.isPeriscope(url);
  const soundcloudId = this.isSoundcloud(url);
  const vimeoId = this.isVimeo(url);
  const bitchuteId = this.isBitchute(url);
  const rumbleId = this.isRumble(url);
  const odyseeId = this.isOdysee(url);
  const tikTokId = this.isTikTok(url);
  const facebookId = this.isFaceBook(url);
  const instagramId = this.isInstagram(url);
  const peerTubeId = this.isPeerTube(url);

  if (dTubeId) {
    return {
      type: 'video',
      url: url,
      provider_name: 'DTube',
      thumbnail:
        options.thumbnail ||
        'https://waivio.nyc3.digitaloceanspaces.com/1588765219_b21a550e-5fa2-45e1-801c-4325b26fd5bf',
      id: dTubeId,
      embed: this.dTube(url, dTubeId, options),
    };
  } else if (threeSpeakId) {
    const [, permlink] = threeSpeakId.split('/');
    return {
      type: 'video',
      url: url,
      provider_name: '3Speak',
      //thumbnail: `https://img.3speakcontent.co/${threeSpeakId}/post.png`,
      id: threeSpeakId,
      embed: this.threeSpeak(url, threeSpeakId, options),
    };
  } else if (twitch) {
    return {
      type: 'video',
      url: url,
      provider_name: 'Twitch',
      id: twitch,
      embed: this.twitch(url, options),
    };
  } else if (twitchPlayer) {
    return {
      type: 'video',
      url: url,
      provider_name: 'TwitchPlayer',
      id: twitchPlayer,
      embed: this.twitchPlayer(url, options),
    };
  } else if (periscopeId) {
    return {
      type: 'video',
      url: url,
      provider_name: 'Periscope',
      id: periscopeId,
      embed: this.periscope(url, periscopeId, options),
    };
  } else if (soundcloudId) {
    return {
      type: 'music',
      url: url,
      provider_name: 'SoundCloud',
      id: soundcloudId,
      embed: this.soundcloud(url, soundcloudId, options),
    };
  } else if (vimeoId) {
    return {
      type: 'music',
      url: url,
      provider_name: 'Vimeo',
      id: vimeoId,
      embed: this.vimeo(url, vimeoId, options),
    };
  } else if (bitchuteId) {
    return {
      type: 'video',
      url: url,
      provider_name: 'BitChute',
      id: bitchuteId,
      embed: this.bitchute(url, bitchuteId, options),
    };
  } else if (rumbleId) {
    return {
      type: 'video',
      url: url,
      provider_name: 'Rumble',
      id: rumbleId,
      embed: this.rumble(url, rumbleId, options),
    };
  } else if (odyseeId) {
    return {
      type: 'video',
      url: url,
      provider_name: 'Odysee',
      id: odyseeId,
    };
  } else if (tikTokId) {
    return {
      type: 'video',
      url: url,
      provider_name: 'TikTok',
      id: tikTokId,
      embed: this.tikTok(url, tikTokId, options),
    };
  } else if (facebookId) {
    return {
      type: 'video',
      url: url,
      provider_name: 'Facebook',
      id: facebookId,
      embed: this.facebook(url, facebookId, options),
    };
  } else if (instagramId) {
    return {
      type: 'video',
      url: url,
      provider_name: 'Instagram',
      id: instagramId,
      embed: this.instagram(url, instagramId, options),
    };
  } else if (peerTubeId) {
    return {
      type: 'video',
      url: url,
      provider_name: 'PeerTube',
      id: peerTubeId,
      embed: this.peerTube(url, peerTubeId, options),
    };
  }
};
const youtubeShortUrlRegex = /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([\w-]{11})(?:\?.*)?$/;

SteemEmbed.isYoutube = function(url) {
  let match = url.includes('youtu.be')
    ? url.match(youtubeShortUrlRegex)
    : url.match(VIDEO_MATCH_URL.YOUTUBE);

  if (url.includes('shorts')) {
    match = url.match(VIDEO_MATCH_URL.YOUTUBE_SHORTS);
  }
  return match ? match[1] : false;
};

SteemEmbed.youtube = function(url, id, options) {
  let timerMatches = url.match(/[?&]t=([0-9]+h)*([0-9]+m)*([0-9]+s)+/);
  let srcUrl = '//www.youtube.com/embed/' + id + '?autoplay=false';
  if (timerMatches && timerMatches[3]) {
    srcUrl +=
      '&start=' +
      ((parseInt(timerMatches[1], 10) || 0) * 3600 +
        (parseInt(timerMatches[2]) || 0) * 60 +
        (parseInt(timerMatches[3]) || 0));
  }
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="' +
    srcUrl +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isOdysee = function(url) {
  const match = url.match(VIDEO_MATCH_URL.ODYSEE);
  return match ? match[1].replace(/(\?.*=.*)/, '') : false;
};

SteemEmbed.odysee = function(url) {
  return <AsyncVideo url={url} />;
};

SteemEmbed.isDTube = function(url) {
  const p = /^https:\/\/(emb\.)?d\.tube(\/#!)?(\/v)?\/([^/"]+\/[^/"]+)$/;
  return url.match(p) ? RegExp.$4 : false;
};

SteemEmbed.dTube = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="https://emb.d.tube/#!/' +
    id +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.is3Speak = function(url) {
  const match = url.includes('3speak.tv/')
    ? url.match(VIDEO_MATCH_URL.THREE_SPEAK_TV)
    : url.match(VIDEO_MATCH_URL.THREE_SPEAK);
  return match ? match[2] : false;
};

SteemEmbed.threeSpeak = function(url, authorPermlink, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="https://3speak.tv/embed?v=' +
    authorPermlink +
    '" allowfullscreen></iframe>'
  );
};

SteemEmbed.isTwitch = function(url) {
  let id;
  const match = url.match(VIDEO_MATCH_URL.TWITCH);

  if (match) {
    id = match[1] ? `/video${match[1]}` : match[2];
  }
  return id || false;
};

SteemEmbed.isTwitchPlayer = function(url) {
  const match = url.match(VIDEO_MATCH_URL.TWITCH_PLAYER);

  return match && match[1];
};

SteemEmbed.twitch = function(url, options) {
  const { srcID } = getTwitchSrc(url);

  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="' +
    TWITCH_PREFIX +
    srcID +
    '&autoplay=false" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.twitchPlayer = function(url, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="' +
    url +
    '&autoplay=false" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isTikTok = function(url) {
  const match = url.match(VIDEO_MATCH_URL.TIKTOK);

  return match && match[2];
};

SteemEmbed.tikTok = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="' +
    TIKTOK_PREFIX +
    id +
    (`${id}`.includes('?') ? '&' : '?') +
    'autoplay=false" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isPeriscope = function(url) {
  let p = /^(?:https?:\/\/)?(?:www\.)?(?:periscope.tv\/)(.*)?$/;
  let m = url.match(p) ? RegExp.$1.split('/') : [];
  let r = m[1] ? m[1] : false;
  return r;
};

SteemEmbed.periscope = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="//www.periscope.tv/w/' +
    id +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isSoundcloud = function(url) {
  let p = /^(?:https?:\/\/)?(?:www\.)?(?:soundcloud.com\/)(.*)?$/;
  return url.match(p) ? RegExp.$1 : false;
};

SteemEmbed.soundcloud = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="100px" src="//w.soundcloud.com/player/?url=' +
    encodeURIComponent(url) +
    `&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true" frameborder="0" allowfullscreen="allowfullscreen" loading="lazy" width="100%" height="420" sandbox="allow-scripts allow-same-origin allow-popups` +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isVimeo = function(url) {
  const match = url.match(VIDEO_MATCH_URL.VIMEO);
  return match ? match[3] : false;
};

SteemEmbed.vimeo = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="https://player.vimeo.com/video/' +
    id +
    '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
  );
};

SteemEmbed.isBitchute = function(url) {
  const match = url.match(VIDEO_MATCH_URL.BITCHUTE);
  return match ? match[2] : false;
};

SteemEmbed.bitchute = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="https://www.bitchute.com/embed/' +
    id +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isRumble = function(url) {
  let match = url.match(VIDEO_MATCH_URL.RUMBLE);
  return match ? match[1] : false;
};

SteemEmbed.rumble = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="https://rumble.com/embed/' +
    id +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isFaceBook = function(url) {
  let match = url.match(VIDEO_MATCH_URL.FACEBOOK) || url.match(VIDEO_MATCH_URL.FACEBOOK_SHORT);
  const matchFacebookEmbed = url.match(VIDEO_MATCH_URL.FACEBOOK_EMBEDED);
  if (matchFacebookEmbed) match = matchFacebookEmbed[1];
  return match ? url.replace(/(\/$)/, '') : false;
};

SteemEmbed.facebook = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="' +
    FACEBOOK_PREFIX +
    id +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isInstagram = function(url) {
  let match = url.match(VIDEO_MATCH_URL.INSTAGRAM) || url.match(VIDEO_MATCH_URL.INSTAGRAM_REEL);
  return match ? match[0] : false;
};

SteemEmbed.instagram = function(url, id, options) {
  const _url = id[id.length - 1] === '/' ? id : `${id}/`;
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="' +
    _url +
    'embed' +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isPeerTube = function(url) {
  let match = url.match(VIDEO_MATCH_URL.PEERTUBE);
  return match ? match[1] : false;
};

SteemEmbed.peerTube = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="' +
    PEERTUBE_PREFIX +
    id +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

export default SteemEmbed;
