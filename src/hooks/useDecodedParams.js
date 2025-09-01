import { useParams } from 'react-router-dom';
import { decodeUsername } from '../common/helpers/urlHelpers';

/**
 * Hook that automatically decodes route parameters
 * Handles %40 (@ symbol) encoding from external sources like ChatGPT
 * @returns {Object} - Decoded route parameters
 */
const useDecodedParams = () => {
  const params = useParams();

  const decodedParams = {};

  Object.keys(params).forEach(key => {
    const value = params[key];

    // Special handling for username-related parameters
    if (key === 'name' || key === 'author' || key === 'userName' || key === 'referral') {
      decodedParams[key] = decodeUsername(value);
    } else {
      decodedParams[key] = value;
    }
  });

  return decodedParams;
};

export default useDecodedParams;
