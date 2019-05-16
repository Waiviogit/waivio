import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Badge } from 'antd';
import { debounce, has, isEqual, isEmpty, kebabCase, throttle, uniqBy } from 'lodash';
import uuidv4 from 'uuid/v4';
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
import { WAIVIO_PARENT_PERMLINK } from '../../../common/constants/waivio';
import { createPostMetadata, splitPostContent, getInitialValues } from '../../helpers/postHelpers';
import Editor from '../../components/EditorExtended/EditorExtended';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { Entity, toMarkdown } from '../../components/EditorExtended';
import LastDraftsContainer from '../Write/LastDraftsContainer';
import ObjectCreation from '../../components/Sidebar/ObjectCreation/ObjectCreation';
import { setObjPercents } from '../../helpers/wObjInfluenceHelper';
import CreatePostForecast from '../../../investarena/components/CreatePostForecast';
import { getForecastObject } from '../../../investarena/components/CreatePostForecast/helpers';
import './EditPost.less';

const getLinkedObjects = contentStateRaw => {
  const objEntities = Object.values(contentStateRaw.entityMap).filter(
    entity => entity.type === Entity.OBJECT && has(entity, 'data.object.type'),
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
    publishing: getIsEditorLoading(state),
    saving: getIsEditorSaving(state),
    imageLoading: getIsImageUploading(state),
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
    createPost: () => {},
    saveDraft: () => {},
  };

  constructor(props) {
    super(props);

    const init = getInitialValues(props);
    this.state = init.state;

    this.draftId = props.draftId || uuidv4();
    this.permlink = init.permlink;
    this.originalBody = init.originalBody;
    this.handleTopicsChange = this.handleTopicsChange.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.buildPost = this.buildPost.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const differentDraft = this.props.draftId !== nextProps.draftId;
    if (differentDraft) {
      const init = getInitialValues(nextProps);
      this.setState(init.state);
      this.permlink = init.permlink;
      this.originalBody = init.originalBody;
      this.draftId = nextProps.draftId || uuidv4();
    }
  }

  setIsPreview = () => this.setState({ isPreview: true });

  handleChangeContent(rawContent) {
    const nextState = { content: toMarkdown(rawContent) };
    this.handleUpdateState(nextState.content);
    const linkedObjects = getLinkedObjects(rawContent);
    if (this.state.linkedObjects.length !== linkedObjects.length) {
      const objPercentage = setObjPercents(linkedObjects, this.state.objPercentage);
      nextState.linkedObjects = linkedObjects;
      nextState.objPercentage = objPercentage;
    }
    this.setState(nextState);
    // console.log('raw content:', JSON.stringify(rawContent));
    // console.log('content:', nextState);
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
      content,
      topics,
      linkedObjects,
      objPercentage,
      settings,
      forecastValues: { selectForecast, ...forecast },
      expForecast,
      isUpdating,
    } = this.state;
    const { postTitle, postBody } = splitPostContent(content);

    const postData = {
      body: postBody,
      title: postTitle,
      lastUpdated: Date.now(),
      isUpdating,
      draftId: this.draftId,
      ...settings,
    };

    postData.parentAuthor = '';
    postData.parentPermlink = WAIVIO_PARENT_PERMLINK;
    postData.author = this.props.user.name || '';
    postData.permlink = this.permlink || kebabCase(postTitle);

    const oldMetadata =
      this.props.draftPosts[this.props.draftId] &&
      this.props.draftPosts[this.props.draftId].jsonMetadata;
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

    if (this.originalBody) {
      postData.originalBody = this.originalBody;
    }

    return postData;
  }

  handleUpdateState = nextContent => {
    if (isEqual(this.state.content, nextContent)) return;
    throttle(this.saveDraft, 200, { leading: false, trailing: true })();
  };

  handleForecastChange = forecastValues => this.setState({ forecastValues });

  saveDraft = debounce(() => {
    if (this.props.saving) return;

    const postData = this.buildPost();
    const postBody = postData.body;
    const id = this.props.draftId;
    // Remove zero width space
    const isBodyEmpty = postBody.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;

    if (isBodyEmpty) return;
    if (this.state.expForecast) {
      postData.exp_forecast = this.state.expForecast;
    }
    const redirect = id !== this.draftId;

    this.props.saveDraft({ postData, id: this.draftId }, redirect, this.props.intl);
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
    const { draftId, saving, publishing, imageLoading, locale } = this.props;
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
            {draftId && (
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
