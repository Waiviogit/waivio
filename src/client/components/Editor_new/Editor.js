import React from 'react';
import { Editor as MediumDraftEditor, createEditorState } from 'medium-draft';
import 'medium-draft/lib/index.css';

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.refsEditor.current.focus();
  }

  render() {
    const { editorState } = this.state;
    return (
      <MediumDraftEditor ref={this.refsEditor} editorState={editorState} onChange={this.onChange} />
    );
  }
}

export default Editor;
