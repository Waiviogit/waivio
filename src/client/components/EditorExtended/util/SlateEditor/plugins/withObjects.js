const withObjects = editor => {
  const { isVoid, isInline } = editor;

  /* eslint-disable no-param-reassign */
  editor.isVoid = element => (element.type === 'object' ? true : isVoid(element));
  editor.isInline = element => (element.type === 'object' ? true : isInline(element));

  return editor;
};

export default withObjects;
