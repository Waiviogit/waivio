/**
 * URL helpers for Waivio
 * Handles URL encoding/decoding issues, especially for @ symbols
 */

/**
 * Decodes URL parameters, specifically handling %40 (@ symbol) encoding
 * @param {string} param - The URL parameter to decode
 * @returns {string} - The decoded parameter
 */
export const decodeUrlParam = param => {
  if (!param) return param;

  try {
    // First decode any URL encoding
    let decoded = decodeURIComponent(param);

    // Handle the specific case where @ was encoded as %40
    if (decoded.startsWith('%40')) {
      decoded = `@${decoded.substring(3)}`;
    }

    return decoded;
  } catch (error) {
    console.warn('Error decoding URL parameter:', error);

    return param;
  }
};

/**
 * Decodes username from URL parameter, ensuring @ symbol is preserved
 * @param {string} username - The username parameter from URL
 * @returns {string} - The properly formatted username
 */
export const decodeUsername = username => {
  if (!username) return username;

  // If it's already properly formatted with @, return as is
  if (username.startsWith('@')) {
    return username;
  }

  // If it starts with %40, decode it
  if (username.startsWith('%40')) {
    return `@${username.substring(3)}`;
  }

  // If it's a plain username without @, add @
  if (!username.includes('@') && !username.includes('%')) {
    return `@${username}`;
  }

  // Otherwise, try to decode normally
  return decodeUrlParam(username);
};

/**
 * Ensures a username is properly formatted with @ symbol
 * @param {string} username - The username to format
 * @returns {string} - The properly formatted username
 */
export const ensureUsernameFormat = username => {
  if (!username) return username;

  // Remove any existing @ symbol
  const cleanUsername = username.replace(/^@+/, '');

  // Add @ symbol
  return `@${cleanUsername}`;
};

/**
 * Creates a proper user profile URL
 * @param {string} username - The username
 * @returns {string} - The proper user profile URL
 */
export const createUserProfileUrl = username => {
  if (!username) return '/';

  const decodedUsername = decodeUsername(username);

  return decodedUsername.startsWith('@') ? decodedUsername : `@${decodedUsername}`;
};

/**
 * Handles URL parameters that might be encoded by external sources (like ChatGPT)
 * @param {Object} params - The route parameters object
 * @returns {Object} - The decoded parameters object
 */
export const decodeRouteParams = params => {
  const decoded = {};

  Object.keys(params).forEach(key => {
    const value = params[key];

    // Special handling for username-related parameters
    if (key === 'name' || key === 'author' || key === 'userName') {
      decoded[key] = decodeUsername(value);
    } else {
      decoded[key] = decodeUrlParam(value);
    }
  });

  return decoded;
};
