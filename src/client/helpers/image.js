import filesize from 'filesize';

const IMG_PREVIEW = '?width=800&height=600&format=webp&mode=fit';
const IMG_PROXY_SMALL = 'https://images.hive.blog/p/';
const IMG_PROXY = 'https://images.hive.blog/0x0/';

export const MAXIMUM_UPLOAD_SIZE = 15728640;
export const MAXIMUM_UPLOAD_SIZE_HUMAN = filesize(MAXIMUM_UPLOAD_SIZE);

export const getProxyImageURL = (url, type) => {
  if (
    url.includes('ipfs.io') ||
    url.indexOf('https://ipfs.busy.org') === 0 ||
    url.indexOf('https://img.esteem.ws') === 0
  )
    return `${IMG_PROXY}${url}`;
  else if (type === 'preview') return `${url}${IMG_PREVIEW}`;
  else if (type === 'small') return `${IMG_PROXY_SMALL}${url}`;

  return url;
};

export const isValidImage = (file, maxFileSize = MAXIMUM_UPLOAD_SIZE, allowedFormats = null) => {
  const pattern = allowedFormats
    ? new RegExp(`^image/(${allowedFormats.join('|')})$`, 'g')
    : 'image/.*';
  return file.type.match(pattern) && file.size <= maxFileSize;
};

export default null;
