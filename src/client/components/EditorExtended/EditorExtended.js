import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { CompositeDecorator, convertToRaw, EditorState } from 'draft-js';
import { forEach, get, has, isEmpty, isEqual, keyBy, includes, map } from 'lodash';
import { Input, message } from 'antd';
import {
  createEditorState,
  Editor as MediumDraftEditor,
  Entity,
  findLinkEntities,
  fromMarkdown,
} from './index';
import ImageSideButton from './components/sides/ImageSideButton';
import VideoSideButton from './components/sides/VideoSideButton';
import SeparatorButton from './components/sides/SeparatorSideButton';
import ObjectSideButton from './components/sides/ObjectSideButton';
import { getObjectsByIds } from '../../../waivioApi/ApiClient';
import ObjectLink, { findObjEntities } from './components/entities/objectlink';
import Link from './components/entities/link';
import { handlePastedLink, QUERY_APP } from './util/editorHelper';
import { getNewLinkedObjectsCards } from '../../helpers/editorHelper';

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

const defaultDecorators = new CompositeDecorator([
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
    locale: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    handleLinkedObjectsCards: PropTypes.func,
    intl: PropTypes.shape(),
    handleHashtag: PropTypes.func,
    displayTitle: PropTypes.bool,
    draftId: PropTypes.string,
    linkedObjects: PropTypes.shape(),
    linkedObjectsCards: PropTypes.shape().isRequired,
  };
  static defaultProps = {
    intl: {},
    onChange: () => {},
    handleLinkedObjectsCards: () => {},
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
      editorState: EditorState.createEmpty(defaultDecorators),
      titleValue: '',
    };

    this.onChange = editorState => {
      this.setState({ editorState });
    };
    this.refsEditor = React.createRef();
  }

  componentDidMount() {
    this.setState({ isMounted: true, titleValue: this.props.initialContent.title }); // eslint-disable-line
    this.restoreObjects(fromMarkdown(this.props.initialContent)).then(() =>
      this.setFocusAfterMount(),
    );
  }

  componentWillReceiveProps(nextProps) {
    sessionStorage.setItem('linkedObjects', JSON.stringify(this.props.linkedObjects));
    sessionStorage.setItem('linkedObjectsCards', JSON.stringify(this.props.linkedObjectsCards));
    if (!isEqual(this.props.initialContent, nextProps.initialContent)) {
      setTimeout(() => {
        this.setState({ editorEnabled: false, titleValue: nextProps.initialContent.title });
        const rawContent = fromMarkdown(nextProps.initialContent);

        this.handleContentChange(createEditorState(rawContent));
        this.restoreObjects(rawContent, true).then(() => this.setFocusAfterMount());
      }, 0);
    }
  }

  setFocusAfterMount = () => {
    setTimeout(() => this.refsEditor.current.focus(), 0);
    this.setState({ editorEnabled: true });
  };

  getCurrentLinkPermlink = value => {
    const data = get(value, 'data.url', '');
    const currentSeparator = data.split('/');

    return get(currentSeparator, '[4]', []);
  };

  getCurrentLoadObjects = (response, value) => {
    const loadObjects = keyBy(response.wobjects, 'author_permlink');

    if (value.type === Entity.OBJECT) {
      return loadObjects[get(value, 'data.object.id')];
    } else if (value.type === Entity.LINK) {
      return loadObjects[this.getCurrentLinkPermlink(value)];
    }

    return loadObjects;
  };

  restoreObjects = async (rawContent, newObject) => {
    const { draftId, linkedObjectsCards, handleLinkedObjectsCards } = this.props;
    const currLinkedObjects = JSON.parse(sessionStorage.getItem('linkedObjects')) || [];
    const linkedObjectsCardsSession =
      JSON.parse(sessionStorage.getItem('linkedObjectsCards')) || [];
    const linkedCards = linkedObjectsCards || linkedObjectsCardsSession;
    const isReview = includes(draftId, 'review');
    const isLinked = string =>
      currLinkedObjects.some(item => item.defaultShowLink.includes(string));

    const objectIds = Object.values(rawContent.entityMap)
      // eslint-disable-next-line array-callback-return,consistent-return
      .filter(entity => {
        if (entity.type === Entity.OBJECT) {
          return has(entity, 'data.object.id');
        }
        if (!isReview && entity.type === Entity.LINK) {
          const string = get(entity, 'data.url', '');
          const queryString = string.match(handlePastedLink(QUERY_APP));

          if (queryString) {
            return has(entity, 'data.url');
          }

          return null;
        }
      })
      // eslint-disable-next-line array-callback-return,consistent-return
      .map(entity => {
        if (
          entity.type === Entity.OBJECT &&
          (isLinked(get(entity, ['data', 'object', 'id'], '')) || newObject)
        ) {
          return get(entity, 'data.object.id', '');
        }
        if (
          !isReview &&
          entity.type === Entity.LINK &&
          (isLinked(get(entity, 'data.url', '')) || newObject)
        ) {
          return this.getCurrentLinkPermlink(entity);
        }
      })
      .filter(item => item);
    const newLinkedObjectsCards = getNewLinkedObjectsCards(
      linkedCards,
      objectIds,
      Object.values(rawContent.entityMap),
    );

    handleLinkedObjectsCards(newLinkedObjectsCards);

    if (objectIds.length) {
      const response = await getObjectsByIds({
        authorPermlinks: objectIds,
        locale: this.props.locale,
        requiredFields: ['rating'],
      });

      const entityMap = {};

      forEach(rawContent.entityMap, (value, key) => {
        let currObj = null;
        const loadedObject = this.getCurrentLoadObjects(response, value);

        currLinkedObjects.push(loadedObject);
        if (!isEmpty(currLinkedObjects) && !isEmpty(loadedObject)) {
          map(currLinkedObjects, obj => {
            if (isEqual(obj.author_permlink, loadedObject.author_permlink)) {
              currObj = loadedObject;
            }
          });
        } else {
          currObj = loadedObject;
        }

        entityMap[key] = {
          ...value,
          data: currObj ? { ...value.data, object: currObj } : { ...value.data },
        };
      });
      const rawContentUpdated = {
        blocks: [...rawContent.blocks],
        entityMap,
      };

      setTimeout(
        () =>
          this.handleContentChange(
            EditorState.moveFocusToEnd(createEditorState(rawContentUpdated)),
          ),
        0,
      );
    }
    // eslint-disable-next-line no-unused-expressions
    !isEmpty(rawContent.blocks) &&
      setTimeout(
        () => this.handleContentChange(EditorState.moveFocusToEnd(createEditorState(rawContent))),
        0,
      );
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
