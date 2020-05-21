import filesize from 'filesize';

const IMG_PROXY = 'https://images.hive.blog/0x0/';
const IMG_PROXY_SMALL = 'https://images.hive.blog/40x40/';
const IMG_PROXY_PREVIEW = 'https://images.hive.blog/800x600/';

export const MAXIMUM_UPLOAD_SIZE = 15728640;
export const MAXIMUM_UPLOAD_SIZE_HUMAN = filesize(MAXIMUM_UPLOAD_SIZE);

export const getProxyImageURL = (url, type) => {
  if (
    url.includes('ipfs.io') ||
    url.indexOf('https://ipfs.busy.org') === 0 ||
    url.indexOf('https://img.esteem.ws') === 0
  )
    return `${IMG_PROXY}${url}`;
  else if (type === 'preview') {
    if (url.indexOf('//') === 0) return `${IMG_PROXY_PREVIEW}http:${url}`;
    return `${IMG_PROXY_PREVIEW}${url}`;
  } else if (type === 'small') return `${IMG_PROXY_SMALL}${url}`;

  return url;
};

export const isValidImage = (file, maxFileSize = MAXIMUM_UPLOAD_SIZE, allowedFormats = null) => {
  const pattern = allowedFormats
    ? new RegExp(`^image/(${allowedFormats.join('|')})$`, 'g')
    : 'image/.*';
  return file.type.match(pattern) && file.size <= maxFileSize;
};

export default null;
