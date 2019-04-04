import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import {
  Editor as MediumDraftEditor,
  createEditorState,
  StringToTypeMap,
  beforeInput,
} from 'medium-draft';
import { convertToRaw } from 'draft-js';
import 'medium-draft/lib/index.css';
import ImageSideBtn from './SideButtons/ImageSideButton';
import EmbedSideBtn from './SideButtons/EmbedSideButton';
import SeparatorSideBtn from './SideButtons/SeparatorSideButton';
import { BLOCK_BUTTONS, INLINE_BUTTONS, TOOLBAR_CONFIG } from './constants';
import toMarkdown from './helpers/editorStateToMarkdown';
import customRenderer from './helpers/customRenderer';
import './Editor.less';

@injectIntl
class Editor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // passed props
    // onAddObject: PropTypes.func, // use it in future
    onChange: PropTypes.func,
  };
  static defaultProps = {
    onAddObject: () => {},
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
        title: 'Separator',
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

  handleBeforeInput = (editorState, str, onChange) =>
    beforeInput(editorState, str, onChange, StringToTypeMap); // we can do something here before input (use for 2nd placeholder?)

  render() {
    const { editorState } = this.state;
    return (
      <div className="waiv-editor">
        <MediumDraftEditor
          ref={this.refsEditor}
          placeholder={this.props.intl.formatMessage({ id: 'title', defaultMessage: 'Title' })}
          editorState={editorState}
          beforeInput={this.handleBeforeInput}
          onChange={this.handleContentChange}
          blockButtons={BLOCK_BUTTONS}
          inlineButtons={INLINE_BUTTONS}
          toolbarConfig={TOOLBAR_CONFIG}
          sideButtons={this.sideButtons}
          rendererFn={customRenderer}
        />
      </div>
    );
  }
}

export default Editor;
