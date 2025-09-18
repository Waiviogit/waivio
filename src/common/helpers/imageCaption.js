const IMG_EXT_RE = /\.(?:jpe?g|png|webp|gif|bmp|tiff?|heic|heif|svg|avif)(?=($|[?#\s"')]))/i;

const hasImageExtension = s => IMG_EXT_RE.test((s || '').toLowerCase());

export const shouldShowCaption = (alt, src) => {
  const altText = (alt || '').trim();

  if (!altText || alt === src) return false;
  if (hasImageExtension(altText)) return false; // ← головне нове правило

  // невеликий fallback, щоб не показувати ім'я файлу без розширення
  const base = ((src || '').split('/').pop() || '').replace(/\.[^.]+$/, '');
  const altClean = altText
    .toLowerCase()
    .replace(/[_\-.]+/g, ' ')
    .trim();
  const baseClean = base
    .toLowerCase()
    .replace(/[_\-.]+/g, ' ')
    .trim();

  return altClean !== baseClean;
};

export const createImageWithCaption = (src, alt, link) => {
  const imgAttributes = `src="${src}" alt="${alt}" data-fallback-src="${src}" : ''}`;

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
