// html-vs-jsx.js

/** Груба, але практична евристика */
export function isJsxLike(src = '') {
  const s = String(src).trim();

  const reactHints = [
    /\bimport\s+React\b/i,
    /\bfrom\s+['"]react['"]/i,
    /\bexport\s+default\b/i,
    /\buse(State|Effect|Memo|Ref|Callback)\b/,
    /\bclassName\s*=/,
    /\bon[A-Z][a-zA-Z]+\s*=\s*\{/,
    /<\s*[A-Z][A-Za-z0-9]*/, // тег з великої (компонент)
    /<>[\s\S]*<\/>/, // React Fragment
    /\breturn\s*\(/, // повертає JSX
  ];

  return reactHints.some(rx => rx.test(s));
}

export function isProbablyHtml(src = '') {
  const s = String(src).trim();

  if (!s || s.length < 3) return false;

  if (/<!doctype\s+html>/i.test(s)) return true;
  if (/<html[\s>]/i.test(s)) return true;
  if (/<(head|body|section|div|span|p|h[1-6]|svg|table|header|footer|nav|main)\b/i.test(s))
    return true;

  if (/<\/?[a-z][\s\S]*?>/i.test(s)) {
    if (isJsxLike(s)) return false;

    return true;
  }

  return false;
}

export function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function validateHtml(src = '') {
  const text = String(src ?? '');

  if (isJsxLike(text)) {
    return true;
  }

  if (isProbablyHtml(text)) {
    return false;
  }

  return true;
}
