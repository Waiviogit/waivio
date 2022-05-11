import { isError, get, attempt, size, unescape, round } from 'lodash';

export function getFromMetadata(jsonMetadata, key) {
  const metadata = attempt(JSON.parse, jsonMetadata);

  if (isError(metadata)) return null;

  return get(metadata, key);
}

const attrs = /(\w+=".*?")/g;
const attrElements = /^(\w+)="(.*?)"$/;
const imgTag = /<img(.*?)\/>/g;
const hrefRegex = /<a[^>]+href="([^">]+)"/g;

function extract(body, regex) {
  const matches = [];

  let match;

  do {
    match = regex.exec(body);
    if (match) matches.push(match[1]);
  } while (match);

  return matches;
}

export function extractImageTags(body) {
  return extract(body, imgTag).map(image => {
    const attributes = image.match(attrs);

    return attributes.reduce((a, b) => {
      const values = b.match(attrElements);

      if (size(values) === 3) {
        const key = get(values, 1);
        const value = get(values, 2);

        return {
          ...a,
          [key]: value,
        };
      }

      return a;
    }, {});
  });
}

export function extractLinks(body) {
  return extract(body, hrefRegex).map(unescape);
}

export const replacer = value => value.replace(/^@/g, '');

export const fixedNumber = (num, precision) => {
  if (!num) return 0;

  if (precision)
    return typeof num === 'number' ? num.toFixed(precision) : Number(num).toFixed(precision);

  const currPrecision = num > 0.001 ? 3 : 5;

  return round(num, currPrecision);
};

export default null;
