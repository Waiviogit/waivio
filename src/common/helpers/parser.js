import { isError, get, attempt, size, unescape } from 'lodash';
import { parseJSON } from './parseJSON';

export const linkifyText = text => {
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s/$.?#].[^\s]*)\)/g;

  const parts = text.split(/(\[.*?\]\(.*?\))/g);

  return parts
    .reduce((acc, part) => {
      if (markdownLinkRegex.test(part)) {
        acc.push(
          part.replace(markdownLinkRegex, (match, p1, p2) => {
            let trailingPunctuation = '';

            if (p2.endsWith('.')) {
              // eslint-disable-next-line no-param-reassign
              p2 = p2.slice(0, -1);
              trailingPunctuation = '.';
            }

            return `[${p1}](${p2})${trailingPunctuation}`;
          }),
        );
      } else {
        acc.push(
          part.replace(urlRegex, url => {
            let trailingPunctuation = '';

            if (url.endsWith('.')) {
              // eslint-disable-next-line no-param-reassign
              url = url.slice(0, -1);
              trailingPunctuation = '.';
            }

            return `<${url}>${trailingPunctuation}`;
          }),
        );
      }

      return acc;
    }, [])
    .join('');
};
export function getFromMetadata(jsonMetadata, key) {
  const metadata = attempt(parseJSON, jsonMetadata);

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
    const attributes = image?.match(attrs);

    return attributes.reduce((a, b) => {
      const values = b?.match(attrElements);

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

  return num.toFixed(currPrecision);
};

export default null;
