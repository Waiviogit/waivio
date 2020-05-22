import filesize from 'filesize';
import base58 from 'bs58';

const IMG_PREVIEW = '?width=800&height=600&format=webp&mode=fit';
const IMG_PROXY_SMALL = 'https://images.hive.blog/p/';
const IMG_PROXY = 'https://images.hive.blog/0x0/';

export const MAXIMUM_UPLOAD_SIZE = 15728640;
export const MAXIMUM_UPLOAD_SIZE_HUMAN = filesize(MAXIMUM_UPLOAD_SIZE);

export const getProxyImageURL = (url, type) => {
  if (type === 'preview') return `${IMG_PROXY_SMALL}${base58.encode(new Buffer(url))}${IMG_PREVIEW}`;
  else if (type === 'small') return `${IMG_PROXY_SMALL}${base58.encode(new Buffer(url))}`;

  return `${IMG_PROXY}${url}`;
};

export const isValidImage = (file, maxFileSize = MAXIMUM_UPLOAD_SIZE, allowedFormats = null) => {
  const pattern = allowedFormats
    ? new RegExp(`^image/(${allowedFormats.join('|')})$`, 'g')
    : 'image/.*';
  return file.type.match(pattern) && file.size <= maxFileSize;
};

export default null;
