export const quickMessages = [
  { text: 'Proofread', label: 'Proofread' },
  { text: 'Translate to English', label: 'Translate' },
  { text: 'About Waivio', label: 'About Waivio' },
];
export const parseChatBotLinks = text => {
  const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

  return text.replace(
    urlPattern,
    url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
  );
};
export default null;
