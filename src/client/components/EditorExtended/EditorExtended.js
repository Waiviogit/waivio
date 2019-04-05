import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { convertToRaw } from 'draft-js';
import { Editor as MediumDraftEditor, createEditorState } from './index';

@injectIntl
class Editor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // passed props:
    // onAddObject: PropTypes.func, // use it in future
    onChange: PropTypes.func,
  };
  static defaultProps = {
    onAddObject: () => {},
    onChange: () => {},
  };

  constructor(props) {
    super(props);

    // this.sideButtons = [
    //   {
    //     title: props.intl.formatMessage({ id: 'image', defaultMessage: 'Image' }),
    //     component: ImageSideBtn,
    //   },
    //   {
    //     title: props.intl.formatMessage({ id: 'embed', defaultMessage: 'Add embed' }),
    //     component: EmbedSideBtn,
    //   },
    //   {
    //     title: 'Separator',
    //     component: SeparatorSideBtn,
    //   },
    // ];

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
    this.props.onChange(convertToRaw(editorState.getCurrentContent()));
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
            // blockButtons={BLOCK_BUTTONS}
            // inlineButtons={INLINE_BUTTONS}
            // toolbarConfig={TOOLBAR_CONFIG}
            // sideButtons={this.sideButtons}
            // rendererFn={customRenderer}
          />
        ) : null}
      </div>
    );
  }
}

export default Editor;
