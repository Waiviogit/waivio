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
    text: `Summarize this post`,
    label: `Summarize this post`,
  },
  { text: 'Translate this post', label: 'Translate this post' },
  { text: 'Suggest a comment for this post', label: 'Suggest a comment for this post' },
  {
    text: 'Highlight the places mentioned in this post',
    label: 'Highlight the places mentioned in this post',
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
