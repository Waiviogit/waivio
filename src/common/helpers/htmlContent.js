const TAG_LIKE_RX = /<\s*(!doctype|html|head|body|script|style|div|section|svg|[a-z][a-z0-9:-]*)[\s>]/i;

function stripScriptBlocks(src = '') {
  return String(src).replace(/<script[\s\S]*?<\/script>/gi, '');
}

function hasJsxHints(src = '') {
  const s = String(src);

  if (/\bclassName\s*=/.test(s)) return true;
  if (/on[A-Z][A-Za-z0-9]*\s*=\s*\{/.test(s)) return true;
  if (/<\s*[A-Z][A-Za-z0-9]*\b/.test(s)) return true;
  if (/<>\s*[\s\S]*<\/>/.test(s)) return true;

  return false;
}

export function analyzePastedCode(src = '') {
  const text = String(src ?? '').trim();

  if (!text || text.length < 3) {
    return true;
  }
  if (/<!doctype\s+html>/i.test(text) || /<html[\s>]/i.test(text)) {
    return false;
  }
  if (!TAG_LIKE_RX.test(text)) {
    return true;
  }

  if (typeof window !== 'undefined' && 'DOMParser' in window) {
    try {
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const hasEl = !!doc.head.querySelector('*') || !!doc.body.querySelector('*');

      if (hasEl) {
        const withoutScripts = stripScriptBlocks(text);

        if (hasJsxHints(withoutScripts)) {
          return true;
        }

        return false;
      }
    } catch (e) {
      console.error(e);
    }
  }

  const withoutScripts = stripScriptBlocks(text);

  if (hasJsxHints(withoutScripts)) {
    return true;
  }

  return false;
}

export default null;
