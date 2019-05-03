import React from 'react';
import PropTypes from 'prop-types';
import { convertToRaw } from 'draft-js';
import { forEach, get, has, keyBy } from 'lodash';
import { Editor as MediumDraftEditor, createEditorState, fromMarkdown, Entity } from './index';
import ImageSideButton from './components/sides/ImageSideButton';
import VideoSideButton from './components/sides/VideoSideButton';
import SeparatorButton from './components/sides/SeparatorSideButton';
import ObjectSideButton from './components/sides/ObjectSideButton';
import { getObjectsByIds } from '../../../waivioApi/ApiClient';
import getClientObject from '../../adapters';

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
    enabled: PropTypes.bool.isRequired,
    initialContent: PropTypes.shape({
      title: PropTypes.string,
      body: PropTypes.string,
    }).isRequired,
    locale: PropTypes.string.isRequired,
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
      editorEnabled: false,
      editorState: createEditorState(fromMarkdown(props.initialContent)),
    };

    this.onChange = editorState => {
      this.setState({ editorState });
    };
    this.refsEditor = React.createRef();
  }

  componentDidMount() {
    this.setState({ isMounted: true }); // eslint-disable-line
    this.restoreObjects(fromMarkdown(this.props.initialContent)).then(() =>
      this.setFocusAfterMount(),
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initialContent !== nextProps.initialContent) {
      this.setState({ editorEnabled: false });
      const rawContent = fromMarkdown(nextProps.initialContent);
      this.handleContentChange(createEditorState(rawContent));
      this.restoreObjects(rawContent).then(() => this.setFocusAfterMount());
    }
  }

  setFocusAfterMount = () => {
    setTimeout(() => this.refsEditor.current.focus(), 0);
    this.setState({ editorEnabled: true });
  };

  restoreObjects = async rawContent => {
    const objectIds = Object.values(rawContent.entityMap)
      .filter(entity => entity.type === Entity.OBJECT && has(entity, 'data.object.id'))
      .map(entity => get(entity, 'data.object.id', ''));
    if (objectIds.length) {
      const response = await getObjectsByIds({
        authorPermlinks: objectIds,
        locale: this.props.locale,
      });
      const loadObjects = keyBy(response.wobjects, 'author_permlink');
      const entityMap = {};
      forEach(rawContent.entityMap, (value, key) => {
        const loadedObject =
          value.type === Entity.OBJECT && loadObjects[get(value, 'data.object.id')];
        entityMap[key] = {
          ...value,
          data: loadedObject
            ? { ...value.data, object: getClientObject(loadedObject) }
            : { ...value.data },
        };
      });
      const rawContentUpdated = {
        blocks: [...rawContent.blocks],
        entityMap,
      };
      this.handleContentChange(createEditorState(rawContentUpdated));
    }
  };

  handleContentChange = editorState => {
    this.onChange(editorState);
    this.props.onChange(convertToRaw(editorState.getCurrentContent()));
  };

  render() {
    const { editorState, isMounted, editorEnabled } = this.state;
    return (
      <div className="waiv-editor">
        {isMounted ? (
          <MediumDraftEditor
            ref={this.refsEditor}
            placeholder=""
            editorEnabled={editorEnabled && this.props.enabled}
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
