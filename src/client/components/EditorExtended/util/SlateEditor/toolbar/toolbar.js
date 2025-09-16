import React, { useEffect, useRef, useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Editor, Range, Transforms, Node, Element as ElementSlate } from 'slate';
import { Button, Input, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import BTooltip from '../../../../BTooltip';

import useTable from '../utils/useTable';
import defaultToolbarGroups from './toolbarGroups';
import CodeButton from './codebutton';
import { wrapLink, normalizeLink } from '../utils/link';
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
  const [isShowAltInput, setShowAltInput] = useState(false);
  const [altInputValue, setAltInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setOpen] = useState(false);
  const [isOpenImageToolBar, setOpenImageToolBar] = useState(false);
  const refToolbar = useRef(null);
  const lastSelectionRef = useRef(null);
  const { selection } = editor;

  // Check if current selection is an image
  const isImageSelected = () => {
    if (!selection) return false;

    const { path } = editor?.selection?.anchor;
    const selectedElementPath = path.slice(0, -1);

    try {
      if (!Node.has(editor, selectedElementPath)) return false;
      const selectedElement = Node.descendant(editor, selectedElementPath);

      return selectedElement.type === 'image';
    } catch (error) {
      console.warn('Error checking if image is selected:', error);

      return false;
    }
  };

  // Position image toolbar above the image
  const positionImageToolbar = () => {
    if (!refToolbar.current || !editorNode) return;

    const toolbarNode = refToolbar.current;
    const editorDomNode = ReactEditor.toDOMNode(editor, editor);
    const { path } = editor.selection.anchor;
    const selectedElementPath = path.slice(0, -1);

    try {
      if (!Node.has(editor, selectedElementPath)) return;
      const selectedElement = Node.descendant(editor, selectedElementPath);
      const imageDomNode = ReactEditor.toDOMNode(editor, selectedElement);

      if (imageDomNode && editorDomNode) {
        const editorBounds = editorDomNode.getBoundingClientRect();
        const imageBounds = imageDomNode.getBoundingClientRect();
        const toolbarBounds = toolbarNode.getBoundingClientRect();
        const top = imageBounds.top - editorBounds.top - toolbarBounds.height + 52;
        const cellEntry = Editor.above(editor, {
          at: selection,
          match: n => ElementSlate.isElement(n) && n.type === 'tableCell',
        });

        const anchorCenter =
          imageBounds.left - editorBounds.left + editorDomNode.scrollLeft + imageBounds.width / 2;

        // left для тулбара так, щоб його центр співпав з центром картинки
        const leftCalc = Math.round(anchorCenter - toolbarBounds.width / 2);

        toolbarNode.style.top = `${top}px`;
        toolbarNode.style.left = cellEntry ? `${leftCalc + 33}px` : '-25px';
        toolbarNode.style.position = 'absolute';
        toolbarNode.style.zIndex = '1000';
      }
    } catch (error) {
      console.warn('Error positioning image toolbar:', error);
    }
  };

  useEffect(() => {
    if (isImageSelected() && selection) {
      setOpenImageToolBar(true);
      setTimeout(() => positionImageToolbar(), 0);
    } else {
      setOpenImageToolBar(false);
      refToolbar.current?.removeAttribute('style');
    }
  }, [isImageSelected(), selection, editor]);

  useEffect(() => {
    if (isShowLinkInput || isShowAltInput) {
      return setOpen(true);
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Editor.string(editor, selection) === '' ||
      Range.isCollapsed(selection)
    ) {
      setShowLinkInput(false);
      setShowAltInput(false);
      refToolbar.current?.removeAttribute('style');

      return setOpen(false);
    }

    return setOpen(true);
  }, [editor, selection, isShowLinkInput, isShowAltInput]);

  // Close link/alt input when clicking outside or losing focus
  useEffect(() => {
    if (!isShowLinkInput && !isShowAltInput) return;

    const handleClickOutside = event => {
      if (refToolbar.current && !refToolbar.current.contains(event.target)) {
        setShowLinkInput(false);
        setShowAltInput(false);
        setUrlInputValue('');
        setAltInputValue('');
        ReactEditor.focus(editor);
      }
    };

    const handleFocusOut = () => {
      // Small delay to allow for input interactions
      setTimeout(() => {
        if (!ReactEditor.isFocused(editor)) {
          setShowLinkInput(false);
          setShowAltInput(false);
          setUrlInputValue('');
          setAltInputValue('');
        }
      }, 100);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('blur', handleFocusOut);
    document.addEventListener('visibilitychange', handleFocusOut);

    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('blur', handleFocusOut);
      document.removeEventListener('visibilitychange', handleFocusOut);
    };
  }, [isShowLinkInput, isShowAltInput, editor]);

  useEffect(() => {
    if (!isOpen && !isOpenImageToolBar) return;
    if (typeof window !== 'undefined') {
      const nativeSelection = getSelection(window);
      const selectionBoundary = getSelectionRect(nativeSelection);

      if (!refToolbar.current || !editorNode) return;

      const toolbarNode = refToolbar.current;

      const parentBoundary = editorNode.getBoundingClientRect();
      const toolbarBoundary = toolbarNode.getBoundingClientRect();
      const { path } = editor?.selection?.anchor;
      const selectedElementPath = path.slice(0, -1);

      try {
        if (!Node.has(editor, selectedElementPath)) return;
        const selectedElement = Node.descendant(editor, selectedElementPath);

        if (selectedElement.type === 'image') {
          positionImageToolbar();
        } else {
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
      } catch (error) {
        console.warn('Error positioning toolbar:', error);
      }
    }
  }, [isOpen, editor.selection]);

  const handleLinkInput = e => {
    setUrlInputValue(e.target.value);
  };

  const handleAltInput = e => {
    setAltInputValue(e.target.value);
  };

  const setLink = e => {
    e.preventDefault();

    if (!editor.selection && lastSelectionRef.current) {
      Transforms.select(editor, lastSelectionRef.current);
    }

    if (editor.selection) {
      const [imageNode, imagePath] = Editor.nodes(editor, {
        at: editor.selection,
        match: n => n.type === 'image',
      });

      if (imageNode) {
        Transforms.setNodes(editor, { href: normalizeLink(urlInputValue) }, { at: imagePath });
        setShowLinkInput(false);
        setUrlInputValue('');
        Transforms.select(editor, imagePath);

        setTimeout(() => positionImageToolbar(), 0);

        return;
      }
    }

    wrapLink(editor, urlInputValue);
    setShowLinkInput(false);
    setUrlInputValue('');

    // Ensure focus is maintained and table toolbar is repositioned if needed
    ReactEditor.focus(editor);

    // Small delay to allow DOM updates and then trigger table toolbar repositioning
    setTimeout(() => {
      if (isTable) {
        // Force a selection update to trigger table toolbar repositioning
        const currentSelection = editor.selection;

        if (currentSelection) {
          Transforms.select(editor, currentSelection);
        }
      }
    }, 50);
  };

  const removeLink = e => {
    e.preventDefault();

    if (!editor.selection && lastSelectionRef.current) {
      Transforms.select(editor, lastSelectionRef.current);
    }

    if (editor.selection) {
      const [imageNode, imagePath] = Editor.nodes(editor, {
        at: editor.selection,
        match: n => n.type === 'image',
      });

      if (imageNode) {
        Transforms.setNodes(editor, { href: null }, { at: imagePath });
        setShowLinkInput(false);
        setUrlInputValue('');
        Transforms.select(editor, imagePath);

        setTimeout(() => positionImageToolbar(), 0);
      } else {
        // Remove link from text selection
        Transforms.unwrapNodes(editor, {
          match: n => !Editor.isEditor(n) && ElementSlate.isElement(n) && n.type === 'link',
        });

        // Ensure focus is maintained and table toolbar is repositioned if needed
        ReactEditor.focus(editor);

        // Small delay to allow DOM updates and then trigger table toolbar repositioning
        setTimeout(() => {
          if (isTable) {
            // Force a selection update to trigger table toolbar repositioning
            const currentSelection = editor.selection;

            if (currentSelection) {
              Transforms.select(editor, currentSelection);
            }
          }
        }, 50);
      }
    }
  };

  const setAlt = e => {
    e.preventDefault();

    if (!editor.selection && lastSelectionRef.current) {
      Transforms.select(editor, lastSelectionRef.current);
    }

    if (editor.selection) {
      const [imageNode, imagePath] = Editor.nodes(editor, {
        at: editor.selection,
        match: n => n.type === 'image',
      });

      if (imageNode) {
        Transforms.setNodes(editor, { alt: altInputValue }, { at: imagePath });
        setShowAltInput(false);
        setAltInputValue('');
        Transforms.select(editor, imagePath);

        setTimeout(() => positionImageToolbar(), 0);
      }
    }
  };

  const removeAlt = e => {
    e.preventDefault();

    if (!editor.selection && lastSelectionRef.current) {
      Transforms.select(editor, lastSelectionRef.current);
    }

    if (editor.selection) {
      const [imageNode, imagePath] = Editor.nodes(editor, {
        at: editor.selection,
        match: n => n.type === 'image',
      });

      if (imageNode) {
        Transforms.setNodes(editor, { alt: null }, { at: imagePath });
        setShowAltInput(false);
        setAltInputValue('');
        Transforms.select(editor, imagePath);

        setTimeout(() => positionImageToolbar(), 0);
      }
    }
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
    let className = `md-editor-toolbar${
      isOpen || isOpenImageToolBar ? ' md-editor-toolbar--isopen' : ''
    }`;

    className += ' md-editor-toolbar--linkinput';

    return (
      <div
        className={className}
        style={{
          top: `${refToolbar.current?.style.top}`,
          left: `${refToolbar.current?.style.left}`,
          background: 'transparent',
        }}
      >
        <div
          className="md-RichEditor-controls md-RichEditor-show-link-input"
          style={{ display: 'flex', marginLeft: '20px', background: 'transparent' }}
        >
          <Input
            className="md-url-input"
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setShowLinkInput(false);
                setUrlInputValue('');
                ReactEditor.focus(editor);
              }
            }}
            onBlur={() => {
              // Small delay to allow for button clicks
              setTimeout(() => {
                setShowLinkInput(false);
                setUrlInputValue('');
                ReactEditor.focus(editor);
              }, 150);
            }}
            onChange={handleLinkInput}
            placeholder={intl.formatMessage({
              id: 'toolbar_link',
              defaultMessage: 'Paste link and press Enter',
            })}
            value={urlInputValue}
            onPressEnter={setLink}
            autoFocus
          />
          <Button
            type="primary"
            htmlType="submit"
            onClick={setLink}
            onMouseDown={e => e.preventDefault()}
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

  if (isShowAltInput) {
    let className = `md-editor-toolbar${
      isOpen || isOpenImageToolBar ? ' md-editor-toolbar--isopen' : ''
    }`;

    className += ' md-editor-toolbar--altinput';

    return (
      <div
        className={className}
        style={{
          top: `${refToolbar.current?.style.top}`,
          left: `${refToolbar.current?.style.left}`,
          background: 'transparent',
        }}
      >
        <div
          className="md-RichEditor-controls md-RichEditor-show-alt-input"
          style={{ display: 'flex', marginLeft: '20px', background: 'transparent' }}
        >
          <Input
            className="md-alt-input"
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setShowAltInput(false);
                setAltInputValue('');
                ReactEditor.focus(editor);
              }
            }}
            onBlur={() => {
              // Small delay to allow for button clicks
              setTimeout(() => {
                setShowAltInput(false);
                setAltInputValue('');
                ReactEditor.focus(editor);
              }, 150);
            }}
            onChange={handleAltInput}
            placeholder={intl.formatMessage({
              id: 'toolbar_alt_text',
              defaultMessage: 'Enter alt text for image',
            })}
            value={altInputValue}
            onPressEnter={setAlt}
            autoFocus
          />
          <Button
            type="primary"
            htmlType="submit"
            onClick={setAlt}
            onMouseDown={e => e.preventDefault()}
            className="md-alt-button"
            style={{ display: 'block' }}
          >
            <FormattedMessage id="enter" defaultMessage="Enter" />
          </Button>
        </div>
      </div>
    );
  }

  const toolbarGroupsFiltered = toolbarGroups.filter(i => i.page === currentPage);
  const getToolBar = () => {
    if (!isOpen && !isOpenImageToolBar) return null;

    if (isOpenImageToolBar) {
      const [imageNode] = Editor.nodes(editor, {
        at: editor.selection,
        match: n => n.type === 'image',
      });

      const hasLink = imageNode?.[0]?.href;
      const hasAlt = imageNode?.[0]?.alt;

      return (
        <div className="md-RichEditor-controls">
          {/* Link button */}
          {hasLink ? (
            <BTooltip title="Remove image link">
              <span
                className="md-RichEditor-styleButton md-RichEditor-linkButton"
                role="presentation"
                onMouseDown={e => e.preventDefault()}
                onClick={removeLink}
              >
                <Icon type="disconnect" />
              </span>
            </BTooltip>
          ) : (
            <BTooltip title="Add image link">
              <span
                className="md-RichEditor-styleButton md-RichEditor-linkButton"
                role="presentation"
                onMouseDown={e => e.preventDefault()}
                onClick={e => {
                  e.preventDefault();
                  if (editor.selection && ReactEditor.isFocused(editor)) {
                    lastSelectionRef.current = editor.selection;
                  }
                  setShowLinkInput(prev => !prev);
                }}
              >
                <Icon type="link" />
              </span>
            </BTooltip>
          )}

          {/* Alt text button */}
          {hasAlt ? (
            <>
              <BTooltip title="Edit alt text">
                <span
                  className="md-RichEditor-styleButton md-RichEditor-altButton"
                  role="presentation"
                  onMouseDown={e => e.preventDefault()}
                  onClick={e => {
                    e.preventDefault();
                    if (editor.selection && ReactEditor.isFocused(editor)) {
                      lastSelectionRef.current = editor.selection;
                      setAltInputValue(imageNode[0].alt || '');
                    }
                    setShowAltInput(prev => !prev);
                  }}
                >
                  <Icon type="edit" />
                </span>
              </BTooltip>
              <BTooltip title="Remove alt text">
                <span
                  className="md-RichEditor-styleButton md-RichEditor-altButton"
                  role="presentation"
                  onMouseDown={e => e.preventDefault()}
                  onClick={removeAlt}
                >
                  <Icon type="delete" />
                </span>
              </BTooltip>
            </>
          ) : (
            <BTooltip title="Add alt text">
              <span
                className="md-RichEditor-styleButton md-RichEditor-altButton"
                role="presentation"
                onMouseDown={e => e.preventDefault()}
                onClick={e => {
                  e.preventDefault();
                  if (editor.selection && ReactEditor.isFocused(editor)) {
                    lastSelectionRef.current = editor.selection;
                  }
                  setShowAltInput(prev => !prev);
                }}
              >
                <Icon type="font-colors" />
              </span>
            </BTooltip>
          )}
        </div>
      );
    }

    return (
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
  };

  return (
    <>
      {isTable && <TableToolbar editorNode={editorNode} intl={intl} editor={editor} />}
      <div
        ref={refToolbar}
        className={`md-editor-toolbar${
          isOpen || isOpenImageToolBar ? ' md-editor-toolbar--isopen' : ''
        }`}
      >
        {getToolBar()}
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
