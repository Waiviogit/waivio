import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { get, debounce, kebabCase } from 'lodash';
import uuidv4 from 'uuid/v4';
import {
  getAuthenticatedUser,
  getDraftPosts,
  getIsEditorSaving,
  getUpvoteSetting,
} from '../../reducers';
import { createPost, saveDraft } from '../Write/editorActions';
import { WAIVIO_PARENT_PERMLINK } from '../../../common/constants/waivio';
import { getDraftContent, createPostMetadata } from '../../helpers/postHelpers';
import Editor from '../../components/EditorExtended/EditorExtended';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { Entity, toMarkdown } from '../../components/EditorExtended';
import LastDraftsContainer from '../Write/LastDraftsContainer';
import { rewardsValues } from '../../../common/constants/rewards';

const getLinkedObjects = contentStateRaw => {
  const entities = Object.values(contentStateRaw.entityMap).filter(
    entity => entity.type === Entity.OBJECT,
  );
  return entities.map(entity => entity.data.object);
};

@injectIntl
@withRouter
@connect(
  (state, props) => ({
    user: getAuthenticatedUser(state),
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
    draftPosts: PropTypes.shape().isRequired,
    upvoteSetting: PropTypes.bool,
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

    this.state = {
      draftContent: getDraftContent(get(props.draftPosts, props.draftId, {})),
      content: '',
      topics: [],
      linkedObjects: [],
      settings: {
        reward: rewardsValues.half,
        beneficiary: false,
        upvote: props.upvoteSetting,
      },
    };

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
      const { draftPosts, draftId } = nextProps;
      this.setState({ draftContent: getDraftContent(get(draftPosts, draftId, {})) });
      this.draftId = draftId;
    }
  }

  handleChangeContent(rawContent) {
    const nextState = { content: toMarkdown(rawContent) };
    const linkedObjects = getLinkedObjects(rawContent);
    if (this.state.linkedObjects.length !== linkedObjects.length) {
      nextState.linkedObjects = linkedObjects;
    }
    this.setState(nextState);
    // console.log('raw content:', JSON.stringify(rawContent));
    // console.log('content:', nextState);
  }

  handleTopicsChange = (topics, callback) => this.setState({ topics }, callback);

  handleSettingsChange = (updatedValue, callback) =>
    this.setState(
      prevState => ({
        settings: { ...prevState.settings, ...updatedValue },
      }),
      callback,
    );

  handleSubmit(data) {
    const postData = this.buildPost(data);
    console.log('POST_DATA', postData);
    this.props.createPost(postData);
  }

  buildPost(data) {
    const postData = {
      body: data.body,
      title: data.title,
      reward: data.reward || '0',
      beneficiary: !!data.beneficiary,
      upvote: !!data.upvote,
      lastUpdated: Date.now(),
    };

    postData.parentAuthor = '';
    postData.parentPermlink = WAIVIO_PARENT_PERMLINK;
    postData.author = this.props.user.name || '';
    postData.permlink = kebabCase(data.title);
    // if (isUpdating) postData.isUpdating = isUpdating; // use for update post

    const oldMetadata =
      this.props.draftPosts[this.props.draftId] &&
      this.props.draftPosts[this.props.draftId].jsonMetadata;
    const waivioData = {
      wobjects: data.linkedObjects.map(obj => ({
        objectName: obj.name,
        author_permlink: obj.id,
        percent: obj.percent.value,
      })),
    };

    postData.jsonMetadata = createPostMetadata(data.body, data.topics, oldMetadata, waivioData);

    return postData;
  }

  saveDraft = debounce(data => {
    if (this.props.saving) return;

    const postData = this.buildPost(data);
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
    return (
      <div className="shifted">
        <div className="post-layout container">
          <div className="center">
            <Editor initialContent={draftContent} onChange={this.handleChangeContent} />
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
