const withLinks = editor => {
  const { isInline } = editor;

  /* eslint-disable no-param-reassign */
  editor.isInline = element => (element.type === 'link' ? true : isInline(element));

  return editor;
};

export default withLinks;
