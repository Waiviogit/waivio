/**
 * Middleware to automatically decode URL parameters
 * Handles %40 (@ symbol) encoding from external sources like ChatGPT
 */

/**
 * Decodes URL parameters, specifically handling %40 (@ symbol) encoding
 * @param {string} param - The URL parameter to decode
 * @returns {string} - The decoded parameter
 */
const decodeUrlParam = param => {
  if (!param) return param;

  try {
    // First decode any URL encoding
    let decoded = decodeURIComponent(param);

    // Handle the specific case where @ was encoded as %40
    if (decoded?.startsWith('%40')) {
      decoded = '@' + decoded?.substring(3);
    }

    return decoded;
  } catch (error) {
    console.warn('Error decoding URL parameter:', error);
    return param;
  }
};

/**
 * Middleware to decode URL parameters
 */
export const urlDecodeMiddleware = (req, res, next) => {
  try {
    // Log original URL for debugging
    if (req.url?.includes('%40')) {
      console.log('URL Decode Middleware: Processing encoded URL:', req.url);

      // Log query parameters if they exist
      if (req.url?.includes('?')) {
        const queryPart = req.url?.substring(req.url?.indexOf('?'));
        console.log('URL Decode Middleware: Query parameters detected:', queryPart);
      }
    }

    // Decode params if they exist
    if (req.params) {
      Object.keys(req.params).forEach(key => {
        const value = req.params[key];

        // Special handling for username-related parameters
        if (key === 'name' || key === 'author' || key === 'userName' || key === 'referral') {
          const decodedValue = decodeUrlParam(value);
          if (decodedValue !== value) {
            console.log(
              `URL Decode Middleware: Decoded ${key} from "${value}" to "${decodedValue}"`,
            );
          }
          req.params[key] = decodedValue;
        } else {
          req.params[key] = decodeUrlParam(value);
        }
      });
    }

    // Decode query parameters if they exist
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        const value = req.query[key];
        if (typeof value === 'string') {
          req.query[key] = decodeUrlParam(value);
        }
      });
    }

    next();
  } catch (error) {
    console.warn('Error in URL decode middleware:', error);
    next();
  }
};

export default urlDecodeMiddleware;
