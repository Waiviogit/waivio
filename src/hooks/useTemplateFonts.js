import { useEffect } from 'react';
import { useTemplateId } from '../designTemplates/TemplateProvider';
import { getTemplateMeta } from '../designTemplates/loader';

const useTemplateFonts = () => {
  const templateId = useTemplateId();
  const templateMeta = getTemplateMeta(templateId);

  useEffect(() => {
    if (typeof document === 'undefined' || !templateMeta?.fonts) return;

    const root = document.documentElement;
    const { fonts } = templateMeta;

    if (fonts.heading) {
      root.style.setProperty('--template-font-heading', fonts.heading);
    }
    if (fonts.body) {
      root.style.setProperty('--template-font-body', fonts.body);
    }
    if (fonts.serif) {
      root.style.setProperty('--template-font-serif', fonts.serif);
    }

    root.classList.add(`template-${templateId}`);

    // eslint-disable-next-line consistent-return
    return () => {
      root.classList.remove(`template-${templateId}`);
    };
  }, [templateId, templateMeta]);
};

export default useTemplateFonts;
