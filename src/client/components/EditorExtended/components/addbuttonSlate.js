import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { injectIntl } from 'react-intl';
import { useSlate } from 'slate-react';
import { getSelection } from '../util';
import { SIDE_BUTTONS_SLATE } from '../model/content';

import './addbutton.less';

const HEIGHT_BTN = 14;

const AddButtonSlate = props => {
  const { editorNode, isComment } = props;

  const [isOpen, setOpen] = useState(false);
  const [, setControl] = useState(false);
  const editor = useSlate();
  const { selection } = editor;
  const nodeRef = useRef(null);
  const sideControl = useRef(null);
  const initialPosOfBtn = useRef(null);

  useEffect(() => {
    if (!editorNode) return;
    setTimeout(() => {
      const nativeSelection = getSelection(window);

      if (nativeSelection?.rangeCount < 1) return;

      const range = nativeSelection.getRangeAt(0);
      const bound = range.getBoundingClientRect();
      const parentBoundary = editorNode.getBoundingClientRect();
      const nodeStyle = nodeRef.current?.style;

      if (bound.top > 0) {
        nodeStyle.top = `${bound.top - parentBoundary.top - HEIGHT_BTN}px`;
      } else if (bound.top <= 0) nodeStyle.top = initialPosOfBtn.current.top || 'auto';
      if (!initialPosOfBtn.current.top) initialPosOfBtn.current.top = nodeStyle.top;
    }, 50);
  }, [selection, editor]);

  const renderControl = control => {
    setControl(prev => !prev);
    sideControl.current = control;
  };

  const handleOpenToolbar = () => {
    setOpen(prev => !prev);
    if (isOpen) sideControl.current = null;
  };

  const handleClose = () => {
    setOpen(false);
    sideControl.current = null;
  };

  useEffect(() => {
    if (props.isClearSearchObjects) setOpen(false);
  }, [props.isClearSearchObjects]);

  return (
    <div className="md-side-toolbar" style={{ top: 0 }} ref={nodeRef}>
      <button
        onClick={handleOpenToolbar}
        className={`md-sb-button md-add-button${isOpen ? ' md-open-button' : ''}`}
        type="button"
      >
        <svg viewBox="0 0 8 8" height="14" width="14">
          <path d="M3 0v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2z" className="add-button-plus" />
        </svg>
      </button>
      {isOpen &&
        (sideControl.current ? (
          sideControl.current
        ) : (
          <TransitionGroup className="act-buttons-group">
            <div className="act-buttons-heading">
              {props.intl.formatMessage({ id: 'insert_btn', defaultMessage: 'Insert' })}
            </div>
            <div className="act-buttons-grid">
              {SIDE_BUTTONS_SLATE.map(button => {
                const Button = button.component;
                const extraProps = button.props ? button.props : {};

                return (
                  <CSSTransition
                    key={button.title}
                    classNames="md-add-btn-anim"
                    appear
                    timeout={{
                      enter: 200,
                      exit: 100,
                      appear: 100,
                    }}
                  >
                    <Button
                      {...extraProps}
                      handleObjectSelect={props.handleObjectSelect}
                      close={handleOpenToolbar}
                      renderControl={renderControl}
                      handleHashtag={props.handleHashtag}
                      selection={selection}
                      handleClose={handleClose}
                      editorNode={editorNode}
                      isComment={isComment}
                    />
                  </CSSTransition>
                );
              })}
            </div>
          </TransitionGroup>
        ))}
    </div>
  );
};

AddButtonSlate.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  handleObjectSelect: PropTypes.func.isRequired,
  withTitleLine: PropTypes.bool,
  focus: PropTypes.func,
  sideButtons: PropTypes.arrayOf(PropTypes.shape()),
  handleHashtag: PropTypes.func.isRequired,
  isClearSearchObjects: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
  editorNode: PropTypes.node.isRequired,
  isComment: PropTypes.bool,
};

AddButtonSlate.defaultProps = {
  focus: () => {},
  sideButtons: [],
  withTitleLine: false,
  isClearSearchObjects: false,
  isComment: false,
};

export default injectIntl(AddButtonSlate);
