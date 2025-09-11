import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { injectIntl } from 'react-intl';
import { useSlate, ReactEditor } from 'slate-react';
import classNames from 'classnames';
import { isAndroidDevice } from '../../../../common/helpers/apiHelpers';
import { setLastSelection } from '../../../../store/slateEditorStore/editorActions';
import { getLastSelection } from '../../../../store/slateEditorStore/editorSelectors';

import { SIDE_BUTTONS_SLATE } from '../model/content';

import './addbutton.less';

const AddButtonSlate = props => {
  const { editorNode, isComment, initialPosTop, ADD_BTN_DIF, parentPost } = props;
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);
  const [, setControl] = useState(false);
  const editor = useSlate();
  const { selection } = editor;
  const nodeRef = useRef(null);
  const sideControl = useRef(null);
  const initialPosOfBtn = useRef(null);
  const firstRender = useRef(false);
  const lastBounding = useRef(null);
  const lastSect = useSelector(getLastSelection);

  useEffect(() => {
    if (!editorNode) return;

    if (selection) {
      dispatch(setLastSelection(selection));
      props.setLastSelection(selection);
    }

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const nativeSelection = getSelection(window);

        if (nativeSelection?.rangeCount < 1 && !props.lastSelection) return;
        const range = nativeSelection.getRangeAt(0);
        const bound = editor.selection ? range.getBoundingClientRect() : lastBounding.current;
        const parentBoundary = editorNode.getBoundingClientRect();
        const nodeStyle = nodeRef.current?.style || {};

        if (selection && isAndroidDevice()) {
          lastBounding.current = bound;
        }

        if (!firstRender.current && initialPosTop) {
          firstRender.current = true;
          nodeStyle.top = initialPosTop;

          return;
        }
        if (bound?.top > 0) {
          nodeStyle.top = `${bound.top - parentBoundary.top - ADD_BTN_DIF}px`;
        } else if (bound?.top <= 0) {
          nodeStyle.top = isAndroidDevice() ? '11px' : initialPosTop || '-14px';
        }

        if (initialPosOfBtn.current && !initialPosOfBtn?.current?.top)
          initialPosOfBtn.current.top = nodeStyle.top;
      }
    }, 50);
  }, [selection, editor]);

  const renderControl = control => {
    setControl(prev => !prev);
    sideControl.current = control;
  };

  const toggleToolbar = () => {
    setOpen(!isOpen);
    if (isOpen) sideControl.current = null;
  };

  const handleClose = () => {
    setOpen(false);
    sideControl.current = null;
    // Очищуємо lastSelection коли закриваємо модалку
    dispatch(setLastSelection(null));
    props.setLastSelection(null);
    ReactEditor.focus(editor);
  };

  useEffect(() => {
    if (props.isClearSearchObjects) setOpen(false);
  }, [props.isClearSearchObjects]);
  const buttonClassList = classNames('md-sb-button-plus md-add-button', {
    'md-open-button': isOpen,
    'md-add-button--comments': props.isComment,
    'md-add-button--commentsEdit': props.isCommentEdit,
  });

  return (
    <div className="md-side-toolbar" style={{ top: initialPosTop }} ref={nodeRef}>
      <button onClick={toggleToolbar} className={buttonClassList} type="button">
        <Icon
          type="plus-circle"
          style={{ fontSize: props.size, background: 'white', borderRadius: '50%' }}
        />
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
                      close={handleClose}
                      renderControl={renderControl}
                      handleHashtag={props.handleHashtag}
                      selection={selection}
                      handleClose={handleClose}
                      editorNode={editorNode}
                      isComment={isComment}
                      parentPost={parentPost}
                      lastSelection={lastSect}
                      editor={editor}
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
  getEditorState: PropTypes.func,
  setEditorState: PropTypes.func,
  handleObjectSelect: PropTypes.func.isRequired,
  withTitleLine: PropTypes.bool,
  parentPost: PropTypes.shape({
    id: PropTypes.string,
  }),
  lastSelection: PropTypes.shape(),
  focus: PropTypes.func,
  setLastSelection: PropTypes.func,
  sideButtons: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.elementType.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ),
  handleHashtag: PropTypes.func,
  isClearSearchObjects: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  editorNode: PropTypes.any,
  isComment: PropTypes.bool,
  isCommentEdit: PropTypes.bool,
  initialPosTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.number,
  ADD_BTN_DIF: PropTypes.number,
};

AddButtonSlate.defaultProps = {
  focus: () => {},
  sideButtons: [],
  withTitleLine: false,
  isClearSearchObjects: false,
  isComment: false,
  isCommentEdit: false,
  initialPosTop: 0,
  ADD_BTN_DIF: 14,
  size: 30,
  parentPost: null,
};

export default injectIntl(AddButtonSlate);
