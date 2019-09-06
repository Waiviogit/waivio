import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Badge } from 'antd';
import { debounce, has, kebabCase, throttle, uniqBy } from 'lodash';
import requiresLogin from '../../auth/requiresLogin';
import {
  getAuthenticatedUser,
  getLocale,
  getDraftPosts,
  getIsEditorLoading,
  getIsEditorSaving,
  getIsImageUploading,
  getUpvoteSetting,
} from '../../reducers';
import { createPost, saveDraft } from '../Write/editorActions';
import { createPostMetadata, splitPostContent, getInitialState } from '../../helpers/postHelpers';
import Editor from '../../components/EditorExtended/EditorExtended';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { Entity, toMarkdown } from '../../components/EditorExtended';
import LastDraftsContainer from '../Write/LastDraftsContainer';
import ObjectCreation from '../../components/Sidebar/ObjectCreation/ObjectCreation';
import { setObjPercents } from '../../helpers/wObjInfluenceHelper';
import './EditPost.less';

const getLinkedObjects = contentStateRaw => {
  const objEntities = Object.values(contentStateRaw.entityMap).filter(
    entity => entity.type === Entity.OBJECT && has(entity, 'data.object.type'),
  );
  return uniqBy(objEntities.map(entity => entity.data.object), 'id');
};

@injectIntl
@requiresLogin
@withRouter
@connect(
  (state, props) => ({
    user: getAuthenticatedUser(state),
    locale: getLocale(state),
    draftPosts: getDraftPosts(state),
    publishing: getIsEditorLoading(state),
    saving: getIsEditorSaving(state),
    imageLoading: getIsImageUploading(state),
    draftId: new URLSearchParams(props.location.search).get('draft'),
    initObjects: new URLSearchParams(props.location.search).getAll('object'),
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
    draftPosts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    draftId: PropTypes.string,
    publishing: PropTypes.bool,
    saving: PropTypes.bool,
    imageLoading: PropTypes.bool,
    createPost: PropTypes.func,
    saveDraft: PropTypes.func,
  };
  static defaultProps = {
    upvoteSetting: false,
    draftId: '',
    publishing: false,
    saving: false,
    imageLoading: false,
    isNewPost: false,
    createPost: () => {},
    saveDraft: () => {},
  };

  constructor(props) {
    super(props);

    this.state = getInitialState(props);

    this.handleTopicsChange = this.handleTopicsChange.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.buildPost = this.buildPost.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.draftId && nextProps.draftId !== prevState.draftId) {
      return getInitialState(nextProps);
    } else if (nextProps.draftId === null && prevState.draftId) {
      const nextState = getInitialState(nextProps);
      nextProps.history.push({
        pathname: nextProps.location.pathname,
        search: `draft=${nextState.draftId}`,
      });
      return nextState;
    }
    return null;
  }

  setIsPreview = () => this.setState({ isPreview: true });

  handleChangeContent(rawContent) {
    const nextState = { content: toMarkdown(rawContent) };
    const linkedObjects = getLinkedObjects(rawContent);
    const isLinkedObjectsChanged = this.state.linkedObjects.length !== linkedObjects.length;
    if (isLinkedObjectsChanged) {
      const objPercentage = setObjPercents(linkedObjects, this.state.objPercentage);
      nextState.linkedObjects = linkedObjects;
      nextState.objPercentage = objPercentage;
    }
    if (this.state.content !== nextState.content || isLinkedObjectsChanged) {
      this.setState(nextState, this.handleUpdateState);
    }
  }

  handleTopicsChange = topics => this.setState({ topics }, this.handleUpdateState);

  handleSettingsChange = updatedValue =>
    this.setState(
      prevState => ({
        settings: { ...prevState.settings, ...updatedValue },
      }),
      this.handleUpdateState,
    );

  handlePercentChange = percentage => {
    this.setState({ objPercentage: percentage }, this.handleUpdateState);
  };

  handleSubmit() {
    const postData = this.buildPost();
    this.props.createPost(postData);
  }

  buildPost() {
    const {
      draftId,
      parentPermlink,
      content,
      topics,
      linkedObjects,
      objPercentage,
      settings,
      forecastValues: { selectForecast, ...forecast },
      expForecast,
      isUpdating,
      permlink,
      originalBody,
    } = this.state;
    const { postTitle, postBody } = splitPostContent(content);

    const postData = {
      body: postBody,
      title: postTitle,
      lastUpdated: Date.now(),
      isUpdating,
      draftId,
      ...settings,
    };

    postData.parentAuthor = '';
    postData.parentPermlink = parentPermlink;
    postData.author = this.props.user.name || '';
    postData.permlink = permlink || kebabCase(postTitle);

    const currDraft = this.props.draftPosts.find(d => d.draftId === this.props.draftId);
    const oldMetadata = currDraft && currDraft.jsonMetadata;
    const waivioData = {
      wobjects: linkedObjects.map(obj => ({
        objectName: obj.name,
        author_permlink: obj.id,
        percent: objPercentage[obj.id].percent,
      })),
    };

    const appData = {
      waivioData,
      forecast: getForecastObject(forecast, selectForecast, !isEmpty(expForecast)),
    };

    postData.jsonMetadata = createPostMetadata(postBody, topics, oldMetadata, appData);

    if (appData.forecast) {
      postData.body = attachPostInfo(postData, appData.forecast);
    }

    if (originalBody) {
      postData.originalBody = originalBody;
    }

    return postData;
  }

  handleUpdateState = () => throttle(this.saveDraft, 200, { leading: false, trailing: true })();

  handleForecastChange = forecastValues => this.setState({ forecastValues });

  saveDraft = debounce(() => {
    if (this.props.saving) return;

    const draft = this.buildPost();
    const postBody = draft.body;
    // Remove zero width space
    const isBodyEmpty = postBody.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;
    if (isBodyEmpty) return;

    const redirect = this.props.draftId !== this.state.draftId;
    if (this.state.expForecast) {
      postData.exp_forecast = this.state.expForecast;
    }
    const id = this.props.draftId;
    const redirect = id && id !== this.draftId;

    this.props.saveDraft(draft, redirect, this.props.intl);

    // if (!this.props.draftPosts.includes(d => d.draftId === this.props.draftId)) {
    //   this.setState({ draftContent: { title: draft.title, body: draft.body } });
    // }
  }, 1500);

  render() {
    const {
      draftContent,
      content,
      topics,
      linkedObjects,
      objPercentage,
      settings,
      forecastValues,
      expForecast,
      isUpdating,
      isPreview,
    } = this.state;
    const { saving, publishing, imageLoading, locale, draftPosts } = this.props;
    return (
      <div className="shifted">
        <div className="post-layout container">
          <div className="center">
            <Editor
              enabled={!imageLoading}
              initialContent={draftContent}
              locale={locale === 'auto' ? 'en-US' : locale}
              onChange={this.handleChangeContent}
            />
            {draftPosts.some(d => d.draftId === this.state.draftId) && (
              <div className="edit-post__saving-badge">
                {saving ? (
                  <Badge status="error" text="saving" />
                ) : (
                  <Badge status="success" text="saved" />
                )}
              </div>
            )}
            <CreatePostForecast
              forecastValues={forecastValues}
              onChange={this.handleForecastChange}
              isPosted={isPreview}
              isUpdating={isUpdating}
            />
            <PostPreviewModal
              content={content}
              topics={topics}
              linkedObjects={linkedObjects}
              objPercentage={objPercentage}
              settings={settings}
              forecastValues={forecastValues}
              expForecast={expForecast}
              isPublishing={publishing}
              isUpdating={isUpdating}
              onTopicsChange={this.handleTopicsChange}
              onSettingsChange={this.handleSettingsChange}
              onPercentChange={this.handlePercentChange}
              onReadyBtnClick={this.setIsPreview}
              onSubmit={this.handleSubmit}
              onUpdate={this.saveDraft}
            />
            {linkedObjects.map(wObj => (
              <ObjectCardView wObject={wObj} key={wObj.id} />
            ))}
          </div>
          <div className="rightContainer">
            <div className="right">
              <ObjectCreation />
              <LastDraftsContainer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditPost;
