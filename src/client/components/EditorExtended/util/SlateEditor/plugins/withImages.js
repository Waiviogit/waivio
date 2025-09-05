const withImages = editor => {
  const { isVoid } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.isVoid = element => {
    if (element.type === 'image') return true;

    return isVoid(element);
  };

  return editor;
};

export default withImages;
