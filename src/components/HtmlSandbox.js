import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

const HtmlSandbox = ({ html, className, autoSize = true, maxHeight = 100000, inPreview }) => {
  const iframeRef = useRef(null);
  const [interactive, setInteractive] = useState(false);

  // Функції-хелпери залишаються без змін
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

  const sanitizeCss = (css = '') =>
    css
      .replace(/expression\s*\(/gi, '')
      .replace(/behavior\s*:/gi, '')
      .replace(/-moz-binding\s*:/gi, '')
      .replace(/url\(\s*(['"])?\s*javascript:.*?\)/gi, 'url(about:blank)')
      .replace(/@charset\s+["'][^"']*["'];?/gi, '')
      .replace(/@namespace[\s\S]*?;?/gi, '')
      .replace(/\b(\d+(?:\.\d+)?)\s*(?:[sld])?vh\b/gi, (_m, n) => `calc(var(--hs-vh, 1vh) * ${n})`);

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
      ],
      disallowedTagsMode: 'discard',
      exclusiveFilter: frame => {
        const t = String(frame.tag || '').toLowerCase();

        return (
          t === 'title' || t === 'meta' || t === 'base' || t === 'noscript' || t === 'template'
        );
      },
      allowedAttributes: {
        '*': ['class', 'id', 'title', 'role', 'data-*', 'aria-*', 'style'],
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
        button: ['onclick'],
        source: ['src', 'srcset', 'type', 'media', 'sizes'],
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
        table: ['border', 'cellpadding', 'cellspacing', 'width', 'align'],
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
      },
      allowProtocolRelative: false,
      transformTags: {
        a: (tagName, attribs) => ({
          tagName: 'a',
          attribs: { ...attribs, rel: 'noopener nofollow ugc', target: '_blank' },
        }),
        link: (tagName, attribs) => {
          const rel = (attribs.rel || '').toLowerCase();

          if (rel === 'stylesheet' && attribs.href) return { tagName: 'link', attribs };

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
      },
    };

    if (!inPreview) {
      const star = cfg.allowedAttributes['*'] || [];
      const eventHandlers = [
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
      ];

      cfg.allowedAttributes['*'] = [...star, ...eventHandlers];
    }

    return cfg;
  }, [inPreview]);

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

    const headContent = `
      <meta charset="utf-8">
      <meta http-equiv="Content-Security-Policy" content="
        default-src 'none';
        img-src * data: blob:;
        media-src *;
        font-src *;
        style-src * 'unsafe-inline';
        connect-src *;
        frame-ancestors 'none';
        form-action 'none';
        ${inPreview ? "script-src 'none';" : "script-src 'unsafe-inline';"}
      ">
      <style>
        :root {
          color-scheme: light dark;
          --hs-vh: 1vh;
        }
        html, body {
          margin: 0;
          box-sizing: border-box;
          background: transparent;
          ${autoSize ? 'overflow-y: hidden;' : 'overflow-y: auto;'}
          overflow-x: hidden;
        }
        *, *::before, *::after { box-sizing: inherit; }
        img, video, svg, canvas, iframe { max-width: 100%; height: auto; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #e5e7eb; padding: 6px; vertical-align: top; }
        pre, code { white-space: pre-wrap; word-break: break-word; }
        nav { position: sticky !important; top: 0; }
      </style>
      ${links.join('\n')}
      ${styles.map(cssText => `<style>${cssText}</style>`).join('\n')}
    `;

    return `<!doctype html>
<html>
<head>
${headContent}
</head>
<body>
${bodyHtml}
<div id="__hs-end" style="height:0; clear:both;"></div>
</body>
</html>`;
  }, [html, sanitizeConfig, autoSize, inPreview]);

  const fit = () => {
    if (!autoSize || !iframeRef.current) return;
    try {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (!doc) return;
      const d = doc.documentElement;
      const end = doc.getElementById('__hs-end');
      const padB = parseFloat(doc.defaultView.getComputedStyle(doc.body).paddingBottom || '0') || 0;
      const endBottom = (end?.offsetTop || 0) + (end?.offsetHeight || 0) + padB;
      const fallback = Math.max(
        doc.body?.scrollHeight || 0,
        d?.scrollHeight || 0,
        d?.clientHeight || 0,
      );
      const tight = Math.max(endBottom, 0) || fallback;

      if (tight > 0) iframe.style.height = `${Math.min(tight, maxHeight)}px`;
    } catch (e) {
      console.error(e);
    }
  };

  const initialStartHeight = useMemo(() => {
    const viewport = typeof window !== 'undefined' ? window.innerHeight : 0;
    const clamped = Math.max(700, Math.min(viewport || 0, 1100));

    return Math.min(maxHeight || 100000, clamped);
  }, [maxHeight]);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;
    const handleLoad = () => {
      setInteractive(false);
      iframe.style.height = `${initialStartHeight}px`;
      const setVh = () => {
        const oneVh =
          typeof window !== 'undefined' && window.innerHeight ? window.innerHeight / 100 : 0;

        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;

          if (oneVh && doc?.documentElement) {
            doc.documentElement.style.setProperty('--hs-vh', `${oneVh}px`);
          }
        } catch (e) {
          console.error(e);
        }
        fit();
      };

      setVh();
      window.addEventListener('resize', setVh);
      window.addEventListener('orientationchange', setVh);
      iframe.__setVh = setVh;
      requestAnimationFrame(() => fit());
      setTimeout(fit, 50);
      setTimeout(fit, 250);
      setTimeout(() => {
        fit();
        setInteractive(true);
      }, 1000);

      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;

        [...(doc?.images || [])].forEach(img => {
          if (!img.complete) img.addEventListener('load', fit, { once: true });
        });
        doc?.fonts?.ready?.then?.(() =>
          setTimeout(() => {
            fit();
            setInteractive(true);
          }, 0),
        );
        const mo = new MutationObserver(() => fit());

        mo.observe(doc?.body || doc, { childList: true, subtree: true });
        iframe.__mo = mo;
        const ro = new ResizeObserver(() => fit());

        if (doc?.body) ro.observe(doc.body);
        if (doc?.documentElement) ro.observe(doc.documentElement);
        iframe.__ro = ro;
      } catch (e) {
        console.error(e);
      }
    };

    iframe.addEventListener('load', handleLoad);

    // eslint-disable-next-line consistent-return
    return () => {
      iframe.removeEventListener('load', handleLoad);
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
  }, [autoSize, maxHeight, initialStartHeight]);

  const sandboxValue = inPreview
    ? 'allow-popups allow-popups-to-escape-sandbox allow-same-origin'
    : 'allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin';

  return (
    <iframe
      ref={iframeRef}
      srcDoc={processedHtml}
      sandbox={sandboxValue}
      referrerPolicy="no-referrer"
      className={className}
      scrolling={autoSize ? 'no' : 'auto'}
      style={{
        display: 'block',
        width: '100%',
        height: autoSize ? `${initialStartHeight}px` : `${maxHeight}px`,
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
  inPreview: PropTypes.bool,
  maxHeight: PropTypes.number,
};

export default HtmlSandbox;
