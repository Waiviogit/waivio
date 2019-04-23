import React from 'react';
import PropTypes from 'prop-types';
import { convertToRaw } from 'draft-js';
import { Editor as MediumDraftEditor, createEditorState, fromMarkdown } from './index';
import ImageSideButton from './components/sides/ImageSideButton';
import SeparatorButton from './components/sides/SeparatorSideButton';
import ObjectSideButton from './components/sides/ObjectSideButton';

const SIDE_BUTTONS = [
  {
    title: 'Image',
    component: ImageSideButton,
  },
  {
    title: 'Separator',
    component: SeparatorButton,
  },
  {
    title: 'Object',
    component: ObjectSideButton,
  },
];

class Editor extends React.Component {
  static propTypes = {
    // passed props:
    initialContent: PropTypes.shape({
      title: PropTypes.string,
      body: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func,
  };
  static defaultProps = {
    intl: {},
    onChange: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
      editorState: createEditorState(fromMarkdown(props.initialContent)),
    };

    this.onChange = editorState => {
      this.setState({ editorState });
    };
    this.refsEditor = React.createRef();
  }

  componentDidMount() {
    this.setState({ isMounted: true }, this.setFocusAfterMount); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initialContent !== nextProps.initialContent) {
      this.handleContentChange(createEditorState(fromMarkdown(nextProps.initialContent)));
    }
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
            placeholder=""
            editorState={editorState}
            beforeInput={this.handleBeforeInput}
            onChange={this.handleContentChange}
            sideButtons={SIDE_BUTTONS}
          />
        ) : null}
      </div>
    );
  }
}

export default Editor;
