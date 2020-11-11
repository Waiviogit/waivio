// eslint-disable-next-line import/prefer-default-export
export const handlePastedLink = query => new RegExp(`[^,]*${query}[^,]*`, 'ig');
