import React from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';
import { getVisibleSelectionRect } from 'draft-js';

const getRelativeParent = element => {
  if (!element) {
    return null;
  }

  const position = window.getComputedStyle(element).getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

export default class LinkEditComponent extends React.Component {
  static propTypes = {
    // editorState: PropTypes.shape().isRequired,
    url: PropTypes.string.isRequired,
    blockKey: PropTypes.string.isRequired,
    entityKey: PropTypes.string.isRequired,
    removeLink: PropTypes.func.isRequired,
    editLink: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      position: {},
    };
    this.renderedOnce = false;
  }

  componentDidMount() {
    setTimeout(this.calculatePosition, 0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.renderedOnce) {
      const { blockKey, entityKey } = this.props;
      const ret =
        !this.hasPosition(nextState.position) ||
        blockKey !== nextProps.blockKey ||
        entityKey !== nextProps.entityKey;
      if (ret) {
        this.renderedOnce = false;
      }
      return ret;
    }
    this.renderedOnce = true;
    return true;
  }

  componentDidUpdate() {
    setTimeout(this.calculatePosition, 0);
  }

  hasPosition = position => {
    if (Object.keys(this.state.position).length === 0) {
      return false;
    }
    const { top, left } = this.state.position;
    return position.top === top && position.left === left;
  };

  calculatePosition = () => {
    if (!this.toolbar) {
      return;
    }
    const relativeParent = getRelativeParent(this.toolbar.parentElement);
    const relativeRect = relativeParent
      ? relativeParent.getBoundingClientRect()
      : window.document.body.getBoundingClientRect();
    const selectionRect = getVisibleSelectionRect(window);
    if (!selectionRect) {
      return;
    }
    const position = {
      top: selectionRect.top - relativeRect.top + 30,
      left: selectionRect.left - relativeRect.left + selectionRect.width / 2,
      transform: 'translate(-50%) scale(1)',
    };
    this.setState({ position });
  };

  removeLink = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.removeLink(this.props.blockKey, this.props.entityKey);
  };

  editLink = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.editLink(this.props.blockKey, this.props.entityKey);
  };

  render() {
    const url = this.props.url;
    return (
      <div
        className="md-editor-toolbar md-editor-toolbar--isopen md-editor-toolbar-edit-link"
        style={this.state.position}
        ref={element => {
          this.toolbar = element;
        }}
      >
        <a href={this.props.url} title={this.props.url} target="_blank" rel="noopener noreferrer">
          {truncate(url, { length: 30 })}
        </a>
      </div>
    );
  }
}
