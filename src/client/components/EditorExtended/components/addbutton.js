import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import { getSelectedBlockNode } from '../util';
import { getIsClearSearchObjects } from '../../../store/searchStore/searchSelectors';

import './addbutton.less';

/**
 * Implementation of the medium-link side `+` button to insert various rich blocks
 * like Images/Embeds/Videos.
 */
@connect(state => ({
  isClearSearchObjects: getIsClearSearchObjects(state),
}))
export default class AddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        top: 0,
      },
      visible: true,
      isOpen: false,
      isControlElem: false,
    };
    this.node = null;
    this.blockKey = '';
    this.blockType = '';
    this.blockLength = -1;
    this.sideControl = null;

    this.findNode = this.findNode.bind(this);
    this.openToolbar = this.openToolbar.bind(this);
    this.renderControlElem = this.renderControlElem.bind(this);
  }

  // To show + button only when text length == 0
  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const block = contentState.getBlockForKey(selectionState.anchorKey);
    const bkey = block.getKey();

    if (this.props.isClearSearchObjects) {
      this.setState({ isOpen: false });
    }

    if (block.getType() !== this.blockType) {
      this.blockType = block.getType();
      if (!block.getLength()) {
        setTimeout(this.findNode, 0);
      }
      this.blockKey = bkey;

      return;
    }
    if (this.blockKey === bkey) {
      if (block.getLength()) {
        this.setState({
          visible: true,
        });
      }

      return;
    }
    this.blockKey = bkey;
    setTimeout(this.findNode, 0);
  }

  openToolbar() {
    this.setState(
      {
        isOpen: !this.state.isOpen,
        isControlElem: false,
      },
      () => {
        // callback function
        // save page state
        const x = window.scrollX;
        const y = window.scrollY;

        // do focus
        this.props.focus();
        // back previous window state
        window.scrollTo(x, y);
      },
    );
  }

  findNode() {
    // eslint-disable-next-line no-undef
    const node = getSelectedBlockNode(window);

    if (node === this.node) {
      return;
    }
    if (!node) {
      // console.log('no node');
      this.setState({
        visible: false,
        isOpen: false,
        isControlElem: false,
      });

      return;
    }
    // const rect = node.getBoundingClientRect();
    this.node = node;
    this.setState({
      visible: true,
      style: {
        top: node.offsetTop - 3,
      },
    });
  }

  renderControlElem(control) {
    this.sideControl = control;
    this.setState({ isControlElem: true });
  }

  render() {
    if (!this.state.visible) {
      return null;
    }

    return (
      <div className="md-side-toolbar" style={this.state.style}>
        <button
          onClick={this.openToolbar}
          className={`md-sb-button md-add-button${this.state.isOpen ? ' md-open-button' : ''}`}
          type="button"
        >
          <svg viewBox="0 0 8 8" height="14" width="14">
            <path d="M3 0v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2z" />
          </svg>
        </button>
        {this.state.isOpen &&
          (this.state.isControlElem ? (
            this.sideControl
          ) : (
            <TransitionGroup className="act-buttons-group">
              {this.props.sideButtons.map(button => {
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
                      getEditorState={this.props.getEditorState}
                      setEditorState={this.props.setEditorState}
                      close={this.openToolbar}
                      renderControl={this.renderControlElem}
                      handleHashtag={this.props.handleHashtag}
                    />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          ))}
      </div>
    );
  }
}

AddButton.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  withTitleLine: PropTypes.bool,
  focus: PropTypes.func,
  sideButtons: PropTypes.arrayOf(PropTypes.object),
  handleHashtag: PropTypes.func.isRequired,
  isClearSearchObjects: PropTypes.bool,
};

AddButton.defaultProps = {
  focus: () => {},
  sideButtons: [],
  withTitleLine: false,
  isClearSearchObjects: false,
};
