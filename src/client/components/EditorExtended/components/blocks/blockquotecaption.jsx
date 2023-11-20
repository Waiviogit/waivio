import React from 'react';
import { EditorBlock } from 'draft-js';
import './blockquotecaption.less';

export default props => (
  <cite>
    <EditorBlock {...props} />
  </cite>
);
