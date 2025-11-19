import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getConfigurationValues } from '../store/appStore/appSelectors';
import { DEFAULT_TEMPLATE_ID, getTemplateComponents } from './loader';

const templateAliases = {
  clear: 'clean',
};

const normalizeTemplateId = id => {
  if (typeof id !== 'string') return undefined;
  const normalizedId = id.toLowerCase();

  return templateAliases[normalizedId] || normalizedId;
};
const pickTemplateId = config =>
  normalizeTemplateId(
    config?.templateId ||
      config?.template?.id ||
      config?.appearance?.templateId ||
      config?.theme?.templateId,
  );

export const useTemplateId = () => {
  const configuration = useSelector(getConfigurationValues);

  return pickTemplateId(configuration) || DEFAULT_TEMPLATE_ID;
};

const useTemplateProvider = () => {
  const templateId = useTemplateId();

  return useMemo(
    () => getTemplateComponents(templateId) || getTemplateComponents(DEFAULT_TEMPLATE_ID),
    [templateId],
  );
};

export default useTemplateProvider;
