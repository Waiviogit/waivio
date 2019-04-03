import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Editor as MediumDraftEditor, createEditorState } from 'medium-draft';
import { convertToRaw } from 'draft-js';
import 'medium-draft/lib/index.css';
import ImageSideBtn from './SideButtons/ImageSideButton';
import EmbedSideBtn from './SideButtons/EmbedSideButton';
import SeparatorSideBtn from './SideButtons/SeparatorSideButton';
import './Editor.less';
import toMarkdown from './helpers/editorStateToMarkdown';

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
      {
        title: props.intl.formatMessage({ id: 'add_separator', defaultMessage: 'Add a separator' }),
        component: SeparatorSideBtn,
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
    this.props.onChange(toMarkdown(convertToRaw(editorState.getCurrentContent())));
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
