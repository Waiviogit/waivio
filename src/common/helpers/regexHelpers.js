export const VIDEO_MATCH_URL = {
  YOUTUBE: /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
  YOUTUBE_SHORTS: /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/shorts\/)([\w|-]{11})(.*)$/,
  VIMEO: /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/, // eslint-disable-line no-useless-escape
  DTUBE: /^https:\/\/(emb\.)?d\.tube(\/#!)?(\/v)?\/([^/"]+\/[^/"]+)$/,
  THREE_SPEAK: /^https:\/\/3speak\.online\/(watch|embed)\?v=([\w\d-/._]*)(&|$)/,
  THREE_SPEAK_TV: /^https:\/\/3speak\.tv\/(watch|embed)\?.*v=([\w\d\-/._]*)(&|$|\))/,
  RUMBLE: /^https:\/\/rumble\.com\/embed\/([a-zA-Z0-9-_]*)/,
  BITCHUTE: /^https:\/\/(?:www\.)?bitchute\.com\/(video|embed)\/([a-zA-Z0-9-_]*)/,
  ODYSEE: /^https:\/\/odysee\.com\/(.*)/,
  TWITCH: /^(?:https?:\/\/)?(?:www\.)?(?:twitch.tv\/)(videos\/)?(.*)?$/,
  TWITCH_PLAYER: /^(?:https?:\/\/)?(player.twitch.tv\/)(.*)?$/,
  TIKTOK: /^(?:https?:\/\/)?(?:www.)?tiktok\.com\/(.*\/)?(?:video|(?:embed\/v2))\/(.*)/,
  FACEBOOK: /^(?:https?:\/\/)?(?:www.)?facebook.com\/(?:.*\/)?(?:watch|(?:videos\/.*))\/(?:\?v=)?(.*)(:?\/|$)/,
  FACEBOOK_SHORT: /^(?:https?:\/\/)?(?:www.)?fb.watch\/(.*)/,
  INSTAGRAM: /^(?:https?:\/\/)?(?:www.)?instagram.com\/(?:.){1,5}\/(.{11}(\/)?)/,
  INSTAGRAM_REEL: /^(?:https?:\/\/)?(?:www.)?instagram.com\/reel\/(.{11}(\/)?)/,
  PEERTUBE: /^(?:https?:\/\/)?(?:www.)?media.zat.im\/(?:w|videos\/embed)\/(.*)/,
};

export const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/gi;

export const dtubeImageRegex = /<a href="https:\/\/d.tube.#!\/v\/[^/"]+\/[^/"]+"><img src="[^"]+"\/><\/a>/g;

export const usernameURLRegex = /@([^/]+)/;

export const categoryRegex = /\/([^/]+)/;

export const botNameRegex = /@[\w-.]+/;

export const rewriteRegex = /"https?:\/\/(?:www)?steemit\.com(\/((([\w-]+\/)?@[\w.-]+\/[\w-]+)|(@[\w.-]+(\/(comments|followers|followed|reblogs|transfers|activity))?)|((trending|created|active|hot|promoted)(\/[\w-]+)?))?)?"/g;

// eslint-disable-next-line no-useless-escape
export const linkRegex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9$\-_.+!*'(),;?&=]|(?:%[a-fA-F0-9]{2})){1,64}(?::(?:[a-zA-Z0-9$\-_.+!*'(),;?&=]|(?:%[a-fA-F0-9]{2})){1,25})?@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?::\d{1,5})?)(\/(?:(?:[a-zA-Z0-9;\/?:@&=#~\-.+!*'(),_])|(?:%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;

export const mobileUserAgents = /Android|webOS|iPhone|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i;

export const videoPreviewRegex = /<center>[\s\S]+<\/center>/g;

export const guestUserRegex = /(waivio_|bxy_)([\w-.]+)/;

export const photosInPostRegex = /(?:!\[(.*?)\((.*?)\))/gi;

export const domainWithoutParams = /^https?:\/\/([^/]+)/;

export default null;
