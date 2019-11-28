import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Badge } from 'antd';
import { debounce, get, has, kebabCase, throttle, uniqBy } from 'lodash';
import requiresLogin from '../../auth/requiresLogin';
import { getCampaignById } from '../../../waivioApi/ApiClient';
import {
  getAuthenticatedUser,
  getDraftPosts,
  getIsEditorLoading,
  getIsEditorSaving,
  getIsImageUploading,
  getUpvoteSetting,
  getSuitableLanguage,
} from '../../reducers';
import { createPost, saveDraft } from '../Write/editorActions';
import { createPostMetadata, splitPostContent, getInitialState } from '../../helpers/postHelpers';
import Editor from '../../components/EditorExtended/EditorExtended';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import PostObjectCard from '../PostObjectCard/PostObjectCard';
import { Entity, toMarkdown } from '../../components/EditorExtended';
import LastDraftsContainer from '../Write/LastDraftsContainer';
import ObjectCreation from '../../components/Sidebar/ObjectCreation/ObjectCreation';
import { setObjPercents } from '../../helpers/wObjInfluenceHelper';
import './EditPost.less';

const getLinkedObjects = contentStateRaw => {
  const objEntities = Object.values(contentStateRaw.entityMap).filter(
    entity => entity.type === Entity.OBJECT && has(entity, 'data.object.type'),
  );
  return uniqBy(
    objEntities.map(entity => entity.data.object),
    'id',
  );
};

@injectIntl
@requiresLogin
@withRouter
@connect(
  (state, props) => ({
    user: getAuthenticatedUser(state),
    locale: getSuitableLanguage(state),
    draftPosts: getDraftPosts(state),
    publishing: getIsEditorLoading(state),
    saving: getIsEditorSaving(state),
    imageLoading: getIsImageUploading(state),
    campaignId: new URLSearchParams(props.location.search).get('campaign'),
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
    userName: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    draftPosts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    campaignId: PropTypes.string, // eslint-disable-line
    draftId: PropTypes.string,
    publishing: PropTypes.bool,
    saving: PropTypes.bool,
    imageLoading: PropTypes.bool,
    createPost: PropTypes.func,
    saveDraft: PropTypes.func,
  };
  static defaultProps = {
    upvoteSetting: false,
    campaignId: '',
    draftId: '',
    publishing: false,
    saving: false,
    imageLoading: false,
    createPost: () => {},
    saveDraft: () => {},
  };

  constructor(props) {
    super(props);

    this.state = getInitialState(props);

    this.buildPost = this.buildPost.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleLinkedObject = this.handleToggleLinkedObject.bind(this);
    this.handleTopicsChange = this.handleTopicsChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.draftId && nextProps.draftId !== prevState.draftId) {
      return getInitialState(nextProps);
    } else if (nextProps.draftId === null && prevState.draftId) {
      const nextState = getInitialState(nextProps);
      nextProps.history.replace({
        pathname: nextProps.location.pathname,
        search: `draft=${nextState.draftId}`,
      });
      return nextState;
    }
    return null;
  }

  componentDidMount() {
    const { campaign } = this.state;
    if (campaign && campaign.id) {
      getCampaignById(campaign.id)
        .then(campaignData => this.setState({ campaign: { ...campaignData, fetched: true } }))
        .catch(error => console.log('Failed to get campaign data:', error));
    }
  }

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

  handleToggleLinkedObject(objId, isLinked) {
    const { linkedObjects, objPercentage } = this.state;
    const updPercentage = {
      ...objPercentage,
      [objId]: { percent: isLinked ? 33 : 0 }, // 33 - just non zero value
    };
    this.setState({ objPercentage: setObjPercents(linkedObjects, updPercentage) });
  }

  buildPost() {
    const {
      draftId,
      campaign,
      parentPermlink,
      content,
      topics,
      linkedObjects,
      objPercentage,
      settings,
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

    if (campaign && campaign.alias) {
      postData.body += `\n***\n${this.props.intl.formatMessage({
        id: `check_review_post_add_text`,
        defaultMessage: 'This review was sponsored in part by',
      })} ${campaign.alias} ([@${campaign.guideName}](/@${campaign.guideName}))`;
    }

    postData.parentAuthor = '';
    postData.parentPermlink = parentPermlink;
    postData.author = this.props.user.name || '';
    postData.permlink = permlink || kebabCase(postTitle);

    const currDraft = this.props.draftPosts.find(d => d.draftId === this.props.draftId);
    const oldMetadata = currDraft && currDraft.jsonMetadata;
    const waivioData = {
      wobjects: linkedObjects
        .filter(obj => objPercentage[obj.id].percent > 0)
        .map(obj => ({
          objectName: obj.name,
          author_permlink: obj.id,
          percent: objPercentage[obj.id].percent,
        })),
    };

    postData.jsonMetadata = createPostMetadata(postBody, topics, oldMetadata, waivioData);

    if (originalBody) {
      postData.originalBody = originalBody;
    }

    return postData;
  }

  handleUpdateState = () => throttle(this.saveDraft, 200, { leading: false, trailing: true })();

  saveDraft = debounce(() => {
    if (this.props.saving) return;

    const draft = this.buildPost();
    const postBody = draft.body;
    // Remove zero width space
    const isBodyEmpty = postBody.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;
    if (isBodyEmpty) return;

    const redirect = this.props.draftId !== this.state.draftId;

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
      campaign,
      isUpdating,
    } = this.state;
    const { saving, publishing, imageLoading, locale, draftPosts } = this.props;
    return (
      <div className="shifted">
        <div className="post-layout container">
          <div className="center">
            <Editor
              enabled={!imageLoading}
              initialContent={draftContent}
              locale={locale}
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
            <PostPreviewModal
              content={content}
              isPublishing={publishing}
              isUpdating={isUpdating}
              linkedObjects={linkedObjects}
              objPercentage={objPercentage}
              onUpdate={this.saveDraft}
              reviewData={
                campaign && campaign.fetched
                  ? { campaign, reviewer: { name: this.props.userName } }
                  : null
              }
              settings={settings}
              topics={topics}
              onPercentChange={this.handlePercentChange}
              onSettingsChange={this.handleSettingsChange}
              onSubmit={this.handleSubmit}
              onTopicsChange={this.handleTopicsChange}
            />
            {linkedObjects.map(wObj => (
              <PostObjectCard
                isLinked={get(objPercentage, [wObj.id, 'percent'], 0) > 0}
                wObject={wObj}
                onToggle={this.handleToggleLinkedObject}
                key={wObj.id}
              />
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
