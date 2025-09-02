import React, { useEffect, useRef, useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Editor, Range, Transforms } from 'slate';
import { Button, Input, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import useTable from '../utils/useTable';
import defaultToolbarGroups from './toolbarGroups';
import CodeButton from './codebutton';
import { wrapLink } from '../utils/link';
import BlockToolbar from './blocktoolbar';
import InlineToolbar from './inlinetoolbar';
import TableToolbar from './tabletoolbar';
import { getSelection, getSelectionRect } from '../../index';
import { isIOS } from '../../../../../../common/helpers';

const TOTAL_PAGE = 3;

const Toolbar = props => {
  const { intl, editorNode } = props;
  const verticalPos = isIOS() ? 75 : 0;
  const editor = useSlate();
  const isTable = useTable(editor);
  const [toolbarGroups] = useState(defaultToolbarGroups);
  const [isShowLinkInput, setShowLinkInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setOpen] = useState(false);
  const refToolbar = useRef(null);
  const lastSelectionRef = useRef(null);
  const { selection } = editor;

  useEffect(() => {
    if (isShowLinkInput) {
      setShowLinkInput(false);

      return setOpen(false);
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Editor.string(editor, selection) === '' ||
      Range.isCollapsed(selection)
    ) {
      setShowLinkInput(false);
      refToolbar.current?.removeAttribute('style');

      return setOpen(false);
    }

    return setOpen(true);
  }, [editor, selection]);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof window !== 'undefined') {
      const nativeSelection = getSelection(window);
      const selectionBoundary = getSelectionRect(nativeSelection);

      if (!refToolbar.current || !editorNode) return;

      const toolbarNode = refToolbar.current;

      const parentBoundary = editorNode.getBoundingClientRect();
      const toolbarBoundary = toolbarNode.getBoundingClientRect();

      toolbarNode.style.top = `${selectionBoundary.bottom -
        verticalPos -
        parentBoundary.top -
        5}px`;

      const selectionCenter =
        selectionBoundary.left - parentBoundary.left + selectionBoundary.width / 2; //
      let left = selectionCenter - toolbarBoundary.width / 2;
      const screenLeft = parentBoundary.left;

      if (screenLeft < 20) {
        left = -parentBoundary.left;
      }
      toolbarNode.style.left = `${left}px`;
    }
  }, [isOpen]);

  const handleLinkInput = e => {
    setUrlInputValue(e.target.value);
  };

  const setLink = e => {
    e.preventDefault();

    if (!editor.selection && lastSelectionRef.current) {
      Transforms.select(editor, lastSelectionRef.current);
    }
    wrapLink(editor, urlInputValue);
    setShowLinkInput(false);
    setUrlInputValue('');

    ReactEditor.focus(editor);
  };

  const handleClickPrevPage = e => {
    e.preventDefault();
    setCurrentPage(prev => prev - 1);
  };
  const handleClickNextPage = e => {
    e.preventDefault();

    setCurrentPage(prev => prev + 1);
  };

  if (isShowLinkInput) {
    const isEmptyUrlInput = isEmpty(urlInputValue);
    let className = `md-editor-toolbar${isOpen ? ' md-editor-toolbar--isopen' : ''}`;

    className += ' md-editor-toolbar--linkinput';

    return (
      <div
        className={className}
        style={{
          top: `${refToolbar.current?.style.top}`,
          left: `${refToolbar.current?.style.left}`,
        }}
      >
        <div
          className="md-RichEditor-controls md-RichEditor-show-link-input"
          style={{ display: 'flex' }}
        >
          <Input
            className="md-url-input"
            onKeyDown={e => {
              // Закриваємо поле при натисканні Escape
              if (e.key === 'Escape') {
                setShowLinkInput(false);
                setUrlInputValue('');
                ReactEditor.focus(editor);
              }
            }}
            onChange={handleLinkInput}
            placeholder={intl.formatMessage({
              id: 'toolbar_link',
              defaultMessage: 'Paste link and press Enter',
            })}
            value={urlInputValue}
            onPressEnter={setLink}
          />
          <Button
            type="primary"
            htmlType="submit"
            onClick={setLink}
            className="md-url-button"
            style={{ display: 'block' }}
            disabled={isEmptyUrlInput}
          >
            <FormattedMessage id="enter" defaultMessage="Enter" />
          </Button>
        </div>
      </div>
    );
  }

  const toolbarGroupsFiltered = toolbarGroups.filter(i => i.page === currentPage);
  const getToolBar = () => (
    <>
      {currentPage > 1 && (
        <span
          style={{
            display: 'inline-block',
            width: '30px',
            textAlign: 'center',
            lineHeight: '30px',
            cursor: 'pointer',
          }}
          onMouseDown={handleClickPrevPage}
        >
          <img
            src={'/images/icons/arrow-toolbar.svg'}
            style={{
              display: 'inline-block',
              height: '12px',
              margin: '0',
            }}
            alt={''}
          />
        </span>
      )}
      <BlockToolbar
        editor={editor}
        buttons={toolbarGroupsFiltered.filter(i => i.type === 'block')}
      />
      <InlineToolbar
        editor={editor}
        buttons={toolbarGroupsFiltered.filter(i => i.type === 'inline')}
      />
      {toolbarGroupsFiltered.map(element => {
        switch (element.type) {
          case 'link':
            return (
              <div className="md-RichEditor-controls">
                <span
                  className="md-RichEditor-styleButton md-RichEditor-linkButton hint--top"
                  role="presentation"
                  onMouseDown={e => e.preventDefault()}
                  onClick={e => {
                    e.preventDefault();
                    if (editor.selection && ReactEditor.isFocused(editor)) {
                      lastSelectionRef.current = editor.selection;
                    }
                    setShowLinkInput(prev => !prev);
                  }}
                  aria-label="Add a link"
                >
                  <Icon type="link" />
                </span>
              </div>
            );
          case 'code':
            return <CodeButton key={element.id} editor={editor} {...element} />;
          default:
            return null;
        }
      })}
      {currentPage < TOTAL_PAGE && (
        <span
          style={{
            display: 'inline-block',
            width: '30px',
            textAlign: 'center',
            lineHeight: '30px',
            cursor: 'pointer',
          }}
          onMouseDown={handleClickNextPage}
        >
          <img
            src={'/images/icons/arrow-toolbar.svg'}
            style={{
              display: 'inline-block',
              height: '12px',
              transform: 'rotate(180deg)',
              margin: '0',
            }}
            alt={''}
          />
        </span>
      )}
    </>
  );

  return (
    <>
      {isTable && <TableToolbar editorNode={editorNode} intl={intl} editor={editor} />}
      <div
        ref={refToolbar}
        className={`md-editor-toolbar${isOpen ? ' md-editor-toolbar--isopen' : ''}`}
      >
        {isOpen && getToolBar()}
      </div>
    </>
  );
};

Toolbar.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  editorNode: PropTypes.any,
  intl: PropTypes.shape().isRequired,
};

export default Toolbar;
