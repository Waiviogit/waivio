import { isEmpty, isNil } from 'lodash';

export const defaultQuickMessages = (siteName, currHost, name) => {
  const host = !isNil(name) && !isEmpty(name) ? ` (${currHost})` : '';

  return [
    {
      text: `Question about ${siteName === 'Waivio' ? siteName : `${siteName}${host}`}:`,
      label: `About ${siteName === 'Waivio' ? siteName : ''}`,
    },
    { text: 'Proofread the following post:', label: 'Proofread' },
    { text: 'Translate to English:', label: 'Translate' },
    { text: 'Create an image from the following text:', label: 'Imagine' },
  ];
};
export const postQuickMessages = () => [
  {
    text: `Summarize`,
    label: `Summarize`,
  },
  { text: 'Translate', label: 'Translate' },
  { text: 'Suggest a comment', label: 'Suggest a comment' },
  {
    text: 'Highlight the places mentioned',
    label: 'Highlight the places mentioned',
  },
];
export const editorQuickMessages = () => [
  {
    text: `Suggest ideas for a post`,
    label: `Suggest ideas for a post`,
  },
  { text: 'Suggest hashtags', label: 'Suggest hashtags' },
  { text: 'Proofread the following post:', label: 'Proofread' },
  { text: 'Translate to English:', label: 'Translate' },
];

export default null;
