import classicTemplate from './classic';
import cleanTemplate from './clean';

export const DEFAULT_TEMPLATE_ID = classicTemplate.meta.id;

const templatesRegistry = [classicTemplate, cleanTemplate];

export const templatesMap = templatesRegistry.reduce((acc, template) => {
  acc[template.meta.id] = template;

  return acc;
}, {});

export const getTemplateComponents = id => templatesMap[id]?.components;
export const getTemplateMeta = id => templatesMap[id]?.meta;
export const getAvailableTemplates = () => templatesRegistry.map(template => template.meta);
export const getTemplateFonts = id => templatesMap[id]?.meta?.fonts;
