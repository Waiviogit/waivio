import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import sanitizeHtml from 'sanitize-html';
import { getTitleForLink, getObjectName, getObjectAvatar } from '../common/helpers/wObjectHelper';

const HtmlSandbox = ({ wobject, html, className, autoSize, maxHeight, padding }) => {
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

  // 2) Один fenced-блок ```lang ... ``` або ~~~lang ... ~~~ → знімаємо паркани
  const stripMdFencesLoose = (input = '') => {
    const s = String(input)
      .trim()
      .replace(/^\uFEFF/, '');
    const m = s.match(/^(```|~~~)\s*([a-z0-9_+.-]*)\s*\r?\n([\s\S]*?)\r?\n\1\s*$/i);

    return m ? m[3] : input;
  };

  // 3) Декодуємо &lt;div&gt;… якщо виглядає як екранований HTML і немає реальних тегів
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

  // 4) Мінімальна санітизація CSS (без eval/expression/js: URL і подібного)
  const sanitizeCss = (css = '') =>
    css
      .replace(/expression\s*\(/gi, '')
      .replace(/behavior\s*:/gi, '')
      .replace(/-moz-binding\s*:/gi, '')
      .replace(/url\(\s*(['"])?\s*javascript:.*?\)/gi, 'url(about:blank)')
      .replace(/@charset\s+["'][^"']*["'];?/gi, '')
      .replace(/@namespace[\s\S]*?;?/gi, '');

  // ---------- sanitize-html config ----------
  const sanitizeConfig = useMemo(
    () => ({
      allowedTags: [
        'html',
        /* 'head', */ 'body',
        'style',
        'link',
        'div',
        'section',
        'article',
        'header',
        'footer',
        'main',
        'aside',
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
        'div',
        'section',
        'article',
        'header',
        'footer',
        'main',
        'aside',
        'nav',
      ],
      disallowedTagsMode: 'discard',
      // Повністю прибираємо елемент І ЙОГО ВМІСТ для head-метаданих і скриптів
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
          attribs: {
            ...attribs,
            rel: 'noopener nofollow ugc',
            target: '_blank',
          },
        }),
        link: (tagName, attribs) => {
          const rel = (attribs.rel || '').toLowerCase();

          if (rel === 'stylesheet' && attribs.href) return { tagName: 'link', attribs };

          // Усi інші <link> глушимо
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

  // ---------- Build srcDoc ----------
  const processedHtml = useMemo(() => {
    // 0) Попередня нормалізація вхідного рядка
    let raw = stripPreCodeWrapper(html || '');

    raw = stripMdFencesLoose(raw);
    raw = maybeDecodeEntities(raw);
    raw = raw
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '') // приберe і тег, і текст усередині
      .replace(/<meta[^>]*>/gi, '') // прибираємо мета
      .replace(/<base[^>]*>/gi, '') // і <base>
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''); // скрипти + вміст
    let cleanHtml = sanitizeHtml(raw, sanitizeConfig);

    cleanHtml = cleanHtml.replace(/style\s*=\s*(['"])([\s\S]*?)\1/gi, (m, q, css) => {
      const safe = sanitizeCss(css);

      return `style=${q}${safe}${q}`;
    });

    // 3) Витягнемо <style> та дозволені <link rel="stylesheet"> у <head>
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const linkRegex = /<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi;

    const styles = [];
    const links = [];
    let bodyHtml = cleanHtml;

    let styleMatch;

    // eslint-disable-next-line no-cond-assign
    while ((styleMatch = styleRegex.exec(cleanHtml)) !== null) {
      styles.push(sanitizeCss(styleMatch[1] || ''));
      bodyHtml = bodyHtml.replace(styleMatch[0], '');
    }

    let linkMatch;

    // eslint-disable-next-line no-cond-assign
    while ((linkMatch = linkRegex.exec(cleanHtml)) !== null) {
      links.push(linkMatch[0]);
      bodyHtml = bodyHtml.replace(linkMatch[0], '');
    }

    // 4) Додаткове прибирання head-штук у body (навіть якщо прослизнули)
    bodyHtml = bodyHtml
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<base[^>]*>/gi, '')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<\/?(html|body)\b[^>]*>/gi, '');

    // 5) Залишків скриптів не має бути, але на всяк випадок прибираємо й тут
    bodyHtml = bodyHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

    // 6) Формуємо <head> та базові стилі
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
        :root { color-scheme: light dark; }
        html, body {
          margin: 0;
          padding: ${padding}px;
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
      </style>
      ${links.join('\n')}
      ${styles.map(cssText => `<style>${cssText}</style>`).join('\n')}
    `;

    // 7) Повертаємо повний документ для srcDoc
    return `<!doctype html>
<html>
<head>
${headContent}
</head>
<body>
${bodyHtml}
</body>
</html>`;
  }, [html, sanitizeConfig, padding, autoSize]);

  // ---------- Autosize ----------
  const fit = () => {
    if (!autoSize || !iframeRef.current) return;
    try {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (!doc) return;
      const height = doc.body?.scrollHeight;

      if (height > 0) iframe.style.height = `${height}px`;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    const handleLoad = () => {
      setInteractive(false);
      fit();
      setTimeout(fit, 50);
      setTimeout(() => {
        fit();
        setInteractive(true);
      }, 250);
      setTimeout(() => {
        fit();
        setInteractive(true);
      }, 1000);
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;

        doc?.fonts?.ready?.then?.(() =>
          setTimeout(() => {
            fit();
            setInteractive(true);
          }, 0),
        );
      } catch (e) {
        console.error(e);
      }
    };

    iframe.addEventListener('load', handleLoad);

    // eslint-disable-next-line consistent-return
    return () => iframe.removeEventListener('load', handleLoad);
  }, [autoSize]);

  const sandboxValue = `allow-popups allow-popups-to-escape-sandbox${
    autoSize ? ' allow-same-origin' : ''
  }`;
  const titleText = getTitleForLink(wobject);
  const image = getObjectAvatar(wobject);

  return (
    <React.Fragment>
      <Helmet>
        <title>{titleText}</title>
        <meta name="description" content={wobject?.description} />
        <meta property="og:title" content={titleText} />
        <meta property="og:type" content="article" />
        {/* <link rel="canonical" href={url} /> */}
        {/* <meta property="og:url" content={url} /> */}
        <meta property="og:image" content={image} />
        <meta property="og:image:url" content={image} />
        {/* <meta property="og:image:width" content="600" /> */}
        {/* <meta property="og:image:height" content="600" /> */}
        {/* <meta property="og:description" content={desc} /> */}
        <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
        {/* <meta name="twitter:site" content={`@${siteName}`} /> */}
        <meta name="twitter:title" content={titleText} />
        <meta name="twitter:description" content={wobject?.description} />
        <meta name="twitter:image" property="twitter:image" content={image} />
        <meta property="og:site_name" content={getObjectName(wobject)} />
        {/* <link rel="image_src" href={image} /> */}
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
          display: 'block', // прибирає нижній baseline-gap як у <img>
          width: '100%',
          height: autoSize ? '400px' : `${maxHeight}px`,
          border: 'none',
          verticalAlign: 'top',
          pointerEvents: interactive ? 'auto' : 'none', // щоб колесо прокрутки не «липло» до фрейму під час автофіту
        }}
        title="HTML Sandbox"
      />
    </React.Fragment>
  );
};

HtmlSandbox.defaultProps = {
  autoSize: true,
  maxHeight: 100000,
  padding: 16,
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
