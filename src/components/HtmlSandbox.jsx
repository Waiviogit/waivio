import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

const HtmlSandbox = ({
  html,
  className,
  autoSize = true,
  maxHeight = 2400,
  padding = 16,
}) => {
  const iframeRef = useRef(null);

  const sanitizeCss = (css) => {
    return css
      .replace(/expression\s*\(/gi, '')
      .replace(/behavior\s*:/gi, '')
      .replace(/-moz-binding\s*:/gi, '')
      .replace(/url\(\s*(['"])?\s*javascript:.*?\)/gi, 'url(about:blank)')
      .replace(/@charset\s+["'][^"']*["'];?/gi, '')
      .replace(/@namespace[\s\S]*?;?/gi, '');
  };

  const sanitizeConfig = useMemo(() => ({
    allowedTags: [
      'html', 'head', 'body', 'style', 'link', 'div', 'section', 'article',
      'header', 'footer', 'main', 'aside', 'p', 'span', 'strong', 'em', 'u',
      's', 'small', 'mark', 'abbr', 'time', 'br', 'hr', 'h1', 'h2', 'h3',
      'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'kbd', 'samp', 'ul',
      'ol', 'li', 'dl', 'dt', 'dd', 'img', 'picture', 'source', 'figure',
      'figcaption', 'video', 'audio', 'track', 'table', 'thead', 'tbody',
      'tfoot', 'tr', 'th', 'td', 'col', 'colgroup', 'a', 'svg', 'path'
    ],
    disallowedTagsMode: 'discard',
    allowedAttributes: {
      '*': ['class', 'id', 'title', 'role', 'data-*', 'aria-*', 'style'],
      'a': ['href', 'name', 'target', 'rel', 'title', 'download'],
      'img': ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding', 'referrerpolicy'],
      'source': ['src', 'srcset', 'type', 'media', 'sizes'],
      'video': ['src', 'controls', 'autoplay', 'loop', 'muted', 'playsinline', 'poster', 'width', 'height'],
      'audio': ['src', 'controls', 'autoplay', 'loop', 'muted', 'preload'],
      'table': ['border', 'cellpadding', 'cellspacing', 'width', 'align'],
      'link': ['rel', 'href', 'media', 'as', 'type', 'crossorigin', 'referrerpolicy', 'integrity', 'disabled', 'title'],
      'svg': ['width', 'height', 'viewBox', 'aria-hidden', 'aria-label'],
      'path': ['fill', 'd']
    },
    allowedSchemesByTag: {
      'a': ['http', 'https', 'mailto', 'tel'],
      'img': ['http', 'https', 'data', 'blob'],
      'video': ['http', 'https'],
      'audio': ['http', 'https'],
      'source': ['http', 'https', 'data', 'blob'],
      'link': ['http', 'https']
    },
    allowProtocolRelative: false,
    transformTags: {
      'a': (tagName, attribs) => ({
        tagName: 'a',
        attribs: {
          ...attribs,
          rel: 'noopener nofollow ugc',
          target: '_blank'
        }
      }),
      'link': (tagName, attribs) => {
        if (attribs.rel === 'stylesheet' && attribs.href) {
          return { tagName: 'link', attribs };
        }
        return { tagName: 'noscript', attribs: {} };
      },
      'style': (tagName, attribs) => ({ tagName: 'style', attribs })
    }
  }), []);

  const processedHtml = useMemo(() => {
    const cleanHtml = sanitizeHtml(html, sanitizeConfig);
    
    // Extract styles and links
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*>/gi;
    
    const styles = [];
    const links = [];
    let bodyHtml = cleanHtml;
    
    // Extract styles
    let styleMatch;
    while ((styleMatch = styleRegex.exec(cleanHtml)) !== null) {
      styles.push({
        full: styleMatch[0],
        content: sanitizeCss(styleMatch[1])
      });
      bodyHtml = bodyHtml.replace(styleMatch[0], '');
    }
    
    // Extract links
    let linkMatch;
    while ((linkMatch = linkRegex.exec(cleanHtml)) !== null) {
      links.push(linkMatch[0]);
      bodyHtml = bodyHtml.replace(linkMatch[0], '');
    }
    
    // Build head content
    const headContent = `
      <meta charset="utf-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src * data: blob:; media-src *; font-src *; style-src * 'unsafe-inline'; connect-src *; frame-ancestors 'none'; form-action 'none'; script-src 'none';">
      <style>
        :root { color-scheme: light dark; }
        html, body { margin:0; padding:${padding}px; box-sizing:border-box; }
        *, *::before, *::after { box-sizing: inherit; }
        img, video, svg, canvas, iframe { max-width:100%; height:auto; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #e5e7eb; padding: 6px; vertical-align: top; }
        pre, code { white-space: pre-wrap; word-break: break-word; }
      </style>
      ${links.join('\n')}
      ${styles.map(style => `<style>${style.content}</style>`).join('\n')}
    `;
    
    return `<!doctype html>
<html>
<head>
${headContent}
</head>
<body>
${bodyHtml}
</body>
</html>`;
  }, [html, sanitizeConfig, sanitizeCss, padding]);

  const fit = () => {
    if (!autoSize || !iframeRef.current) return;
    
    try {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      
      const height = Math.min(doc.body?.scrollHeight || 0, maxHeight);
      if (height > 0) {
        iframe.style.height = `${height}px`;
      }
    } catch (error) {
      // Ignore cross-origin errors when allow-same-origin is not set
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      fit();
      // Additional fits to account for font/style loading
      setTimeout(fit, 50);
      setTimeout(fit, 250);
      setTimeout(fit, 1000);
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [autoSize, maxHeight]);

  const sandboxValue = autoSize 
    ? 'allow-same-origin' 
    : '';

  return (
    <iframe
      ref={iframeRef}
      srcDoc={processedHtml}
      sandbox={sandboxValue}
      className={className}
      style={{
        width: '100%',
        height: autoSize ? '400px' : `${maxHeight}px`,
        border: 'none',
        overflow: 'hidden'
      }}
      title="HTML Sandbox"
    />
  );
};

HtmlSandbox.defaultProps = {
  autoSize: true,
  maxHeight: 2400,
  padding: 16
};

HtmlSandbox.propTypes = {
  html: PropTypes.string.isRequired,
  className: PropTypes.string,
  autoSize: PropTypes.bool,
  maxHeight: PropTypes.number,
  padding: PropTypes.number
};

export default HtmlSandbox;

/**
 * Приклад:
 * <HtmlSandbox html={gptHtml} autoSize maxHeight={2000} padding={16} />
 */
