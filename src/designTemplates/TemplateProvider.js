import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getConfigurationValues } from '../store/appStore/appSelectors';
import { DEFAULT_TEMPLATE_ID, getTemplateComponents } from './loader';

export const useTemplateId = () => {
  const configuration = useSelector(getConfigurationValues);

  return configuration.siteTemplate || DEFAULT_TEMPLATE_ID;
};

const useTemplateProvider = () => {
  const templateId = useTemplateId();

  return useMemo(
    () => getTemplateComponents(templateId) || getTemplateComponents(DEFAULT_TEMPLATE_ID),
    [templateId],
  );
};

export default useTemplateProvider;
