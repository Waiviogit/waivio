import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

const HtmlSandbox = ({ html, className, autoSize = true, maxHeight }) => {
  const iframeRef = useRef(null);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const handleMessage = event => {
      if (!iframeRef.current) return;

      if (event.source !== iframeRef.current.contentWindow) return;

      const data = event.data;

      if (!data || typeof data !== 'object') return;

      if (data.__hs !== true) return;

      const forwardToParentGA = payload => {
        if (typeof window.gtag !== 'function') {
          return;
        }

        try {
          // eslint-disable-next-line prefer-spread
          if (typeof window !== 'undefined') window.gtag.apply(window, payload);
        } catch (e) {
          console.error('[Bridge] Failed to forward GA payload', e, payload);
        }
      };

      if (data.type === 'GA_EVENT' && Array.isArray(data.payload)) {
        forwardToParentGA(data.payload);

        return;
      }

      if (data.type === 'UI_INTERACTION') {
        if (typeof window.gtag !== 'function') {
          return;
        }

        const eventName = 'iframe_ui_interaction';

        const params = {
          source: 'html_sandbox',
          element_tag: data.element?.tag || null,
          element_id: data.element?.id || null,
          element_name: data.element?.name || null,
          element_text: data.element?.text || null,
          debug_mode: true,
        };

        window.gtag('event', eventName, params);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
        'iframe',
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
        'form',
        'label',
        'input',
        'textarea',
        'select',
        'option',
        'fieldset',
        'legend',
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
        form: ['action', 'method', 'target', 'autocomplete', 'name'],
        label: ['for'],
        input: [
          'type',
          'name',
          'value',
          'placeholder',
          'checked',
          'disabled',
          'readonly',
          'required',
          'min',
          'max',
          'step',
          'maxlength',
          'minlength',
          'pattern',
          'autocomplete',
          'id',
          'class',
          'style',
          'aria-*',
          'data-*',
        ],
        textarea: [
          'name',
          'rows',
          'cols',
          'placeholder',
          'disabled',
          'readonly',
          'required',
          'maxlength',
          'minlength',
          'id',
          'class',
          'style',
          'aria-*',
          'data-*',
        ],
        select: [
          'name',
          'multiple',
          'size',
          'disabled',
          'required',
          'id',
          'class',
          'style',
          'aria-*',
          'data-*',
        ],
        option: ['value', 'selected', 'disabled', 'label'],
        fieldset: ['disabled', 'name'],
        legend: [],
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
          attribs: {
            ...attribs,
            rel: 'noopener nofollow ugc',
            target: attribs.target === '_self' ? '_top' : attribs.target || '_blank',
          },
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

          if (!src) return { tagName: 'script', attribs };
          const isGoogleAllowed =
            /^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+/i.test(src) ||
            /^https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-[A-Z0-9]+/i.test(src);

          if (!isGoogleAllowed) return { tagName: 'noscript', attribs: {} };

          return { tagName: 'script', attribs: { ...attribs, async: 'async' } };
        },
      },
    };

    return cfg;
  }, []);

  const hasVh = useMemo(() => /\b(\d+(?:\.\d+)?)\s*(?:[sld])?vh\b/gi.test(html || ''), [html]);
  const effectiveAutoSize = useMemo(() => autoSize && !hasVh, [autoSize, hasVh]);

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
      .replace(/<\/?(html|body)\b[^>]*>/gi, '');

    const bridgeScript = `
(function () {
  function send(data) {
    try {
      window.parent.postMessage(Object.assign({ __hs: true }, data), '*');
    } catch (e) {}
  }

  window.__hsGtag = function () {
    send({ type: 'GA_EVENT', payload: Array.prototype.slice.call(arguments) });
  };

  window.addEventListener('click', function (e) {
    var el = e.target && e.target.closest
      ? e.target.closest('button, a, input, select, textarea')
      : null;

    if (!el) return;

    var text =
      (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')
        ? (el.value || '')
        : (el.innerText || el.textContent || '');

    send({
      type: 'UI_INTERACTION',
      element: {
        tag: el.tagName,
        id: el.id || null,
        name: el.getAttribute('name') || null,
        text: String(text).trim().slice(0, 60),
      },
    });
  }, true);
})();
`.trim();

    const headContent = `
      <meta charset="utf-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: blob: https:; img-src * data: blob:; style-src * 'unsafe-inline'; script-src 'unsafe-inline' https: data:;">
      <script>${bridgeScript}</script>
      <style>
        :root { --hs-vh: 1vh; }
        html, body { margin: 0; box-sizing: border-box; }
        html { ${effectiveAutoSize ? 'overflow-y:hidden;' : 'overflow-y:auto;'} overflow-x:hidden; }
        img, video, svg, canvas, iframe { max-width: 100%; height: auto; }
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

  const initialStartHeight = useMemo(() => {
    const vp = typeof window !== 'undefined' ? window.innerHeight : 0;

    if (effectiveAutoSize) {
      const clamped = Math.max(300, Math.min(vp || 0, 900));

      return maxHeight ? Math.min(maxHeight, clamped) : clamped;
    }
    const clamped = Math.max(600, Math.min(vp || 0, 1000)) || 800;

    return maxHeight ? Math.min(maxHeight, clamped) : clamped;
  }, [effectiveAutoSize, maxHeight]);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;
    const handleLoad = () => {
      iframe.style.height = `${initialStartHeight}px`;
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

  return (
    <iframe
      ref={iframeRef}
      srcDoc={processedHtml}
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin allow-top-navigation-by-user-activation"
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
