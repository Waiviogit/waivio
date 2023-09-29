import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { pluginFactories } from '@react-page/plugins-slate';
import { Icon } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ColorPickerField } from '@react-page/editor';

export const colorPickerPlugin = pluginFactories.createComponentPlugin({
  addHoverButton: true,
  addToolbarButton: true,
  type: 'SetColor',
  object: 'mark',
  icon: (
    <span className={'colorPickerPlugin-TextColor'}>
      <Icon type="font-colors" />
    </span>
  ),
  label: 'Set Color',
  Component: 'span',
  getStyle: ({ color }) => ({ color }),
  controls: {
    type: 'autoform',
    schema: {
      type: 'object',
      required: ['color'],
      properties: {
        color: {
          uniforms: {
            component: ColorPickerField,
          },
          default: 'rgba(0, 0, 0,1)',
          type: 'string',
        },
      },
    },
  },
});

export default colorPickerPlugin;
