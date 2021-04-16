import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Input, message } from 'antd';
import { injectIntl } from 'react-intl';
import { CompositeDecorator, convertToRaw, EditorState } from 'draft-js';
import {
  createEditorState,
  Editor as MediumDraftEditor,
  findLinkEntities,
  fromMarkdown,
} from '../index';
import ImageSideButton from '../components/sides/ImageSideButton';
import VideoSideButton from '../components/sides/VideoSideButton';
import SeparatorButton from '../components/sides/SeparatorSideButton';
import ObjectSideButton from '../components/sides/ObjectSideButton';
import { getObjectsByIds } from '../../../../waivioApi/ApiClient';
import ObjectLink, { findObjEntities } from '../components/entities/objectlink';
import Link from '../components/entities/link';
import { getNewLinkedObjectsCards } from '../../../helpers/editorHelper';
import { getObjectIds, getRawContentEntityMap } from "../../../store/editorStore/editorActions";

const SIDE_BUTTONS = [
  {
    title: 'Image',
    component: ImageSideButton,
  },
  {
    title: 'Video',
    component: VideoSideButton,
  },
  {
    title: 'Object',
    component: ObjectSideButton,
  },
  {
    title: 'Separator',
    component: SeparatorButton,
  },
];

export const defaultDecorators = new CompositeDecorator([
  {
    strategy: findObjEntities,
    component: ObjectLink,
  },
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

class Editor extends React.Component {
  static propTypes = {
    // passed props:
    enabled: PropTypes.bool.isRequired,
    initialContent: PropTypes.shape({
      title: PropTypes.string,
      body: PropTypes.string,
    }).isRequired,
    // locale: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    // setUpdatedEditorData: PropTypes.func,
    intl: PropTypes.shape(),
    handleHashtag: PropTypes.func,
    displayTitle: PropTypes.bool,
    draftId: PropTypes.string,
    getRestoreObjects: PropTypes.func,
    // linkedObjectsCards: PropTypes.shape().isRequired,
  };
  static defaultProps = {
    intl: {},
    onChange: () => {},
    setUpdatedEditorData: () => {},
    handleHashtag: () => {},
    displayTitle: true,
    draftId: '',
    linkedObjects: [],
  };

  static MAX_LENGTH = 255;

  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
      editorEnabled: false,
      prevEditorState: null,
      editorState: EditorState.createEmpty(defaultDecorators),
      titleValue: '',
    };
    this.refsEditor = React.createRef();
  }

  componentDidMount() {
    const { initialContent } = this.props;
    this.setState({ isMounted: true, titleValue: get(initialContent, 'title', '') }); // eslint-disable-line
    this.restoreObjects(fromMarkdown(initialContent)).then(() => this.setFocusAfterMount());
  }

  onChange = editorState => {
    const { editorState: prevEditorState } = this.state;

    this.setState({ editorState, prevEditorState });
  };
  setFocusAfterMount = () => {
    setTimeout(() => this.refsEditor.current.focus(), 0);
    this.setState({ editorEnabled: true });
  };

  restoreObjects = async (rawContent, newObject) => {
    const { getRestoreObjects, draftId } = this.props;
    const rawContentUpdated = await getRestoreObjects(rawContent, newObject, draftId);

    console.log('rawContentUpdated');
    this.handleContentChange(EditorState.moveFocusToEnd(createEditorState(rawContentUpdated)));
  };

  handleContentChange = editorState => {
    this.onChange(editorState);
    this.props.onChange(convertToRaw(editorState.getCurrentContent()), this.state.titleValue);
  };

  validateLength = event => {
    this.setState({ titleValue: event.target.value }, () => {
      if (this.state.titleValue && this.state.titleValue.length === Editor.MAX_LENGTH) {
        message.error(
          this.props.intl.formatMessage({
            id: 'title_error_too_long',
            defaultMessage: "Title can't be longer than 255 characters.",
          }),
        );
      }
    });
  };

  render() {
    const { editorState, isMounted, editorEnabled, titleValue } = this.state;
    const { initialContent } = this.props;
    const isVimeo = get(initialContent, 'body', '').includes('player.vimeo.com');

    return (
      <div className="waiv-editor-wrap">
        {this.props.displayTitle && (
          <Input.TextArea
            maxLength={Editor.MAX_LENGTH}
            autoSize
            className="md-RichEditor-title"
            value={titleValue}
            placeholder={this.props.intl.formatMessage({ id: 'title', defaultMessage: 'Title' })}
            onChange={event => this.validateLength(event)}
          />
        )}
        <div className="waiv-editor">
          {isMounted && (
            <MediumDraftEditor
              ref={this.refsEditor}
              placeholder={this.props.intl.formatMessage({
                id: 'story_placeholder',
                defaultMessage: 'Write your story...',
              })}
              editorEnabled={editorEnabled && this.props.enabled}
              editorState={editorState}
              beforeInput={this.handleBeforeInput}
              onChange={this.handleContentChange}
              sideButtons={SIDE_BUTTONS}
              intl={this.props.intl}
              handleHashtag={this.props.handleHashtag}
              isVimeo={isVimeo}
            />
          )}
        </div>
      </div>
    );
  }
}

export default injectIntl(Editor);

