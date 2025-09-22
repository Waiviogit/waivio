const IMG_EXT_RE = /\.(?:jpe?g|png|webp|gif|bmp|tiff?|heic|heif|svg|avif)(?=($|[?#\s"')]))/i;

const hasImageExtension = s => IMG_EXT_RE.test((s || '').toLowerCase());

export const isManualAltText = (alt, src) => {
  const altText = (alt || '').trim();

  if (!altText) return false;

  if (alt === src) return false;

  if (hasImageExtension(altText)) return false;

  const srcFileName = (src || '').split('/').pop() || '';
  const srcBaseName = srcFileName.replace(/\.[^.]+$/, '');

  const altClean = altText
    .toLowerCase()
    .replace(/[_\-.]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '') // видаляємо всі спеціальні символи
    .trim();

  const srcClean = srcBaseName
    .toLowerCase()
    .replace(/[_\-.]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '') // видаляємо всі спеціальні символи
    .trim();

  if (altClean === srcClean) return false;

  if (/^[0-9_\-.]+$/.test(altText)) return false;

  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(altText)) return false;
  if (/^[a-f0-9]{32}$/i.test(altText)) return false; // MD5 хеш
  if (/^[a-f0-9]{40}$/i.test(altText)) return false; // SHA1 хеш

  if (altText.length < 3) return false;

  if (/^[a-z0-9]$/i.test(altText)) return false;

  const photoByPattern = /^(photo|фото|image|зображення)\s+by\s+/i;
  const hasUrlPattern = /https?:\/\/[^\s]+/i;

  if (photoByPattern.test(altText) || hasUrlPattern.test(altText)) {
    return true;
  }

  const commonTempNames = ['image', 'photo', 'img', 'picture', 'pic', 'untitled', 'download'];

  if (commonTempNames.includes(altClean)) return false;

  const fileRelatedWords = [
    'file',
    'filename',
    'document',
    'attachment',
    'upload',
    'download',
    'screenshot',
    'snapshot',
    'temp',
    'temporary',
    'cache',
    'backup',
  ];

  const altWords = altClean.split(/\s+/);
  const hasFileRelatedWord = altWords.some(word =>
    fileRelatedWords.some(fileWord => word.includes(fileWord) || fileWord.includes(word)),
  );

  if (hasFileRelatedWord) return false;

  return true;
};

export const shouldShowCaption = (alt, src) => isManualAltText(alt, src);

export const createImageWithCaption = (src, alt, link, fallbackSrc) => {
  const imgAttributes = `src="${src}" alt="${alt}" data-fallback-src="${fallbackSrc || ''}"`;

  if (shouldShowCaption(alt, src) && link) {
    return `
    <a href="${link}" target="_blank" rel="noopener noreferrer">
        <img ${imgAttributes} style="display: block; margin: 0 auto;" />
        <figcaption class="md-block-image-caption" style="font-size: 15px; font-style: italic; text-align: center; margin-top: 8px;">${alt}</figcaption>
    </a> 
`;
  }

  if (link) {
    return `
    <a href="${link}" target="_blank" rel="noopener noreferrer">
        <img ${imgAttributes} style="display: block; margin: 0 auto;" />
    </a> 
`;
  }

  if (shouldShowCaption(alt, src) && !link) {
    return `
        <img ${imgAttributes} style="display: block; margin: 0 auto;" />
        <figcaption class="md-block-image-caption" style="font-size: 15px; font-style: italic; text-align: center; margin-top: 8px;">${alt}</figcaption>
 `;
  }

  return `<img ${imgAttributes} style="display: block; margin: 0 auto;" />`;
};
