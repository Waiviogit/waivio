import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import Editor from '@react-page/editor';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@react-page/editor/lib/index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import slate from '@react-page/plugins-slate';
// eslint-disable-next-line import/no-extraneous-dependencies
import image from '@react-page/plugins-image';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@react-page/plugins-slate/lib/index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@react-page/plugins-image/lib/index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import background from '@react-page/plugins-background';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@react-page/plugins-background/lib/index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import spacer from '@react-page/plugins-spacer';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@react-page/plugins-spacer/lib/index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import divider from '@react-page/plugins-divider';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@react-page/plugins-divider/lib/index.css';
import { colorPickerPlugin } from './colorPickerPlugin';
import { getIsEditMode } from '../../../store/wObjectStore/wObjectSelectors';
import './ObjectOfTypeWebpage.less';

const customSlate = slate(config => ({
  ...config,
  plugins: {
    ...config.plugins,
    color: {
      colorPicker: colorPickerPlugin,
    },
  },
}));

const plugins = [customSlate, image, background(), spacer, divider];

const ObjectOfTypeWebpage = () => {
  const [currentValue, setCurrentValue] = useState(null);
  const str =
    '{"id":"a2pzgm","version":1,"rows":[{"id":"40idtl","cells":[{"id":"k15jxl","size":12,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"https://img.freepik.com/free-photo/purple-osteospermum-daisy-flower_1373-16.jpg?w=2000"}},"rows":[],"inline":null}]},{"id":"5co6fg","cells":[{"id":"04ryr2","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"type":"PARAGRAPH/PARAGRAPH","children":[{"text":"lalalallalala"}]}]}},"rows":[],"inline":null}]},{"id":"mlaefp","cells":[{"id":"ecm6hu","size":12,"plugin":{"id":"ory/editor/core/layout/background","version":1},"dataI18n":{"default":{"modeFlag":3}},"rows":[],"inline":null}]}]}';
  const isEditMode = useSelector(getIsEditMode);
  const jsonVal = currentValue ? JSON.stringify(currentValue) : null;

  // eslint-disable-next-line no-console
  console.log(jsonVal);

  return (
    <div className="ObjectOfTypeWebpage">
      <Editor
        readOnly={!isEditMode}
        cellPlugins={plugins}
        value={JSON.parse(str)}
        onChange={newValue => setCurrentValue(newValue)}
      />
    </div>
  );
};

export default ObjectOfTypeWebpage;
