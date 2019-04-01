import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Editor as MediumDraftEditor, createEditorState } from 'medium-draft';
import 'medium-draft/lib/index.css';
import ImageSideBtn from './SideButtons/ImageSideButton';
import './Editor.less';

@injectIntl
class Editor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
  };
  constructor(props) {
    super(props);

    this.sideButtons = [
      {
        title: props.intl.formatMessage({ id: 'image', defaultMessage: 'Image' }),
        component: ImageSideBtn,
      },
    ];

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
      <div className="waiv-editor">
        <MediumDraftEditor
          ref={this.refsEditor}
          editorState={editorState}
          onChange={this.onChange}
          sideButtons={this.sideButtons}
        />
      </div>
    );
  }
}

export default Editor;
