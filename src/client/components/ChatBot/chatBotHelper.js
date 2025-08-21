import { isEmpty, isNil } from 'lodash';

export const quickMessages = (siteName, currHost, name) => {
  const host = !isNil(name) && !isEmpty(name) ? ` (${currHost})` : '';

  return [
    {
      text: `Question about ${siteName === 'Waivio' ? siteName : `${siteName}${host}`}:`,
      label: `About ${siteName === 'Waivio' ? siteName : ''}`,
    },
    { text: 'Proofread the following post:', label: 'Proofread' },
    { text: 'Translate to English:', label: 'Translate' },
    { text: '/imagine', label: 'Image' },
  ];
};

export default null;
