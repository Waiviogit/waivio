import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

const HtmlSandbox = ({ html, className, autoSize = true, maxHeight }) => {
  const iframeRef = useRef(null);
  const [interactive, setInteractive] = useState(false);

  // -------- helpers -------------------------------------------------
  const stripPreCodeWrapper = (input = '') => {
    const m = String(input)
      .trim()
      .match(/^<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>$/i);

    if (!m) return input;
    const decode = s =>
      s
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    return decode(m[1]);
  };

  const stripMdFencesLoose = (input = '') => {
    const s = String(input)
      .trim()
      .replace(/^\uFEFF/, '');
    const m = s.match(/^(```|~~~)\s*([a-z0-9_+.-]*)\s*\r?\n([\s\S]*?)\r?\n\1\s*$/i);

    return m ? m[3] : input;
  };

  const maybeDecodeEntities = (input = '') => {
    const s = String(input);
    const looksEscaped = /&lt;|&gt;|&amp;|&quot;|&#39;/.test(s);
    const hasRealTags = /<[a-z!/]/i.test(s);

    if (looksEscaped && !hasRealTags) {
      const ta = document.createElement('textarea');

      ta.innerHTML = s;

      return ta.value;
    }

    return s;
  };

  // важливо: НЕ ламаємо sticky/fixed та фон. Лише чистимо потенційно небезпечне + патчимо vh.
  const sanitizeCss = (css = '') =>
    css
      .replace(/expression\s*\(/gi, '')
      .replace(/behavior\s*:/gi, '')
      .replace(/-moz-binding\s*:/gi, '')
      .replace(/url\(\s*(['"])?\s*javascript:.*?\)/gi, 'url(about:blank)')
      .replace(/@charset\s+["'][^"']*["'];?/gi, '')
      .replace(/@namespace[\s\S]*?;?/gi, '')
      .replace(/\b(\d+(?:\.\d+)?)\s*(?:[sld])?vh\b/gi, (_m, n) => `calc(var(--hs-vh, 1vh) * ${n})`);

  // ------ sanitize-html config -------------------------------------
  const sanitizeConfig = useMemo(() => {
    const cfg = {
      allowedTags: [
        'html',
        'body',
        'style',
        'link',
        'div',
        'section',
        'article',
        'header',
        'footer',
        'main',
        'aside',
        'nav',
        'p',
        'span',
        'strong',
        'em',
        'u',
        's',
        'small',
        'mark',
        'abbr',
        'time',
        'br',
        'hr',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'pre',
        'code',
        'kbd',
        'samp',
        'ul',
        'ol',
        'li',
        'dl',
        'dt',
        'dd',
        'img',
        'picture',
        'source',
        'figure',
        'figcaption',
        'video',
        'audio',
        'track',
        'table',
        'thead',
        'tbody',
        'tfoot',
        'tr',
        'th',
        'td',
        'col',
        'colgroup',
        'a',
        'script',
        'button',
        'iframe',
        // SVGs
        'svg',
        'g',
        'path',
        'circle',
        'ellipse',
        'rect',
        'line',
        'polyline',
        'polygon',
        'defs',
        'clippath',
        'mask',
        'pattern',
        'lineargradient',
        'radialgradient',
        'stop',
        'use',
        'symbol',
        'filter',
        'fecomponenttransfer',
        'fecomposite',
        'fegaussianblur',
        'feoffset',
        'femerge',
        'femergenode',
        'feflood',
        'fedisplacementmap',
        'feturbulence',
        'feimage',
        'feblend',
        'fecolormatrix',
        'fespotlight',
        'fepointlight',
        'fedistantlight',
        'fespecularlighting',
        'femorphology',
        'feconvolvematrix',
        'canvas',
      ],
      disallowedTagsMode: 'discard',
      exclusiveFilter: frame => {
        const t = String(frame.tag || '').toLowerCase();

        return (
          t === 'title' || t === 'meta' || t === 'base' || t === 'noscript' || t === 'template'
        );
      },
      allowedAttributes: {
        '*': [
          'class',
          'id',
          'title',
          'role',
          'data-*',
          'aria-*',
          'style',
          // дозволяємо on* бо валідацію вже зробили
          'onclick',
          'ondblclick',
          'onmousedown',
          'onmouseup',
          'onmouseover',
          'onmousemove',
          'onmouseout',
          'onkeydown',
          'onkeyup',
          'onkeypress',
          'onfocus',
          'onblur',
          'onchange',
          'onsubmit',
          'onreset',
          'onselect',
          'onload',
          'onunload',
          'ontouchstart',
          'ontouchend',
          'ontouchmove',
        ],
        script: ['src', 'async', 'defer', 'type', 'crossorigin', 'integrity', 'referrerpolicy'],
        a: ['href', 'name', 'target', 'rel', 'title', 'download'],
        img: [
          'src',
          'srcset',
          'sizes',
          'alt',
          'width',
          'height',
          'loading',
          'decoding',
          'referrerpolicy',
        ],
        source: ['src', 'srcset', 'type', 'media', 'sizes'],
        video: [
          'src',
          'controls',
          'autoplay',
          'loop',
          'muted',
          'playsinline',
          'poster',
          'width',
          'height',
        ],
        audio: ['src', 'controls', 'autoplay', 'loop', 'muted', 'preload'],
        iframe: [
          'src',
          'srcdoc',
          'width',
          'height',
          'allow',
          'allowfullscreen',
          'loading',
          'referrerpolicy',
        ],
        link: [
          'rel',
          'href',
          'media',
          'as',
          'type',
          'crossorigin',
          'referrerpolicy',
          'integrity',
          'disabled',
          'title',
        ],
        canvas: ['id', 'width', 'height', 'class', 'style', 'role', 'aria-label'],
        svg: [
          'viewbox',
          'width',
          'height',
          'xmlns',
          'xmlns:xlink',
          'role',
          'aria-label',
          'aria-hidden',
          'preserveaspectratio',
        ],
        g: ['transform', 'opacity', 'clip-path', 'fill', 'stroke', 'stroke-width'],
        path: [
          'd',
          'fill',
          'stroke',
          'stroke-width',
          'opacity',
          'transform',
          'vector-effect',
          'fill-rule',
          'clip-rule',
        ],
        circle: ['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width', 'opacity', 'transform'],
        ellipse: ['cx', 'cy', 'rx', 'ry', 'fill', 'stroke', 'stroke-width', 'opacity', 'transform'],
        rect: [
          'x',
          'y',
          'width',
          'height',
          'rx',
          'ry',
          'fill',
          'stroke',
          'stroke-width',
          'opacity',
          'transform',
        ],
        line: ['x1', 'y1', 'x2', 'y2', 'stroke', 'stroke-width', 'opacity', 'transform'],
        polyline: ['points', 'fill', 'stroke', 'stroke-width', 'opacity', 'transform'],
        polygon: ['points', 'fill', 'stroke', 'stroke-width', 'opacity', 'transform'],
        defs: ['id'],
        clippath: ['id', 'clippathunits'],
        use: ['href', 'xlink:href', 'x', 'y', 'width', 'height', 'transform', 'opacity'],
        lineargradient: [
          'id',
          'x1',
          'y1',
          'x2',
          'y2',
          'gradientunits',
          'gradienttransform',
          'spreadmethod',
        ],
        radialgradient: [
          'id',
          'cx',
          'cy',
          'r',
          'fx',
          'fy',
          'fr',
          'gradientunits',
          'gradienttransform',
          'spreadmethod',
        ],
        stop: ['offset', 'stop-color', 'stop-opacity'],
        pattern: [
          'id',
          'width',
          'height',
          'patternunits',
          'patterntransform',
          'x',
          'y',
          'viewbox',
          'patterncontentunits',
        ],
        mask: ['id', 'x', 'y', 'width', 'height', 'maskunits'],
        table: ['border', 'cellpadding', 'cellspacing', 'width', 'align'],
        filter: ['id', 'x', 'y', 'width', 'height', 'filterunits', 'primitiveunits'],
        fegaussianblur: ['in', 'stddeviation', 'result'],
        feoffset: ['in', 'dx', 'dy', 'result'],
        femerge: ['result'],
        femergenode: ['in'],
      },
      allowedSchemesByTag: {
        a: ['http', 'https', 'mailto', 'tel'],
        img: ['http', 'https', 'data', 'blob'],
        video: ['http', 'https'],
        audio: ['http', 'https'],
        source: ['http', 'https', 'data', 'blob'],
        link: ['http', 'https'],
        iframe: ['http', 'https', 'data', 'blob'],
        script: ['https'],
      },
      allowProtocolRelative: false,
      transformTags: {
        a: (tagName, attribs) => ({
          tagName: 'a',
          attribs: { ...attribs, rel: 'noopener nofollow ugc', target: '_blank' },
        }),
        link: (tagName, attribs) => {
          const rel = (attribs.rel || '').toLowerCase();

          if (
            (rel === 'stylesheet' || rel === 'preconnect' || rel === 'dns-prefetch') &&
            attribs.href
          ) {
            return { tagName: 'link', attribs };
          }

          return { tagName: 'noscript', attribs: {} };
        },
        style: (tagName, attribs) => ({ tagName: 'style', attribs }),
        img: (tagName, attribs) => ({
          tagName: 'img',
          attribs: {
            loading: attribs.loading || 'lazy',
            decoding: attribs.decoding || 'async',
            referrerpolicy: attribs.referrerpolicy || 'no-referrer',
            ...attribs,
          },
        }),
        script: (tagName, attribs) => {
          const src = (attribs?.src || '').trim();

          // Inline <script> оставляем (если ты хочешь разрешать inline-логику пользователя)
          if (!src) return { tagName: 'script', attribs };

          // Разрешаем только Google Tag (GA4) и GTM
          const isGoogleAllowed =
            /^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+/i.test(src) ||
            /^https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-[A-Z0-9]+/i.test(src);

          if (!isGoogleAllowed) {
            return { tagName: 'noscript', attribs: {} };
          }

          // Нормализуем атрибуты (async обычно нужен)
          const safeAttribs = {
            src,
            async: 'async',
            ...(attribs.defer ? { defer: 'defer' } : {}),
            ...(attribs.type ? { type: attribs.type } : {}),
            ...(attribs.crossorigin ? { crossorigin: attribs.crossorigin } : {}),
            ...(attribs.integrity ? { integrity: attribs.integrity } : {}),
            ...(attribs.referrerpolicy ? { referrerpolicy: attribs.referrerpolicy } : {}),
          };

          return { tagName: 'script', attribs: safeAttribs };
        },
      },
    };

    return cfg;
  }, []);

  // Виявляємо VH
  const hasVh = useMemo(() => /\b(\d+(?:\.\d+)?)\s*(?:[sld])?vh\b/gi.test(html || ''), [html]);

  // Авто-висота працює лише якщо НЕМає vh (інакше даємо внутрішній скрол)
  const effectiveAutoSize = useMemo(() => autoSize && !hasVh, [autoSize, hasVh]);

  // --------- HTML під iframe ---------------------------------------
  const processedHtml = useMemo(() => {
    let raw = stripPreCodeWrapper(html || '');

    raw = stripMdFencesLoose(raw);
    raw = maybeDecodeEntities(raw);
    raw = raw
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<base[^>]*>/gi, '');

    const cleanHtml = sanitizeHtml(raw, sanitizeConfig);

    const processed = cleanHtml.replace(/style\s*=\s*(['"])([\s\S]*?)\1/gi, (m, q, css) => {
      const safe = sanitizeCss(css);

      return `style=${q}${safe}${q}`;
    });

    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const linkRegex = /<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi;
    const styles = [];
    const links = [];
    let bodyHtml = processed;
    let m;

    // eslint-disable-next-line no-cond-assign
    while ((m = styleRegex.exec(processed)) !== null) {
      styles.push(sanitizeCss(m[1] || ''));
      bodyHtml = bodyHtml.replace(m[0], '');
    }
    // eslint-disable-next-line no-cond-assign
    while ((m = linkRegex.exec(processed)) !== null) {
      links.push(m[0]);
      bodyHtml = bodyHtml.replace(m[0], '');
    }

    bodyHtml = bodyHtml
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<base[^>]*>/gi, '')
      .replace(/<\/?(html|body)\b[^>]*>/gi, '');

    // ВАЖЛИВО: дозволяємо скрипти/фрейми у CSP (бо є власна валідація)
    const headContent = `
      <meta charset="utf-8">
      <meta http-equiv="Content-Security-Policy" content="
        default-src 'self' data: blob: https:;
        img-src * data: blob:;
        media-src *;
        font-src *;
        style-src * 'unsafe-inline';
        script-src 'unsafe-inline' https: data: blob:;
        connect-src *;
        frame-src *;
        child-src *;
        object-src 'none';
        base-uri 'none';
        form-action 'none';
      ">
      <style>
        :root { color-scheme: light dark; --hs-vh: 1vh; }
        html, body { margin: 0; box-sizing: border-box; }
        *, *::before, *::after { box-sizing: inherit; }
        /* якщо autoSize увімкнено — ховаємо внутр. вертикальний скрол, інакше дозволяємо */
        html { ${effectiveAutoSize ? 'overflow-y:hidden;' : 'overflow-y:auto;'} overflow-x:hidden; }
        img, video, svg, canvas, iframe { max-width: 100%; height: auto; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #e5e7eb; padding: 6px; vertical-align: top; }
        pre, code { white-space: pre-wrap; word-break: break-word; }
      </style>
      ${links.join('\n')}
      ${styles.map(cssText => `<style>${cssText}</style>`).join('\n')}
    `;

    return `<!doctype html>
<html>
<head>${headContent}</head>
<body>
${bodyHtml}
<div id="__hs-end" style="height:0; clear:both;"></div>
</body>
</html>`;
  }, [html, sanitizeConfig, effectiveAutoSize]);

  // --------- sizing -------------------------------------------------
  const updateVhVar = () => {
    try {
      const iframe = iframeRef.current;

      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      const h = Math.max(
        1,
        Math.round((iframe.clientHeight || iframe.getBoundingClientRect().height || 0) / 100),
      );

      if (doc?.documentElement) doc.documentElement.style.setProperty('--hs-vh', `${h}px`);
    } catch (e) {
      /* noop */
    }
  };

  const fit = () => {
    if (!effectiveAutoSize || !iframeRef.current) return;
    try {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (!doc) return;

      const d = doc.documentElement;
      const body = doc.body;
      const end = doc.getElementById('__hs-end');

      const padB = parseFloat(doc.defaultView.getComputedStyle(body).paddingBottom || '0') || 0;

      const endBottomByOffset = (end?.offsetTop || 0) + (end?.offsetHeight || 0) + padB;

      const rectEnd = end?.getBoundingClientRect?.();
      const rectBody = body?.getBoundingClientRect?.();
      const rectDoc = d?.getBoundingClientRect?.();
      const bottomByRect = Math.max(
        rectEnd ? rectEnd.bottom : 0,
        rectBody ? rectBody.bottom : 0,
        rectDoc ? rectDoc.bottom : 0,
      );

      const fallback = Math.max(
        body?.scrollHeight || 0,
        d?.scrollHeight || 0,
        d?.clientHeight || 0,
      );

      const tight = Math.max(endBottomByOffset, bottomByRect, fallback, 0);

      if (tight > 0) {
        const newH = maxHeight ? Math.min(tight, maxHeight) : tight;

        iframe.style.height = `${newH}px`;
        updateVhVar();
      }
    } catch (e) {
      /* noop */
    }
  };

  // стартова висота:
  // - якщо effectiveAutoSize=true → clamp по viewport, напр. 300..900
  // - якщо false (є vh) → даємо адекватне вікно зі скролом, напр. 600..1000, а не maxHeight
  const initialStartHeight = useMemo(() => {
    const vp = typeof window !== 'undefined' ? window.innerHeight : 0;

    if (effectiveAutoSize) {
      const clamped = Math.max(300, Math.min(vp || 0, 900));

      return maxHeight ? Math.min(maxHeight, clamped) : clamped;
    }
    // режим зі скролом
    const clamped = Math.max(600, Math.min(vp || 0, 1000)) || 800;

    return maxHeight ? Math.min(maxHeight, clamped) : clamped;
  }, [effectiveAutoSize, maxHeight]);

  // --------- lifecycle ---------------------------------------------
  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    const handleLoad = () => {
      setInteractive(false);
      iframe.style.height = `${initialStartHeight}px`;
      updateVhVar();

      // підлаштовуємося під вміст
      if (effectiveAutoSize) {
        requestAnimationFrame(() => fit());
        setTimeout(fit, 50);
        setTimeout(fit, 250);
        setTimeout(() => {
          fit();
          setInteractive(true);
        }, 1000);
      } else {
        setInteractive(true);
      }

      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;

        // ресайз при завантаженні картинок/шрифтів
        [...(doc?.images || [])].forEach(img => {
          if (!img.complete)
            img.addEventListener(
              'load',
              () => {
                fit();
                updateVhVar();
              },
              { once: true },
            );
        });
        doc?.fonts?.ready?.then?.(() =>
          setTimeout(() => {
            fit();
            updateVhVar();
          }, 0),
        );

        const mo = new MutationObserver(() => {
          fit();
          updateVhVar();
        });

        mo.observe(doc?.body || doc, { childList: true, subtree: true });
        iframe.__mo = mo;

        const ro = new ResizeObserver(() => {
          fit();
          updateVhVar();
        });

        if (doc?.body) ro.observe(doc.body);
        if (doc?.documentElement) ro.observe(doc.documentElement);
        iframe.__ro = ro;
      } catch (e) {
        console.error(e);
      }
    };

    const onOuterResize = () => {
      fit();
      updateVhVar();
    };

    iframe.addEventListener('load', handleLoad);
    window.addEventListener('resize', onOuterResize);
    window.addEventListener('orientationchange', onOuterResize);

    // eslint-disable-next-line consistent-return
    return () => {
      iframe.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', onOuterResize);
      window.removeEventListener('orientationchange', onOuterResize);
      try {
        iframe.__mo?.disconnect?.();
      } catch (e) {
        console.error(e);
      }
      try {
        iframe.__ro?.disconnect?.();
      } catch (e) {
        console.error(e);
      }
      try {
        if (iframe.__setVh) {
          window.removeEventListener('resize', iframe.__setVh);
          window.removeEventListener('orientationchange', iframe.__setVh);
        }
      } catch (e) {
        console.error(e);
      }
    };
  }, [effectiveAutoSize, maxHeight, initialStartHeight]);

  // Скрипти дозвлені завжди (валидація вже зроблена)
  const sandboxValue =
    'allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin';

  return (
    <iframe
      ref={iframeRef}
      srcDoc={processedHtml}
      sandbox={sandboxValue}
      referrerPolicy="no-referrer"
      className={className}
      scrolling={effectiveAutoSize ? 'no' : 'auto'}
      style={{
        display: 'block',
        width: '100%',
        height: `${initialStartHeight}px`,
        border: 'none',
        verticalAlign: 'top',
        pointerEvents: interactive ? 'auto' : 'none',
      }}
      title="HTML Sandbox"
    />
  );
};

HtmlSandbox.propTypes = {
  html: PropTypes.string.isRequired,
  className: PropTypes.string,
  autoSize: PropTypes.bool,
  maxHeight: PropTypes.number,
};

export default HtmlSandbox;
