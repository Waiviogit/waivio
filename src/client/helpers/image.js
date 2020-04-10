import filesize from 'filesize';

const IMG_PROXY = 'https://images.hive.blog/0x0/';
const IMG_PROXY_PREVIEW = 'https://images.hive.blog/600x800/';
const IMG_PROXY_SMALL = 'https://images.hive.blog/40x40/';

export const MAXIMUM_UPLOAD_SIZE = 15728640;
export const MAXIMUM_UPLOAD_SIZE_HUMAN = filesize(MAXIMUM_UPLOAD_SIZE);

export const getProxyImageURL = (url, type) => {
  if (url.includes('.digitaloceanspaces.com') || url.indexOf('https://gateway.ipfs.io') === 0) {
    return url;
  } else if (type === 'preview') {
    return `${IMG_PROXY_PREVIEW}${url}`;
  } else if (type === 'small') {
    return `${IMG_PROXY_SMALL}${url}`;
  }
  return `${IMG_PROXY}${url}`;
};

export const isValidImage = (file, maxFileSize = MAXIMUM_UPLOAD_SIZE, allowedFormats = null) => {
  const pattern = allowedFormats
    ? new RegExp(`^image/(${allowedFormats.join('|')})$`, 'g')
    : 'image/.*';
  return file.type.match(pattern) && file.size <= maxFileSize;
};

export default null;
