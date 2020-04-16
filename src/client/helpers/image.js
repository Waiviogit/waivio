import filesize from 'filesize';

const IMG_PREVIEW = '?width=800&height=600&format=webp&mode=fit';
const IMG_PROXY_SMALL = 'https://images.hive.blog/p/';

export const MAXIMUM_UPLOAD_SIZE = 15728640;
export const MAXIMUM_UPLOAD_SIZE_HUMAN = filesize(MAXIMUM_UPLOAD_SIZE);

export const getProxyImageURL = (url, type) => {
  if (type === 'preview') {
    return `${url}${IMG_PREVIEW}`;
  } else if (type === 'small') {
    return `${IMG_PROXY_SMALL}${url}`;
  }
  return url;
};

export const isValidImage = (file, maxFileSize = MAXIMUM_UPLOAD_SIZE, allowedFormats = null) => {
  const pattern = allowedFormats
    ? new RegExp(`^image/(${allowedFormats.join('|')})$`, 'g')
    : 'image/.*';
  return file.type.match(pattern) && file.size <= maxFileSize;
};

export default null;
