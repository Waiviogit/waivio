/**
 * Hive Keychain Extension Wrapper
 * Provides functions to interact with Hive Keychain browser extension
 */

/**
 * Check if Hive Keychain extension is available
 * @returns {boolean} True if Keychain extension is installed
 */
export const hasKeychain = () => typeof window !== 'undefined' && !!window.hive_keychain;

/**
 * Sign a message using Hive Keychain extension
 * This triggers the extension's own approval popup (not a new browser window)
 * @param {string} username - Hive username
 * @param {string} message - Message to sign
 * @param {string} keyType - Key type (Posting, Active, Memo). Default: 'Posting'
 * @returns {Promise<{success: boolean, result: string, message?: string}>}
 */
export const keychainSignBuffer = (username, message, keyType = 'Posting') =>
  new Promise((resolve, reject) => {
    if (!hasKeychain()) {
      reject(new Error('Hive Keychain extension is not installed'));

      return;
    }

    // This API call triggers extension popup - no window.open or redirect needed
    window.hive_keychain.requestSignBuffer(
      username,
      message,
      keyType,
      response => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Signing failed'));
        }
      },
      'waivio',
    );
  });

/**
 * Broadcast operations using Hive Keychain extension
 * This triggers the extension's own approval popup (not a new browser window)
 * @param {string} username - Hive username
 * @param {Array} operations - Array of operations to broadcast
 * @param {string} keyType - Key type (Posting, Active). Default: 'Active'
 * @returns {Promise<{success: boolean, result: {id: string}, message?: string}>}
 */
export const keychainBroadcast = (username, operations, keyType = 'Active') =>
  new Promise((resolve, reject) => {
    if (!hasKeychain()) {
      reject(new Error('Hive Keychain extension is not installed'));

      return;
    }

    // This API call triggers extension popup - no window.open or redirect needed
    window.hive_keychain.requestBroadcast(
      username,
      operations,
      keyType,
      response => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Broadcast failed'));
        }
      },
      'waivio',
    );
  });
