import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { injectIntl } from 'react-intl';
import { useSlate, ReactEditor } from 'slate-react';
import classNames from 'classnames';
import { isAndroidDevice } from '../../../../common/helpers/apiHelpers';
import { isIOS } from '../../../../common/helpers';
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
  const positionUpdateTimeoutRef = useRef(null);
  const isIOSDevice = isIOS();
  // Debounced position update function
  const updateButtonPosition = useCallback(() => {
    if (!editorNode || !nodeRef.current) return;

    try {
      const nativeSelection = getSelection(window);

      if (!nativeSelection?.rangeCount && !props.lastSelection) return;

      const range = nativeSelection?.rangeCount ? nativeSelection.getRangeAt(0) : null;
      const bound = range ? range.getBoundingClientRect() : lastBounding.current;
      const parentBoundary = editorNode.getBoundingClientRect();
      const nodeStyle = nodeRef.current.style;

      if (!bound || !parentBoundary) return;

      if (selection && isAndroidDevice()) {
        lastBounding.current = bound;
      }

      if (!firstRender.current && initialPosTop) {
        firstRender.current = true;
        nodeStyle.top = initialPosTop;

        return;
      }

      let newTop;

      if (bound.top > 0) {
        newTop = bound.top - parentBoundary.top - ADD_BTN_DIF;
      } else if (bound.top <= 0) {
        newTop = isAndroidDevice() ? 11 : initialPosOfBtn?.current?.top || -14;
      } else {
        newTop = initialPosOfBtn?.current?.top || 0;
      }

      // Ensure the button stays within reasonable bounds
      if (isIOSDevice) {
        const maxTop = Math.max(0, parentBoundary.height - 50);

        newTop = Math.max(0, Math.min(newTop, maxTop));
      }

      nodeStyle.top = `${newTop}px`;

      if (initialPosOfBtn.current && !initialPosOfBtn.current.top) {
        initialPosOfBtn.current.top = newTop;
      }
    } catch (error) {
      console.warn('Error updating button position:', error);
      // Fallback to safe position
      if (nodeRef.current) {
        nodeRef.current.style.top = initialPosTop || '0px';
      }
    }
  }, [editorNode, selection, props.lastSelection, ADD_BTN_DIF, initialPosTop, isIOSDevice]);

  useEffect(() => {
    if (editorNode) {
      if (selection && isAndroidDevice()) {
        dispatch(setLastSelection(selection));
        props.setLastSelection(selection);
      }

      // Clear any existing timeout
      if (positionUpdateTimeoutRef.current) {
        clearTimeout(positionUpdateTimeoutRef.current);
      }

      // Use shorter timeout for iOS to improve responsiveness
      const timeoutDelay = isIOSDevice ? 25 : 50;

      positionUpdateTimeoutRef.current = setTimeout(() => {
        updateButtonPosition();
      }, timeoutDelay);
    }

    return () => {
      if (positionUpdateTimeoutRef.current) {
        clearTimeout(positionUpdateTimeoutRef.current);
      }
    };
  }, [selection, editor, updateButtonPosition, editorNode, dispatch, props, isIOSDevice]);

  // Force position update on iOS when component mounts or editor changes
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isIOSDevice && editorNode) {
      const forceUpdatePosition = () => {
        setTimeout(updateButtonPosition, 100);
      };

      // Update position after a short delay to ensure DOM is ready
      forceUpdatePosition();

      // Also update on window resize for iOS
      const handleResize = () => {
        setTimeout(updateButtonPosition, 50);
      };

      window.addEventListener('resize', handleResize);

      return () => () => window.removeEventListener('resize', handleResize);
    }
  }, [editorNode, isIOSDevice, updateButtonPosition]);

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
