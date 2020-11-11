export const QUERY_APP = '(localhost:3000|waivio.com|waiviodev.com)';
export const handlePastedLink = query => new RegExp(`[^,]*${query}[^,]*`, 'ig');
