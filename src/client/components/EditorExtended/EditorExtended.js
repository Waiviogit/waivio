import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { convertToRaw } from 'draft-js';
import { Editor as MediumDraftEditor, createEditorState, Block } from './index';
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

@injectIntl
class Editor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape(),
    // passed props:
    initialContent: PropTypes.shape(),
    onChange: PropTypes.func,
  };
  static defaultProps = {
    intl: {},
    initialContent: {
      blocks: [
        {
          key: '6p2pe',
          text: '',
          type: Block.STORY_TITLE,
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    },
    onChange: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
      editorState: createEditorState(props.initialContent), // for empty content
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
            sideButtons={SIDE_BUTTONS}
          />
        ) : null}
      </div>
    );
  }
}

export default Editor;
