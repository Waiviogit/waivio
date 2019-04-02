import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Editor as MediumDraftEditor, createEditorState } from 'medium-draft';
import 'medium-draft/lib/index.css';
import ImageSideBtn from './SideButtons/ImageSideButton';
import EmbedSideBtn from './SideButtons/EmbedSideButton';
import './Editor.less';

@injectIntl
class Editor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // passed props
    onChange: PropTypes.func,
  };
  static defaultProps = {
    onChange: () => {},
  };

  constructor(props) {
    super(props);

    this.sideButtons = [
      {
        title: props.intl.formatMessage({ id: 'image', defaultMessage: 'Image' }),
        component: ImageSideBtn,
      },
      {
        title: props.intl.formatMessage({ id: 'embed', defaultMessage: 'Add embed' }),
        component: EmbedSideBtn,
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

  handleContentChange = editorState => {
    this.onChange(editorState);
    this.props.onChange(editorState);
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className="waiv-editor">
        <MediumDraftEditor
          ref={this.refsEditor}
          editorState={editorState}
          onChange={this.handleContentChange}
          sideButtons={this.sideButtons}
        />
      </div>
    );
  }
}

export default Editor;
