import Cookie from 'js-cookie';
import { parseJSON } from '../../../common/helpers/parseJSON';
import HAS, { makeHiveAuthHeader } from '../../HiveAuth/hive-auth-wrapper';
import { hasKeychain, keychainSignBuffer, keychainBroadcast } from './keychain';

/**
 * Unified Hive Signer Service
 * Automatically chooses between Hive Keychain extension and HiveAuth QR flow
 * based on availability
 */

/**
 * Get login challenge from backend
 * @param {string} username - Hive username
 * @returns {Promise<string>} Challenge string
 */
const getLoginChallenge = async username => {
  const challenge = JSON.stringify({
    login: username,
    ts: Date.now(),
  });

  return challenge;
};

/**
 * Verify login signature with backend
 * For now, this is a placeholder - backend should verify the signature
 * @param {string} username - Hive username
 * @param {string} challenge - Challenge string
 * @param {string} signature - Signature from Keychain
 * @returns {Promise<Object>} Auth data
 */
const verifyLoginSignature = async (username, challenge, signature) => {
  // Placeholder - backend should verify signature
  // For now, we'll create auth data similar to HiveAuth format
  const auth = {
    username,
    expire: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    key: signature, // Store signature as key for compatibility
  };

  Cookie.set('auth', auth);
  makeHiveAuthHeader(auth);

  return auth;
};

/**
 * Login using Keychain or HiveAuth
 * For Keychain: triggers extension popup (not a new browser window)
 * For HiveAuth: this throws error - component should handle QR flow
 * @param {Object} options - Login options
 * @param {string} options.username - Hive username (required for Keychain)
 * @returns {Promise<Object>} Auth data
 */
export const login = async ({ username }) => {
  if (hasKeychain()) {
    if (!username) {
      throw new Error('Username is required for Keychain login');
    }

    const challenge = await getLoginChallenge(username);
    // This triggers extension popup - no window.open or redirect
    const signResponse = await keychainSignBuffer(username, challenge, 'Posting');

    if (!signResponse.success || !signResponse.result) {
      throw new Error(signResponse.message || 'Signing failed');
    }

    const auth = await verifyLoginSignature(username, challenge, signResponse.result);

    return auth;
  }

  // Fallback to HiveAuth - this will be handled by the component
  throw new Error('Keychain not available - use HiveAuth QR flow');
};

/**
 * Broadcast operations using Keychain or HiveAuth
 * For Keychain: triggers extension popup (not a new browser window)
 * For HiveAuth: uses QR code flow
 * @param {Object} options - Broadcast options
 * @param {string} options.username - Hive username
 * @param {Array} options.operations - Operations to broadcast
 * @param {string} options.keyType - Key type (Posting, Active). Default: 'Active'
 * @returns {Promise<Object>} Broadcast result
 */
export const broadcast = async ({ username, operations, keyType = 'Active' }) => {
  if (hasKeychain()) {
    // Use Keychain extension API - triggers extension popup, no window.open or redirect
    const response = await keychainBroadcast(username, operations, keyType);

    return {
      result: {
        id: response.result?.id || response.result,
      },
    };
  }

  // Fallback to HiveAuth QR flow (only if Keychain is not available)
  const auth = parseJSON(Cookie.get('auth'));

  if (!auth) {
    throw new Error('Not authenticated');
  }

  const res = await HAS.broadcast(auth, keyType, operations);

  return {
    result: {
      id: res.data,
    },
  };
};

/**
 * Sign a message using Keychain or HiveAuth
 * @param {Object} options - Sign options
 * @param {string} options.username - Hive username
 * @param {string} options.message - Message to sign
 * @param {string} options.keyType - Key type (Posting, Active, Memo). Default: 'Posting'
 * @returns {Promise<string>} Signature
 */
export const signMessage = async ({ username, message, keyType = 'Posting' }) => {
  if (hasKeychain()) {
    const response = await keychainSignBuffer(username, message, keyType);

    return response.result;
  }

  // Fallback to HiveAuth
  const auth = parseJSON(Cookie.get('auth'));

  if (!auth) {
    throw new Error('Not authenticated');
  }

  const challengeData = {
    key_type: keyType.toLowerCase(),
    challenge: message,
  };

  const res = await HAS.challenge(auth, challengeData);

  return res.data?.signature || res.data;
};

/**
 * Logout - clears auth cookies
 */
export const logout = () => {
  Cookie.remove('auth');
  Cookie.remove('access_token');
  Cookie.remove('currentUser');
};
