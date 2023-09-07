import filesize from 'filesize';
import { unescape } from 'he';
import base58 from 'bs58';

const IMG_PROXY_PREVIEW = 'https://images.hive.blog/800x600/';
const IMG_PROXY_SMALL = 'https://images.hive.blog/p/';
const IMG_PROXY = 'https://images.hive.blog/0x0/';

export const MAXIMUM_UPLOAD_SIZE = 15728640;
export const MAXIMUM_UPLOAD_SIZE_HUMAN = filesize(MAXIMUM_UPLOAD_SIZE);

export const getProxyImageURL = (url, type) => {
  if (url?.includes('sephora.com') || url?.includes('waivio.nyc3.digitaloceanspaces')) {
    return url;
  }
  if (type === 'preview') {
    try {
      const urlEncoded = base58.encode(new Buffer(unescape(url)));

      return `${IMG_PROXY_PREVIEW}${IMG_PROXY_SMALL}${urlEncoded}`;
    } catch (e) {
      console.warn('\tEncode img url error. Image url:', url);
    }
  }

  return `${IMG_PROXY}${url}`;
};

export const isValidImage = (file, maxFileSize = MAXIMUM_UPLOAD_SIZE, allowedFormats = null) => {
  const pattern = allowedFormats
    ? new RegExp(`^image/(${allowedFormats.join('|')})$`, 'g')
    : 'image/.*';

  return file.type?.match(pattern) && file.size <= maxFileSize;
};

export const getImagePath = (album, image, type) =>
  album.body === 'Related' && !album.body.includes('waivio.nyc3.digitaloceanspaces')
    ? getProxyImageURL(image, type)
    : image;

export const getImagePathPost = url =>
  url.includes('nyc3.digitaloceanspaces') ? url : getProxyImageURL(url);

export default null;
