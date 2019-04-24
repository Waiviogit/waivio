import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { debounce, find, isEqual, kebabCase, throttle, uniqBy } from 'lodash';
import uuidv4 from 'uuid/v4';
import {
  getAuthenticatedUser,
  getLocale,
  getDraftPosts,
  getIsEditorSaving,
  getUpvoteSetting,
} from '../../reducers';
import { createPost, saveDraft } from '../Write/editorActions';
import { getObjectsByIds } from '../../../waivioApi/ApiClient';
import { WAIVIO_PARENT_PERMLINK } from '../../../common/constants/waivio';
import { createPostMetadata, splitPostContent, getInitialState } from '../../helpers/postHelpers';
import Editor from '../../components/EditorExtended/EditorExtended';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { Entity, toMarkdown } from '../../components/EditorExtended';
import LastDraftsContainer from '../Write/LastDraftsContainer';
import { getClientWObj } from '../../adapters';
import { setInitialPercent } from '../../helpers/wObjInfluenceHelper';

const getLinkedObjects = contentStateRaw => {
  const objEntities = Object.values(contentStateRaw.entityMap).filter(
    entity => entity.type === Entity.OBJECT,
  );
  return uniqBy(objEntities.map(entity => entity.data.object), 'id');
};

@injectIntl
@withRouter
@connect(
  (state, props) => ({
    user: getAuthenticatedUser(state),
    locale: getLocale(state),
    draftPosts: getDraftPosts(state),
    saving: getIsEditorSaving(state),
    draftId: new URLSearchParams(props.location.search).get('draft'),
    upvoteSetting: getUpvoteSetting(state),
  }),
  {
    createPost,
    saveDraft,
  },
)
class EditPost extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    locale: PropTypes.string.isRequired,
    draftPosts: PropTypes.shape().isRequired,
    // upvoteSetting: PropTypes.bool,
    draftId: PropTypes.string,
    saving: PropTypes.bool,
    createPost: PropTypes.func,
    saveDraft: PropTypes.func,
  };
  static defaultProps = {
    upvoteSetting: false,
    draftId: '',
    saving: false,
    createPost: () => {},
    saveDraft: () => {},
  };

  constructor(props) {
    super(props);

    this.state = getInitialState(props);

    this.draftId = props.draftId || uuidv4();
    this.handleTopicsChange = this.handleTopicsChange.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.buildPost = this.buildPost.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const differentDraft = this.props.draftId !== nextProps.draftId;
    if (differentDraft) {
      this.setState(getInitialState(nextProps));
      this.draftId = nextProps.draftId || uuidv4();
    }
  }

  async handleChangeContent(rawContent) {
    const nextState = { content: toMarkdown(rawContent) };
    this.handleUpdateState(nextState.content);
    const linkedObjects = getLinkedObjects(rawContent);
    if (this.state.linkedObjects.length !== linkedObjects.length) {
      nextState.linkedObjects = await this.restoreDraftObjects(linkedObjects);
    }
    this.setState(nextState);
    // console.log('raw content:', JSON.stringify(rawContent));
    // console.log('content:', nextState);
  }

  restoreDraftObjects = async editorObjects => {
    const actualObjects = editorObjects.map(obj => {
      const prevObject = find(this.state.linkedObjects, o => o.id === obj.id);
      return prevObject || obj;
    });
    const toRestore = actualObjects.filter(object => !object.type).map(o => o.id);
    if (toRestore.length) {
      const locale = this.props.locale === 'auto' ? 'en-US' : this.props.locale;
      const res = await getObjectsByIds({ authorPermlinks: toRestore, locale });
      const restored = res.map(obj => getClientWObj(obj));
      return [...actualObjects.filter(obj => !toRestore.includes(obj.id)), ...restored];
    }
    return actualObjects;
  };

  handleTopicsChange = topics => this.setState({ topics }, this.handleUpdateState);

  handleSettingsChange = updatedValue =>
    this.setState(
      prevState => ({
        settings: { ...prevState.settings, ...updatedValue },
      }),
      this.handleUpdateState,
    );

  handleSubmit(data) {
    const postData = this.buildPost(data);
    console.log('POST_DATA', postData);
    this.props.createPost(postData);
  }

  buildPost() {
    const { content, topics, linkedObjects, settings } = this.state;
    const { postTitle, postBody } = splitPostContent(content);

    const postData = {
      body: postBody,
      title: postTitle,
      lastUpdated: Date.now(),
      ...settings,
    };

    postData.parentAuthor = '';
    postData.parentPermlink = WAIVIO_PARENT_PERMLINK;
    postData.author = this.props.user.name || '';
    postData.permlink = kebabCase(postTitle);
    // if (isUpdating) postData.isUpdating = isUpdating; // use for update post

    const oldMetadata =
      this.props.draftPosts[this.props.draftId] &&
      this.props.draftPosts[this.props.draftId].jsonMetadata;
    const waivioData = {
      wobjects: setInitialPercent(linkedObjects).map(obj => ({
        objectName: obj.name,
        author_permlink: obj.id,
        percent: obj.percent.value,
      })),
    };

    postData.jsonMetadata = createPostMetadata(postBody, topics, oldMetadata, waivioData);

    return postData;
  }

  handleUpdateState = nextContent => {
    if (isEqual(this.state.content, nextContent)) return;
    throttle(this.saveDraft, 200, { leading: false, trailing: true })();
  };

  saveDraft = debounce(() => {
    if (this.props.saving) return;

    const postData = this.buildPost();
    const postBody = postData.body;
    const id = this.props.draftId;
    // Remove zero width space
    const isBodyEmpty = postBody.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;

    if (isBodyEmpty) return;

    const redirect = id !== this.draftId;

    this.props.saveDraft({ postData, id: this.draftId }, redirect, this.props.intl);
  }, 2000);

  render() {
    const { draftContent, content, topics, linkedObjects, settings } = this.state;
    const { draftId, saving } = this.props;
    return (
      <div className="shifted">
        <div className="post-layout container">
          <div className="center">
            <Editor initialContent={draftContent} onChange={this.handleChangeContent} />
            {draftId && <span>{saving ? 'saving' : 'saved'}</span>}
            <PostPreviewModal
              content={content}
              topics={topics}
              linkedObjects={linkedObjects}
              settings={settings}
              onTopicsChange={this.handleTopicsChange}
              onSettingsChange={this.handleSettingsChange}
              onSubmit={this.handleSubmit}
              onUpdate={this.saveDraft}
            />
            {linkedObjects.map(wObj => (
              <ObjectCardView wObject={wObj} key={wObj.id} />
            ))}
          </div>
          <div className="rightContainer">
            <div className="right">
              <LastDraftsContainer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditPost;
