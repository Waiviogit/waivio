import React from 'react';
import PropTypes from 'prop-types';
import { sizeMap, fontFamilyMap } from './utils/SlateUtilityFunctions';
import Link from './elements/link/link';
import Image from './elements/Image/image';
import Video from '../../components/blocks/video';
import ObjectLink from '../../components/entities/objectlink';

import './Editor.less';

export const Element = props => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case 'headingOne':
      return (
        <h1 className="md-block block-heading" {...attributes}>
          {children}
        </h1>
      );
    case 'headingTwo':
      return (
        <h2 className="md-block block-heading" {...attributes}>
          {children}
        </h2>
      );
    case 'headingThree':
      return (
        <h3 className="md-block block-heading" {...attributes}>
          {children}
        </h3>
      );
    case 'headingFour':
      return (
        <h4 className="md-block block-heading" {...attributes}>
          {children}
        </h4>
      );
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'alignLeft':
      return (
        <div style={{ textAlign: 'left', listStylePosition: 'inside' }} {...attributes}>
          {children}
        </div>
      );
    case 'alignCenter':
      return (
        <div style={{ textAlign: 'center', listStylePosition: 'inside' }} {...attributes}>
          {children}
        </div>
      );
    case 'alignRight':
      return (
        <div style={{ textAlign: 'right', listStylePosition: 'inside' }} {...attributes}>
          {children}
        </div>
      );
    case 'listItem':
      return <li {...attributes}>{children}</li>;
    case 'orderedList':
      return (
        <ol type="1" {...attributes}>
          {children}
        </ol>
      );
    case 'unorderedList':
      return <ul {...attributes}>{children}</ul>;
    case 'link':
      return <Link {...props} />;
    case 'table':
      return (
        <table className="editor-table">
          <tbody {...attributes}>{children}</tbody>
        </table>
      );
    case 'tableRow':
      return <tr {...attributes}>{children}</tr>;
    case 'tableCell':
      return <td {...attributes}>{children}</td>;
    case 'image':
      return <Image {...props} />;
    case 'video':
      const url = props?.element?.url || '';

      return (
        <>
          <Video url={url} />
          <span style={{ display: 'hidden' }}>{children}</span>
        </>
      );
    case 'code':
    case 'codeBlock':
      return <pre className="public-DraftStyleDefault-pre">{children}</pre>;
    case 'object':
      return <ObjectLink {...props} />;
    case 'thematicBreak':
      return (
        <div contentEditable={false}>
          <hr className="md-block-hr" />
          <span style={{ display: 'none' }}>{children}</span>
        </div>
      );
    default:
      return (
        <p style={{ margin: '10px 0 0 0' }} className="md-block md-block-paragraph" {...attributes}>
          {children}
        </p>
      );
  }
};

Element.propTypes = {
  attributes: PropTypes.shape().isRequired,
  element: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
};

export const Leaf = ({ attributes, children, leaf }) => {
  /* eslint-disable no-param-reassign */
  if (leaf.bold || leaf.strong) {
    children = <strong>{children}</strong>;
  }

  if (leaf.thematicBreak) {
    children = (
      <div contentEditable={false}>
        <hr className="md-block-hr" />
        {children}
      </div>
    );
  }

  if (leaf.code || leaf.inlineCode) {
    children = <code>{children}</code>;
  }

  if (leaf.italic || leaf.emphasis) {
    children = <em>{children}</em>;
  }
  if (leaf.strikethrough) {
    children = <span style={{ textDecoration: 'line-through' }}>{children}</span>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.superscript) {
    children = <sup>{children}</sup>;
  }
  if (leaf.subscript) {
    children = <sub>{children}</sub>;
  }
  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }
  if (leaf.bgColor) {
    children = <span style={{ backgroundColor: leaf.bgColor }}>{children}</span>;
  }
  if (leaf.fontSize) {
    const size = sizeMap[leaf.fontSize];

    children = <span style={{ fontSize: size }}>{children}</span>;
  }
  if (leaf.fontFamily) {
    const family = fontFamilyMap[leaf.fontFamily];

    children = <span style={{ fontFamily: family }}>{children}</span>;
  }

  return <span {...attributes}>{children}</span>;
};

Leaf.propTypes = {
  leaf: PropTypes.shape().isRequired,
  element: PropTypes.shape().isRequired,
  attributes: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
};
