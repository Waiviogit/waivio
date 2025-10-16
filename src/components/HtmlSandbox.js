import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import sanitizeHtml from 'sanitize-html';
import { getTitleForLink, getObjectName, getObjectAvatar } from '../common/helpers/wObjectHelper';

const HtmlSandbox = ({
  wobject,
  html,
  className,
  autoSize = true,
  maxHeight = 100000,
  padding = 16,
}) => {
  const iframeRef = useRef(null);
  const [interactive, setInteractive] = useState(false);

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

  const sanitizeConfig = useMemo(
    () => ({
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
      ],
      disallowedTagsMode: 'discard',
      exclusiveFilter: frame => {
        const t = String(frame.tag || '').toLowerCase();

        return (
          t === 'title' ||
          t === 'meta' ||
          t === 'base' ||
          t === 'script' ||
          t === 'noscript' ||
          t === 'template'
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
    }),
    [],
  );

  const processedHtml = useMemo(() => {
    let raw = stripPreCodeWrapper(html || '');

    raw = stripMdFencesLoose(raw);
    raw = maybeDecodeEntities(raw);

    raw = raw
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<base[^>]*>/gi, '')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

    let cleanHtml = sanitizeHtml(raw, sanitizeConfig);

    cleanHtml = cleanHtml.replace(/style\s*=\s*(['"])([\s\S]*?)\1/gi, (m, q, css) => {
      const safe = sanitizeCss(css);

      return `style=${q}${safe}${q}`;
    });

    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const linkRegex = /<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi;

    const styles = [];
    const links = [];
    let bodyHtml = cleanHtml;

    let m;

    // eslint-disable-next-line no-cond-assign
    while ((m = styleRegex.exec(cleanHtml)) !== null) {
      styles.push(sanitizeCss(m[1] || ''));
      bodyHtml = bodyHtml.replace(m[0], '');
    }
    // eslint-disable-next-line no-cond-assign
    while ((m = linkRegex.exec(cleanHtml)) !== null) {
      links.push(m[0]);
      bodyHtml = bodyHtml.replace(m[0], '');
    }

    bodyHtml = bodyHtml
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<base[^>]*>/gi, '')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
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
        script-src 'none';
      ">
      <style>
        :root {
          color-scheme: light dark;
          --hs-vh: 1vh; /* fallback доки не порахуємо реальний 1vh у батьківському вікні */
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

        /* safety overrides у фреймі */
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
  }, [html, sanitizeConfig, padding, autoSize]);

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
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const initialStartHeight = useMemo(() => {
    const viewport = typeof window !== 'undefined' ? window.innerHeight : 0;
    const clamped = Math.max(700, Math.min(viewport || 0, 1100)); // 700..1100

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

  const sandboxValue = `allow-popups allow-popups-to-escape-sandbox${
    autoSize ? ' allow-same-origin' : ''
  }`;
  const titleText = getTitleForLink(wobject);
  const image = getObjectAvatar(wobject);

  return (
    <>
      <Helmet>
        <title>{titleText}</title>
        <meta name="description" content={wobject?.description} />
        <meta property="og:title" content={titleText} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={image} />
        <meta property="og:image:url" content={image} />
        <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={titleText} />
        <meta name="twitter:description" content={wobject?.description} />
        <meta name="twitter:image" content={image} />
        <meta property="og:site_name" content={getObjectName(wobject)} />
        <link id="favicon" rel="icon" href={image} type="image/x-icon" />
      </Helmet>

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
    </>
  );
};

HtmlSandbox.propTypes = {
  html: PropTypes.string.isRequired,
  className: PropTypes.string,
  autoSize: PropTypes.bool,
  maxHeight: PropTypes.number,
  padding: PropTypes.number,
  wobject: PropTypes.shape({
    description: PropTypes.string,
  }),
};

export default HtmlSandbox;
