import { isMobile } from './apiHelpers';

/**
 * Визначає, чи alt є ручним, осмисленим описом
 * (а не технічною назвою файлу/хешем/UUID тощо).
 */
export const isManualAltText = (alt, src) => {
  const altText = String(alt || '').trim();
  const srcText = String(src || '').trim();

  // ---------------- helpers ----------------
  const hasImageExtension =
    typeof window !== 'undefined' && typeof window.hasImageExtension === 'function'
      ? window.hasImageExtension
      : s => /\.(jpe?g|png|gif|webp|bmp|svg|avif|heic|heif|tiff?)$/i.test(String(s).split('?')[0]);

  const getSrcBaseName = s => {
    const file =
      String(s || '')
        .split('/')
        .pop() || '';

    return file.replace(/\.[^.]+$/, ''); // без розширення
  };

  const normalize = s =>
    String(s || '')
      .toLowerCase()
      .replace(/[_\-.]+/g, ' ')
      .replace(/[^a-z0-9\s\u0400-\u04FF]/g, '') // латиниця + кирилиця + цифри + пробіли
      .replace(/\s+/g, ' ')
      .trim();

  const stripTrailingImageNum = s =>
    String(s || '')
      .replace(/\b(image|img|photo|фото)\s*[-_#]?\s*\d+\b$/i, '')
      .trim();

  const wordCount = s =>
    String(s).trim()
      ? String(s)
          .trim()
          .split(/\s+/).length
      : 0;

  const looksMachineyName = name => {
    const base = String(name || '');

    return (
      /^[a-f0-9]{16,}$/i.test(base) || // довгі хеші
      /^\d{6,}$/.test(base) || // лише цифри
      /^(img|image|photo|pic)[-_ ]?\d+$/i.test(base) // img_123, photo-45
    );
  };

  // --------------- базові фільтри ---------------
  if (!altText) return false;
  if (altText.length < 3) return false; // занадто коротко
  if (/^[a-z0-9]$/i.test(altText)) return false; // один символ
  if (hasImageExtension(altText)) return false; // alt виду "file.jpg"
  if (/^[0-9_\-.]+$/.test(altText)) return false; // лише цифри/розділювачі

  // UUID / MD5 / SHA1
  if (/^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(altText)) return false;
  if (/^[a-f0-9]{32}$/i.test(altText)) return false; // MD5
  if (/^[a-f0-9]{40}$/i.test(altText)) return false; // SHA1

  const hasUrlPattern = /https?:\/\/[^\s]+/i;
  const photoByAnywhere = /\b(photo|фото|image|зображення)\s+by\b/i;

  if (photoByAnywhere.test(altText) || hasUrlPattern.test(altText)) return true;

  const srcBaseName = getSrcBaseName(srcText);
  const altClean0 = normalize(altText);
  const srcClean0 = normalize(srcBaseName);
  const altClean = stripTrailingImageNum(altClean0);
  const srcClean = stripTrailingImageNum(srcClean0);

  const commonTempNames = [
    'image',
    'photo',
    'img',
    'picture',
    'pic',
    'untitled',
    'download',
    'зображення',
    'фото',
  ];

  if (commonTempNames.includes(altClean)) return false;

  // слова, пов'язані з файлами (службові, а не описові)
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
    'файл',
    'документ',
    'вкладення',
    'завантаження',
    'скриншот',
    'тимчасовий',
    'кеш',
    'резерв',
  ];

  const altWords = altClean.split(/\s+/).filter(Boolean);

  // Перевірка лише на повне співпадіння, без includes
  const hasFileRelatedWord = altWords.some(w => fileRelatedWords.includes(w));

  if (hasFileRelatedWord) return false;

  // "Людяність": достатньо слів або наявність сполучників/стоп-слів
  const humanish = (() => {
    const wc = wordCount(altClean);

    if (wc >= 4) return true;

    const humanHints = [' the ', ' and ', ' of ', ' у ', ' в ', ' та ', ' з ', ' до ', ' від '];
    const padded = ` ${altClean} `;

    return humanHints.some(h => padded.includes(h));
  })();

  // ВАЖЛИВО: НЕ зрізаємо по буквальному alt===src (цей чек прибрано),
  // а лише якщо alt нормалізовано збігається з БАЗОВОЮ назвою файлу
  // і при цьому рядок не виглядає "людяним" або ім'я "машинне".
  if (altClean && srcClean && altClean === srcClean) {
    if (!humanish) return false;
    if (looksMachineyName(srcBaseName)) return false;
  }

  return true;
};

export const shouldShowCaption = (alt, src) => isManualAltText(alt, src);

export const createImageWithCaption = (src, alt, link, fallbackSrc) => {
  const imgAttributes = `src="${src}" alt="${alt}" data-fallback-src="${fallbackSrc || ''}"`;

  if (shouldShowCaption(alt, src) && link) {
    return `
    <a href="${link}" target="_blank" rel="noopener noreferrer">
        <img ${imgAttributes} style="display: block; margin: 0 auto;" />
        <figcaption class="md-block-image-caption" style="font-size: 15px; width: ${
          isMobile() ? 'calc(100vw - 20px)' : '100%'
        };  font-style: italic; text-align: center; margin: ${
      isMobile() ? '8px auto 0' : '8px 0 8px 0'
    };">${alt}</figcaption>
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
        <figcaption class="md-block-image-caption" style="font-size: 15px; width: ${
          isMobile() ? 'calc(100vw - 20px)' : '100%'
        }; font-style: italic; text-align: center; margin: ${
      isMobile() ? '8px auto 0' : '8px 0 8px 0'
    };">${alt}</figcaption>
 `;
  }

  return `<img ${imgAttributes} style="display: block; margin: 0 auto 15px;" />`;
};
