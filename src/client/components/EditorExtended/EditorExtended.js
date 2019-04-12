import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { convertToRaw } from 'draft-js';
import { Editor as MediumDraftEditor, createEditorState } from './index';
import toMarkdown from './util/editorStateToMarkdown';

@injectIntl
class Editor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape(),
    // passed props:
    // onAddObject: PropTypes.func, // use it in future
    onChange: PropTypes.func,
  };
  static defaultProps = {
    intl: {},
    onAddObject: () => {},
    onChange: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
      editorState: createEditorState(), // for empty content
    };
    /*
    this.state = {
      editorState: createEditorState(data), // with content
    };
    */
    this.onChange = editorState => {
      this.setState({ editorState });
    };
    this.refsEditor = React.createRef();
  }

  componentDidMount() {
    this.setState({ isMounted: true }, this.setFocusAfterMount); // eslint-disable-line
  }

  setFocusAfterMount = () => setTimeout(() => this.refsEditor.current.focus(), 0);

  handleContentChange = editorState => {
    this.onChange(editorState);
    this.props.onChange(toMarkdown(convertToRaw(editorState.getCurrentContent())));
  };

  render() {
    const { editorState, isMounted } = this.state;
    return (
      <div className="waiv-editor">
        {isMounted ? (
          <MediumDraftEditor
            ref={this.refsEditor}
            placeholder={this.props.intl.formatMessage({ id: 'title', defaultMessage: 'Title' })}
            editorState={editorState}
            beforeInput={this.handleBeforeInput}
            onChange={this.handleContentChange}
          />
        ) : null}
      </div>
    );
  }
}

export default Editor;
